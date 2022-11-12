import { assert } from 'assertthat';

// Just a dummy suite with dummy test and dummy assert
suite('dummy-test', (): void => {
  test('does nothing.', async (): Promise<void> => {
    assert.that(7).is.equalTo(7);
  });
});
