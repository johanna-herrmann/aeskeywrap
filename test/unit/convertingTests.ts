import { assert } from 'assertthat';
import { Encoding, fromString, toString } from '../../lib/converting';

suite('converting', (): void => {
  const uint8Array = new Uint8Array(Buffer.from('abc+/123', 'base64'));

  interface Converting {
    encoding: Encoding;
    string: string;
  }

  const convertings: Converting[] = [
    {
      encoding: 'base64',
      string: 'abc+/123'
    },
    {
      encoding: 'base64url',
      string: 'abc-_123'
    },
    {
      encoding: 'hex',
      string: Buffer.from('abc+/123', 'base64').toString('hex')
    },
    {
      encoding: 'binary',
      string: Buffer.from('abc+/123', 'base64').toString('binary')
    }
  ];

  suite('to String', (): void => {
    for (const { encoding, string } of convertings) {
      test(`returns ${string} on ${encoding} encoding.`, async (): Promise<void> => {
        const actualString = toString(uint8Array, encoding);

        assert.that(actualString).is.equalTo(string);
      });
    }
  });

  suite('from String', (): void => {
    for (const { encoding, string } of convertings) {
      test(`returns original uint8Array on ${encoding} encoding.`, async (): Promise<void> => {
        const actualUint8Array = fromString(string, encoding);

        assert.that(actualUint8Array).is.equalTo(uint8Array);
      });
    }
  });
});
