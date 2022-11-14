import { Buffer } from 'buffer/';
import { aesUnwrapKey, aesWrapKey } from './aeskeywrap';

const unauthenticInputException = new Error('Unauthentic data. Wrong kek?');
const invalidWrapInputException = new Error('Invalid data length(s). kek must be 16, 24 or 32 bytes, key must be same length.');
const invalidUnwrapInputException = new Error('Invalid data length(s). kek must be 16, 24 or 32 bytes, wrappedKey must be 8 bytes longer.');

/**
 * Wrapps (respectively encrypts) a key with a kek (key-encryption key), using aes-key-wrap.
 * Key and kek, both must be 16, 24, or 32 bytes long
 * @param key the key to wrap (Unit8Array)
 * @param kek the kek (Unit8Array)
 * @throws an Error if key and/or kek length is invalid
 * @returns the wrapped key (Unit8Array)
 */
const wrapKey = function (key: Uint8Array, kek: Uint8Array): Uint8Array {
  const keyBuffer = Buffer.from(key);
  const kekBuffer = Buffer.from(kek);

  try {
    return new Uint8Array(aesWrapKey(keyBuffer, kekBuffer));
  } catch {
    throw invalidWrapInputException;
  }
};

/**
 * Unwrapps (respectively decrypts) a wrapped key with a kek (key-encryption key), using aes-key-unwrap.
 * Kek must be 16, 24, or 32 bytes long, wrapped key must be 8 bytes longer.
 * @param wrappedKey the wrapped key to unwrap (Unit8Array)
 * @param kek the kek (Unit8Array)
 * @throws an Error if wrappedKey and/or kek length is invalid
 * @throws an Error on unauthentic data (Message: 'Unauthentic data. Wrong kek?')
 * @returns the unwrapped key (Unit8Array)
 */
const unwrapKey = function (wrappedKey: Uint8Array, kek: Uint8Array): Uint8Array {
  const wrappedKeyBuffer = Buffer.from(wrappedKey);
  const kekBuffer = Buffer.from(kek);

  let keyBuffer: Buffer | null;

  try {
    keyBuffer = aesUnwrapKey(wrappedKeyBuffer, kekBuffer);
  } catch {
    throw invalidUnwrapInputException;
  }

  if (!keyBuffer) {
    throw unauthenticInputException;
  }

  return new Uint8Array(keyBuffer);
};

export { invalidUnwrapInputException, invalidWrapInputException, unauthenticInputException, unwrapKey, wrapKey };
