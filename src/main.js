import * as SignedMessage from './proto/messages/dephy/message/SignedMessage.ts'
import * as RawMessage from './proto/messages/dephy/message/RawMessage.ts'
import {base58_to_binary} from "base58-js";
import {hexToBytes} from "ethereum-cryptography/utils";
import {keccak256} from "ethereum-cryptography/keccak";
import {Signature} from "@noble/secp256k1";

const enc = new TextEncoder();

export default async function main() {
    const metadataRes = await Functions.makeHttpRequest({
        url: "https://nostr-dump-worker.cf-a25.workers.dev/dump_and_pin",
        params: {
            from: args[0],
            to: args[1]
        },
        timeout: 60000
    });
    if (metadataRes.error) {
        console.error(metadataRes.error);

        throw Error(`metadataRes failed: ${JSON.stringify(metadataRes, null, 2)}`);
    }
    const metadata = metadataRes.data;
    if (metadata.error) {
        console.error(metadata.error);
        throw Error(`Functional error. Read message: ${metadata.error}`);
    }

    const cid = metadata.cid
    if (!cid) {
        throw new Error("Bad CID!")
    }

    const eventRes = await Functions.makeHttpRequest({
        url: "https://apricot-junior-parakeet-603.mypinata.cloud/ipfs/" + cid,
        timeout: 60000
    });
    if (eventRes.error) {
        console.error(eventRes.error);
        throw Error(`eventRes failed: ${JSON.stringify(eventRes, null, 2)}`);
    }
    const eventData = eventRes.data

    if (!eventData.events.every(event => {
        try {
            verifyEvent(event)
        } catch (e) {
            console.error(e, event)
            return false
        }
        return true
    })) {
        throw new Error("Event verification failed")
    }

    return Functions.encodeString(cid)
}

function verifyEvent(e) {
    if (e.kind !== 1111) {
        throw new Error('Bad event kind')
    }
    if (e.tags.filter(i => i[0] === 'c' && i[1] === 'dephy').length === 0) {
        throw new Error('Missing DePHY id tag')
    }

    const eFrom = (e.tags.filter(i => i[0] === 'dephy_from')[0]?.[1] || "").replace("did:dephy:", "")
    const eFromBuf = hexToBytes(eFrom)
    if (eFromBuf.byteLength !== 20) {
        throw new Error('Bad sender in nostr tag')
    }

    const eTo = (e.tags.filter(i => i[0] === 'dephy_to')[0]?.[1] || "").replace("did:dephy:", "")
    const eToBuf = hexToBytes(eTo)
    if (eToBuf.byteLength !== 20) {
        throw new Error('Bad recipient in nostr tag')
    }

    const signedMsg = SignedMessage.decodeBinary(base58_to_binary(e.content))

    if (signedMsg.signature.byteLength !== 65) {
        throw new Error("Bad signature length")
    }

    const nonceBuf = enc.encode(signedMsg.nonce)
    const hashedBuf = function () {
        const buf = new Uint8Array(signedMsg.raw.byteLength + nonceBuf.byteLength)
        buf.set(signedMsg.raw, 0)
        buf.set(nonceBuf, signedMsg.raw.byteLength)
        return buf
    }()
    const currHash = keccak256(hashedBuf)

    if (!compareArray(currHash, signedMsg.hash)) {
        throw new Error("Hash mismatch")
    }

    const rawMsg = RawMessage.decodeBinary(signedMsg.raw)

    if (!compareArray(eFromBuf, rawMsg.fromAddress)) {
        throw new Error('Sender mismatch')
    }
    if (!compareArray(eToBuf, rawMsg.toAddress)) {
        throw new Error('Recipient mismatch')
    }
    if (signedMsg.nonce !== rawMsg.timestamp) {
        throw new Error("Nonce and timestamp mismatch")
    }
    if (Math.abs(e.created_at - parseInt(rawMsg.timestamp)) >= 300) { // 5 minutes tolerance
        throw new Error("Bad create_at value")
    }

    const sign = Signature.fromCompact(signedMsg.signature.slice(0, 64)).addRecoveryBit(signedMsg.signature[64])
    const rPk = sign.recoverPublicKey(keccak256(signedMsg.hash)).toRawBytes(false)
    const rAddr = keccak256(rPk.slice(1)).slice(12)

    if (!compareArray(eFromBuf, rAddr)) {
        throw new Error('Bad singnature')
    }

    return e
}

function compareArray(a, b) {
    return a.length === b.length && a.every((value, index) => value === b[index])
}
