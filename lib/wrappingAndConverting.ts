import { Encoding, fromString, toString } from './converting';
import { unwrapKey, wrapKey } from './wrapping';

const wrapKeyToString = function (key: Uint8Array, kek: Uint8Array, encoding: Encoding): string {
  return toString(wrapKey(key, kek), encoding);
};

const unwrapKeyFromString = function (encodedWrappedKey: string, kek: Uint8Array, encoding: Encoding): Uint8Array {
  return unwrapKey(fromString(encodedWrappedKey, encoding), kek);
};

export { unwrapKeyFromString, wrapKeyToString };
