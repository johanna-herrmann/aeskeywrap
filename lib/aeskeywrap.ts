// Implemented, following this specification: https://www.heise.de/netze/rfc/rfcs/rfc3394.shtml (index approach),
// originated by http://csrc.nist.gov/encryption/kms/key-wrap.pdf
// Tested, using this test vectors:
// * https://datatracker.ietf.org/doc/html/rfc3394#section-4.1
// * https://datatracker.ietf.org/doc/html/rfc3394#section-4.4
// * https://datatracker.ietf.org/doc/html/rfc3394#section-4.6
// Also tested with random values, checking the formular: key = unwrap(wrap(key, kek), kek)

/* eslint-disable id-length */

import { Buffer } from 'buffer/';
import forge from 'node-forge';

const iv = Buffer.from('A6'.repeat(8), 'hex');
const paddingOf16Byte = Buffer.from('10'.repeat(16), 'hex');

const checkKekLength = (kek: Buffer): void => {
  if (kek.length !== 16 && kek.length !== 24 && kek.length !== 32) {
    throw new Error('invalid kek length');
  }
};

const checkWrapInputLengths = (key: Buffer, kek: Buffer): void => {
  checkKekLength(kek);

  if (key.length !== kek.length) {
    throw new Error('invalid key length');
  }
};

const checkUnwrapInputLengths = (wrappedKey: Buffer, kek: Buffer): void => {
  checkKekLength(kek);

  if (wrappedKey.length !== (kek.length + 8)) {
    throw new Error('invalid wrappedKey length');
  }
};

const split = (input: Buffer): Buffer[] => {
  const output: Buffer[] = [];
  const partSize = 8;

  for (let i = 0; i < input.length / partSize; i++) {
    output[i] = input.slice(partSize * i, partSize * (i + 1));
  }

  return output;
};

const join = (parts: Buffer[]): Buffer => Buffer.concat([ ...parts ]);

const copyBuffer = (src: Buffer): Buffer => {
  const copy = Buffer.from(new Uint8Array(src.length));

  src.copy(copy);

  return copy;
};

const xorBufferAndNumber = (buffer: Buffer, number: number): Uint8Array => {
  const numberUint8 = new Uint8Array(buffer.length);
  const resultingUint8 = new Uint8Array(buffer.length);

  numberUint8.set([ number ], buffer.length - 1);

  for (let i = 0; i < buffer.length; i++) {
    const left = buffer.at(i) ?? 0;
    const right = numberUint8.at(i) ?? 0;

    // eslint-disable-next-line no-bitwise
    resultingUint8.set([ left ^ right ], i);
  }

  return resultingUint8;
};

const calculateT = (n: number, j: number, i: number): number => (n * j) + i + 1;

const writeUint8ArrayToBuffer = (buffer: Buffer, uint8: Uint8Array): void => {
  for (let i = 0; i < uint8.length; i++) {
    buffer.writeUInt8(uint8.at(i) ?? 0, i);
  }
};

const aesEncrypt = (key: Buffer, plaintext: Buffer): Buffer => {
  const keyForgeBuffer = forge.util.createBuffer(key, 'raw');
  const plainForgeBuffer = forge.util.createBuffer(plaintext, 'raw');
  const cipher = forge.cipher.createCipher('AES-ECB', keyForgeBuffer);

  cipher.start({});
  cipher.update(plainForgeBuffer);
  cipher.finish();

  // Drop last 16 byte since this is the padding (padding can't be disabled with node-forge, unfortunately)
  return Buffer.from(cipher.output.bytes(), 'binary').slice(0, -16);
};

// Restore padding (padding can't be disabled with node-forge, unfortunately)
const restorePadding = (ciphertextWithoutPadding: Buffer, key: Buffer): Buffer => {
  const padding = aesEncrypt(key, paddingOf16Byte);

  return join([ ciphertextWithoutPadding, padding ]);
};

const aesDecrypt = (key: Buffer, ciphertext: Buffer): Buffer => {
  const ciphertextPadded = restorePadding(ciphertext, key);
  const keyForgeBuffer = forge.util.createBuffer(key, 'raw');
  const cipherForgeBuffer = forge.util.createBuffer(ciphertextPadded, 'raw');
  const cipher = forge.cipher.createDecipher('AES-ECB', keyForgeBuffer);

  cipher.start({});
  cipher.update(cipherForgeBuffer);
  cipher.finish();

  return Buffer.from(cipher.output.bytes(), 'binary');
};

const doWrappingTransformation = (A: Buffer, R: Buffer[], kek: Buffer, n: number, j: number, i: number): void => {
  const t = calculateT(n, j, i);
  const W = join([ A, R[i] ]);
  const B = aesEncrypt(kek, W);
  const splitted = split(B);
  const xored = xorBufferAndNumber(splitted[0], t);

  writeUint8ArrayToBuffer(A, xored);

  // eslint-disable-next-line no-param-reassign
  R[i] = splitted[1];
};

const doWrappingRound = (A: Buffer, R: Buffer[], kek: Buffer, n: number, j: number): void => {
  for (let i = 0; i < n; i++) {
    doWrappingTransformation(A, R, kek, n, j, i);
  }
};

const doUnwrappingTransformation = (A: Buffer, R: Buffer[], kek: Buffer, n: number, j: number, i: number): void => {
  const t = calculateT(n, j, i);
  const xored = xorBufferAndNumber(A, t);
  const B = join([ Buffer.from(xored), R[i] ]);
  const W = aesDecrypt(kek, B);
  const splitted = split(W);

  A.write(splitted[0].toString('binary'), 0, splitted[0].length, 'binary');

  // eslint-disable-next-line no-param-reassign
  R[i] = splitted[1];
};

const doUnwrappingRound = (A: Buffer, R: Buffer[], kek: Buffer, n: number, j: number): void => {
  for (let i = n - 1; i >= 0; i--) {
    doUnwrappingTransformation(A, R, kek, n, j, i);
  }
};

const aesWrapKey = (key: Buffer, kek: Buffer): Buffer => {
  checkWrapInputLengths(key, kek);

  const R = split(key);
  const n = R.length;

  const A = copyBuffer(iv);

  for (let j = 0; j <= 5; j++) {
    doWrappingRound(A, R, kek, n, j);
  }

  return join([ A, ...R ]);
};

const aesUnwrapKey = (wrappedKey: Buffer, kek: Buffer): Buffer | null => {
  checkUnwrapInputLengths(wrappedKey, kek);

  // eslint-disable-next-line prefer-const
  let [ A, ...R ] = split(wrappedKey);
  const n = R.length;

  for (let j = 5; j >= 0; j--) {
    doUnwrappingRound(A, R, kek, n, j);
  }

  if (!A.equals(iv)) {
    return null;
  }

  return join(R);
};

/* eslint-enable id-length */

export { aesWrapKey, aesUnwrapKey };
