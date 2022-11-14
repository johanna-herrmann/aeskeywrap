import { Encoding, fromString, toString } from './converting';
import { unwrapKey, wrapKey } from './wrapping';

/**
 * Wraps an key with a kek, using aes-key-wrap and converts the wrapped key to an encoded string
 * @param key the key to wrap (UintArray)
 * @param kek the kek (Uint8Array)
 * @param encoding the encoding to use
 * @throws an Error if key and/or kek length is invalid
 * @returns the encoded wrapped key
 * @see {@link toString} for available encodings
 */
const wrapKeyToString = function (key: Uint8Array, kek: Uint8Array, encoding: Encoding): string {
  return toString(wrapKey(key, kek), encoding);
};

/**
 * Converts an encoded string to an Uint8Array as wrapped key and unwraps it with a kek, using aes-key-wrap
 * @param encodedWrappedKey the encoded wrapped key to unwrap
 * @param kek the kek (Uint8Array)
 * @param encoding the encoding to use
 * @throws an Error if wrappedKey and/or kek length is invalid
 * @throws an Error on unauthentic data (Message: 'Unauthentic data. Wrong kek?')
 * @returns the unwrapped key (Uint8Array)
 * @see {@link fromString} for available encodings
 */
const unwrapKeyFromString = function (encodedWrappedKey: string, kek: Uint8Array, encoding: Encoding): Uint8Array {
  return unwrapKey(fromString(encodedWrappedKey, encoding), kek);
};

export { unwrapKeyFromString, wrapKeyToString };
