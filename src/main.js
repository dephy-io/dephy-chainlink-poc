import {SignedMessage, RawMessage} from "dephy-proto"

export default async function main() {
    const url = `https://nostr-dump-worker.cf-a25.workers.dev/dump`;

    const httpRequest = Functions.makeHttpRequest({
        url: url,
        params: {
            // todo: read from args
            from: "1700732425",
            to: "1700732845"
        },
    });

    // Execute the API request (Promise)
    const httpResponse = await httpRequest;
    if (httpResponse.error) {
        console.error(httpResponse.error);
        throw Error("Request failed");
    }

    const data = httpResponse["data"];

    if (data.error) {
        console.error(data.error);
        throw Error(`Functional error. Read message: ${data.error}`);
    }

    const verifiedEvents = data.data.events.map(i => {
        try {
            return verifyEvent(i)
        } catch (e) {
            console.warn(`Event ${i.id} dropped: `, e)
            return null
        }
    }).filter(i => !!i);
    console.log(verifiedEvents)

    // todo: upload verifiedEvents to ipfs

    return Functions.encodeString("todo: return some CID on cifs");
}

function verifyEvent(e) {
    // todo: verify event
    return e
}
