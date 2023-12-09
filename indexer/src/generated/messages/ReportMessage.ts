// @ts-nocheck
import {
  Type as Report,
  encodeJson as encodeJson_1,
  decodeJson as decodeJson_1,
  encodeBinary as encodeBinary_1,
  decodeBinary as decodeBinary_1,
} from "./Report";
import {
  tsValueToJsonValueFns,
  jsonValueToTsValueFns,
} from "../runtime/json/scalar";
import {
  WireMessage,
  WireType,
} from "../runtime/wire/index";
import {
  default as serialize,
} from "../runtime/wire/serialize";
import {
  tsValueToWireValueFns,
  wireValueToTsValueFns,
} from "../runtime/wire/scalar";
import {
  default as deserialize,
} from "../runtime/wire/deserialize";

export declare namespace $ {
  export type ReportMessage = {
    data: Report[];
    highTemp: number;
    bleMacList: Uint8Array[];
    wifiMacList: Uint8Array[];
    timestamp: string;
    psOn: boolean;
  }
}

export type Type = $.ReportMessage;

export function getDefaultValue(): $.ReportMessage {
  return {
    data: [],
    highTemp: 0,
    bleMacList: [],
    wifiMacList: [],
    timestamp: "0",
    psOn: false,
  };
}

export function createValue(partialValue: Partial<$.ReportMessage>): $.ReportMessage {
  return {
    ...getDefaultValue(),
    ...partialValue,
  };
}

export function encodeJson(value: $.ReportMessage): unknown {
  const result: any = {};
  result.data = value.data.map(value => encodeJson_1(value));
  if (value.highTemp !== undefined) result.highTemp = tsValueToJsonValueFns.float(value.highTemp);
  result.bleMacList = value.bleMacList.map(value => tsValueToJsonValueFns.bytes(value));
  result.wifiMacList = value.wifiMacList.map(value => tsValueToJsonValueFns.bytes(value));
  if (value.timestamp !== undefined) result.timestamp = tsValueToJsonValueFns.uint64(value.timestamp);
  if (value.psOn !== undefined) result.psOn = tsValueToJsonValueFns.bool(value.psOn);
  return result;
}

export function decodeJson(value: any): $.ReportMessage {
  const result = getDefaultValue();
  result.data = value.data?.map((value: any) => decodeJson_1(value)) ?? [];
  if (value.highTemp !== undefined) result.highTemp = jsonValueToTsValueFns.float(value.highTemp);
  result.bleMacList = value.bleMacList?.map((value: any) => jsonValueToTsValueFns.bytes(value)) ?? [];
  result.wifiMacList = value.wifiMacList?.map((value: any) => jsonValueToTsValueFns.bytes(value)) ?? [];
  if (value.timestamp !== undefined) result.timestamp = jsonValueToTsValueFns.uint64(value.timestamp);
  if (value.psOn !== undefined) result.psOn = jsonValueToTsValueFns.bool(value.psOn);
  return result;
}

export function encodeBinary(value: $.ReportMessage): Uint8Array {
  const result: WireMessage = [];
  for (const tsValue of value.data) {
    result.push(
      [1, { type: WireType.LengthDelimited as const, value: encodeBinary_1(tsValue) }],
    );
  }
  if (value.highTemp !== undefined) {
    const tsValue = value.highTemp;
    result.push(
      [2, tsValueToWireValueFns.float(tsValue)],
    );
  }
  for (const tsValue of value.bleMacList) {
    result.push(
      [3, tsValueToWireValueFns.bytes(tsValue)],
    );
  }
  for (const tsValue of value.wifiMacList) {
    result.push(
      [4, tsValueToWireValueFns.bytes(tsValue)],
    );
  }
  if (value.timestamp !== undefined) {
    const tsValue = value.timestamp;
    result.push(
      [5, tsValueToWireValueFns.uint64(tsValue)],
    );
  }
  if (value.psOn !== undefined) {
    const tsValue = value.psOn;
    result.push(
      [6, tsValueToWireValueFns.bool(tsValue)],
    );
  }
  return serialize(result);
}

export function decodeBinary(binary: Uint8Array): $.ReportMessage {
  const result = getDefaultValue();
  const wireMessage = deserialize(binary);
  const wireFields = new Map(wireMessage);
  collection: {
    const wireValues = wireMessage.filter(([fieldNumber]) => fieldNumber === 1).map(([, wireValue]) => wireValue);
    const value = wireValues.map((wireValue) => wireValue.type === WireType.LengthDelimited ? decodeBinary_1(wireValue.value) : undefined).filter(x => x !== undefined);
    if (!value.length) break collection;
    result.data = value as any;
  }
  field: {
    const wireValue = wireFields.get(2);
    if (wireValue === undefined) break field;
    const value = wireValueToTsValueFns.float(wireValue);
    if (value === undefined) break field;
    result.highTemp = value;
  }
  collection: {
    const wireValues = wireMessage.filter(([fieldNumber]) => fieldNumber === 3).map(([, wireValue]) => wireValue);
    const value = wireValues.map((wireValue) => wireValueToTsValueFns.bytes(wireValue)).filter(x => x !== undefined);
    if (!value.length) break collection;
    result.bleMacList = value as any;
  }
  collection: {
    const wireValues = wireMessage.filter(([fieldNumber]) => fieldNumber === 4).map(([, wireValue]) => wireValue);
    const value = wireValues.map((wireValue) => wireValueToTsValueFns.bytes(wireValue)).filter(x => x !== undefined);
    if (!value.length) break collection;
    result.wifiMacList = value as any;
  }
  field: {
    const wireValue = wireFields.get(5);
    if (wireValue === undefined) break field;
    const value = wireValueToTsValueFns.uint64(wireValue);
    if (value === undefined) break field;
    result.timestamp = value;
  }
  field: {
    const wireValue = wireFields.get(6);
    if (wireValue === undefined) break field;
    const value = wireValueToTsValueFns.bool(wireValue);
    if (value === undefined) break field;
    result.psOn = value;
  }
  return result;
}
