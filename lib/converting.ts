import { Buffer } from 'buffer/';

type Encoding = 'ascii' | 'utf8' | 'utf-8' | 'utf16le' | 'ucs2' | 'ucs-2' | 'base64' | 'base64url' | 'latin1' | 'binary' | 'hex';

const toString = function (uint8Array: Uint8Array, encoding: Encoding): string {
  if (encoding === 'base64url') {
    return Buffer.from(uint8Array).toString('base64').replaceAll('+', '-').replaceAll('/', '_');
  }

  return Buffer.from(uint8Array).toString(encoding);
};

const fromString = function (string: string, encoding: Encoding): Uint8Array {
  if (encoding === 'base64url') {
    return new Uint8Array(Buffer.from(string.replaceAll('-', '+').replaceAll('_', '/'), 'base64'));
  }

  return new Uint8Array(Buffer.from(string, encoding));
};

export { Encoding, fromString, toString };
