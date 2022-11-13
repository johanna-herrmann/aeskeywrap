import { assert } from 'assertthat';
import { unwrapKeyFromString, wrapKeyToString } from '../../lib/wrappingAndConverting';

suite('wrapping and converting at once', (): void => {
  const key = new Uint8Array(Buffer.from('00112233445566778899AABBCCDDEEFF0001020304050607', 'hex'));
  const kek = new Uint8Array(Buffer.from('000102030405060708090A0B0C0D0E0F1011121314151617', 'hex'));
  const wrappedKeyBase64 = Buffer.from('031D33264E15D33268F24EC260743EDCE1C6C7DDEE725A936BA814915C6762D2', 'hex').toString('base64');
  const wrappedKeyHex = '031D33264E15D33268F24EC260743EDCE1C6C7DDEE725A936BA814915C6762D2';

  test('returns base64 encoded wrappedKey.', async (): Promise<void> => {
    const encodedWrappedKey = wrapKeyToString(key, kek, 'base64');

    assert.that(encodedWrappedKey).is.equalTo(wrappedKeyBase64);
  });

  test('returns key, unwrapped and decoded from hex string.', async (): Promise<void> => {
    const keyBack = unwrapKeyFromString(wrappedKeyHex, kek, 'hex');

    assert.that(keyBack).is.equalTo(key);
  });
});
