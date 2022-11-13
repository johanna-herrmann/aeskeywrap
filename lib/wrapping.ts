import { Buffer } from 'buffer/';
import { aesUnwrapKey, aesWrapKey } from './aeskeywrap';

const unauthenticInputException = new Error('Unauthentic data. Wrong kek?');
const invalidWrapInputException = new Error('Invalid data length(s). kek must be 16, 24 or 32 bytes, key must be same length.');
const invalidUnwrapInputException = new Error('Invalid data length(s). kek must be 16, 24 or 32 bytes, wrappedKey must be 8 bytes longer.');

const wrapKey = function (key: Uint8Array, kek: Uint8Array): Uint8Array {
  const keyBuffer = Buffer.from(key);
  const kekBuffer = Buffer.from(kek);

  try {
    return new Uint8Array(aesWrapKey(keyBuffer, kekBuffer));
  } catch {
    throw invalidWrapInputException;
  }
};

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
