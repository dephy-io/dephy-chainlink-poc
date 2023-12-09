// @ts-nocheck
import {
  tsValueToJsonValueFns,
  jsonValueToTsValueFns,
} from "../runtime/json/scalar";
import {
  WireMessage,
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
  export type Report = {
    curr: number;
    volt: number;
    power: number;
    pf: number;
    deltaEnergy: number;
  }
}

export type Type = $.Report;

export function getDefaultValue(): $.Report {
  return {
    curr: 0,
    volt: 0,
    power: 0,
    pf: 0,
    deltaEnergy: 0,
  };
}

export function createValue(partialValue: Partial<$.Report>): $.Report {
  return {
    ...getDefaultValue(),
    ...partialValue,
  };
}

export function encodeJson(value: $.Report): unknown {
  const result: any = {};
  if (value.curr !== undefined) result.curr = tsValueToJsonValueFns.float(value.curr);
  if (value.volt !== undefined) result.volt = tsValueToJsonValueFns.float(value.volt);
  if (value.power !== undefined) result.power = tsValueToJsonValueFns.float(value.power);
  if (value.pf !== undefined) result.pf = tsValueToJsonValueFns.float(value.pf);
  if (value.deltaEnergy !== undefined) result.deltaEnergy = tsValueToJsonValueFns.float(value.deltaEnergy);
  return result;
}

export function decodeJson(value: any): $.Report {
  const result = getDefaultValue();
  if (value.curr !== undefined) result.curr = jsonValueToTsValueFns.float(value.curr);
  if (value.volt !== undefined) result.volt = jsonValueToTsValueFns.float(value.volt);
  if (value.power !== undefined) result.power = jsonValueToTsValueFns.float(value.power);
  if (value.pf !== undefined) result.pf = jsonValueToTsValueFns.float(value.pf);
  if (value.deltaEnergy !== undefined) result.deltaEnergy = jsonValueToTsValueFns.float(value.deltaEnergy);
  return result;
}

export function encodeBinary(value: $.Report): Uint8Array {
  const result: WireMessage = [];
  if (value.curr !== undefined) {
    const tsValue = value.curr;
    result.push(
      [1, tsValueToWireValueFns.float(tsValue)],
    );
  }
  if (value.volt !== undefined) {
    const tsValue = value.volt;
    result.push(
      [2, tsValueToWireValueFns.float(tsValue)],
    );
  }
  if (value.power !== undefined) {
    const tsValue = value.power;
    result.push(
      [3, tsValueToWireValueFns.float(tsValue)],
    );
  }
  if (value.pf !== undefined) {
    const tsValue = value.pf;
    result.push(
      [4, tsValueToWireValueFns.float(tsValue)],
    );
  }
  if (value.deltaEnergy !== undefined) {
    const tsValue = value.deltaEnergy;
    result.push(
      [5, tsValueToWireValueFns.float(tsValue)],
    );
  }
  return serialize(result);
}

export function decodeBinary(binary: Uint8Array): $.Report {
  const result = getDefaultValue();
  const wireMessage = deserialize(binary);
  const wireFields = new Map(wireMessage);
  field: {
    const wireValue = wireFields.get(1);
    if (wireValue === undefined) break field;
    const value = wireValueToTsValueFns.float(wireValue);
    if (value === undefined) break field;
    result.curr = value;
  }
  field: {
    const wireValue = wireFields.get(2);
    if (wireValue === undefined) break field;
    const value = wireValueToTsValueFns.float(wireValue);
    if (value === undefined) break field;
    result.volt = value;
  }
  field: {
    const wireValue = wireFields.get(3);
    if (wireValue === undefined) break field;
    const value = wireValueToTsValueFns.float(wireValue);
    if (value === undefined) break field;
    result.power = value;
  }
  field: {
    const wireValue = wireFields.get(4);
    if (wireValue === undefined) break field;
    const value = wireValueToTsValueFns.float(wireValue);
    if (value === undefined) break field;
    result.pf = value;
  }
  field: {
    const wireValue = wireFields.get(5);
    if (wireValue === undefined) break field;
    const value = wireValueToTsValueFns.float(wireValue);
    if (value === undefined) break field;
    result.deltaEnergy = value;
  }
  return result;
}
