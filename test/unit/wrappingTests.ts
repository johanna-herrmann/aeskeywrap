import { assert } from 'assertthat';
import { Buffer } from 'buffer/';
import forge from 'node-forge';
import { invalidUnwrapInputException, invalidWrapInputException, unauthenticInputException, unwrapKey, wrapKey } from '../../lib/wrapping';

suite('wrapping', (): void => {
  interface TestVector {
    length: 16 | 24 | 32;
    key: Uint8Array;
    kek: Uint8Array;
    wrappedKey: Uint8Array;
  }

  // Official test vecors
  const testVectors: TestVector[] = [
    // https://datatracker.ietf.org/doc/html/rfc3394#section-4.1
    {
      length: 16,
      key: new Uint8Array(Buffer.from('00112233445566778899AABBCCDDEEFF', 'hex')),
      kek: new Uint8Array(Buffer.from('000102030405060708090A0B0C0D0E0F', 'hex')),
      wrappedKey: new Uint8Array(Buffer.from('1FA68B0A8112B447AEF34BD8FB5A7B829D3E862371D2CFE5', 'hex'))
    },

    // https://datatracker.ietf.org/doc/html/rfc3394#section-4.4
    {
      length: 24,
      key: new Uint8Array(Buffer.from('00112233445566778899AABBCCDDEEFF0001020304050607', 'hex')),
      kek: new Uint8Array(Buffer.from('000102030405060708090A0B0C0D0E0F1011121314151617', 'hex')),
      wrappedKey: new Uint8Array(Buffer.from('031D33264E15D33268F24EC260743EDCE1C6C7DDEE725A936BA814915C6762D2', 'hex'))
    },

    // https://datatracker.ietf.org/doc/html/rfc3394#section-4.6
    {
      length: 32,
      key: new Uint8Array(Buffer.from('00112233445566778899AABBCCDDEEFF000102030405060708090A0B0C0D0E0F', 'hex')),
      kek: new Uint8Array(Buffer.from('000102030405060708090A0B0C0D0E0F101112131415161718191A1B1C1D1E1F', 'hex')),
      wrappedKey: new Uint8Array(Buffer.from('28C9F404C4B810F4CBCCB35CFB87F8263F5786E2D80ED326CBC7F0E71A99F43BFB988B9B7A02DD21', 'hex'))
    }
  ];

  suite('using test vectors', (): void => {
    for (const { length, key, kek, wrappedKey } of testVectors) {
      suite(`${length * 8} bit`, (): void => {
        test('wrap returns correct wrapped key.', async (): Promise<void> => {
          const actualWrappedKey = wrapKey(key, kek);

          assert.that(actualWrappedKey).is.equalTo(wrappedKey);
        });

        test('unwrap returns correct unwrapped key.', async (): Promise<void> => {
          const actualUnwrappedKey = unwrapKey(wrappedKey, kek);

          assert.that(actualUnwrappedKey).is.equalTo(key);
        });
      });
    }
  });

  suite('randomly forth and back', (): void => {
    for (const { length } of testVectors) {
      test(`${length * 8} bit`, async (): Promise<void> => {
        // eslint-disable-next-line no-sync
        const key = new Uint8Array(Buffer.from(forge.random.getBytesSync(length), 'binary'));
        // eslint-disable-next-line no-sync
        const kek = new Uint8Array(Buffer.from(forge.random.getBytesSync(length), 'binary'));

        const wrappedKey = wrapKey(key, kek);
        const keyBack = unwrapKey(wrappedKey, kek);

        assert.that(keyBack).is.equalTo(key);
      });
    }
  });

  suite('error cases', (): void => {
    test('throws unauthenticInputException when wrappedKey was tampered with.', async (): Promise<void> => {
      // eslint-disable-next-line no-sync
      const key = new Uint8Array(Buffer.from(forge.random.getBytesSync(32), 'binary'));

      // eslint-disable-next-line no-sync
      const kek = new Uint8Array(Buffer.from(forge.random.getBytesSync(32), 'binary'));
      const wrappedKey = wrapKey(key, kek);

      // Change first byte
      // eslint-disable-next-line no-bitwise
      wrappedKey.set([ (wrappedKey.at(0) ?? 0) ^ 1 ]);

      assert.that((): void => {
        unwrapKey(wrappedKey, kek);
      }).is.throwing(unauthenticInputException.message);
    });

    test('throws unauthenticInputException on invalid kek.', async (): Promise<void> => {
      // eslint-disable-next-line no-sync
      const key = new Uint8Array(Buffer.from(forge.random.getBytesSync(32), 'binary'));

      // eslint-disable-next-line no-sync
      const kek = new Uint8Array(Buffer.from(forge.random.getBytesSync(32), 'binary'));
      const wrappedKey = wrapKey(key, kek);

      // Change first byte
      // eslint-disable-next-line no-bitwise
      kek.set([ (kek.at(0) ?? 0) ^ 1 ]);

      assert.that((): void => {
        unwrapKey(wrappedKey, kek);
      }).is.throwing(unauthenticInputException.message);
    });

    test('throws exception on invalid kek length (wrap).', async (): Promise<void> => {
      // eslint-disable-next-line no-sync
      const key = new Uint8Array(Buffer.from(forge.random.getBytesSync(32), 'binary'));

      // eslint-disable-next-line no-sync
      const kek = new Uint8Array(Buffer.from(forge.random.getBytesSync(20), 'binary'));

      assert.that((): void => {
        wrapKey(key, kek);
      }).is.throwing(invalidWrapInputException.message);
    });

    test('throws exception on invalid kek length (unwrap).', async (): Promise<void> => {
      // eslint-disable-next-line no-sync
      const wrappedKey = new Uint8Array(Buffer.from(forge.random.getBytesSync(40), 'binary'));

      // eslint-disable-next-line no-sync
      const kek = new Uint8Array(Buffer.from(forge.random.getBytesSync(20), 'binary'));

      assert.that((): void => {
        unwrapKey(wrappedKey, kek);
      }).is.throwing(invalidUnwrapInputException.message);
    });

    test('throws exception on invalid key length for kek.', async (): Promise<void> => {
      // eslint-disable-next-line no-sync
      const key = new Uint8Array(Buffer.from(forge.random.getBytesSync(24), 'binary'));

      // eslint-disable-next-line no-sync
      const kek = new Uint8Array(Buffer.from(forge.random.getBytesSync(32), 'binary'));

      assert.that((): void => {
        wrapKey(key, kek);
      }).is.throwing(invalidWrapInputException.message);
    });

    test('throws exception on invalid wrappedKey length for kek.', async (): Promise<void> => {
      // eslint-disable-next-line no-sync
      const wrappedKey = new Uint8Array(Buffer.from(forge.random.getBytesSync(32), 'binary'));

      // eslint-disable-next-line no-sync
      const kek = new Uint8Array(Buffer.from(forge.random.getBytesSync(32), 'binary'));

      assert.that((): void => {
        unwrapKey(wrappedKey, kek);
      }).is.throwing(invalidUnwrapInputException.message);
    });
  });
});
