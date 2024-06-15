# aeskeywrap

[![npm package](https://nodei.co/npm/aeskeywrap.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/aeskeywrap/)

[![npm](https://img.shields.io/npm/v/aeskeywrap)](https://www.npmjs.com/package/aeskeywrap) [![QA](https://github.com/johanna-herrmann/aeskeywrap/actions/workflows/qa.yml/badge.svg?branch=main)](https://github.com/johanna-herrmann/aeskeywrap/actions/workflows/qa.yml)

This package provides the [RFC 3394 key wrapping](https://www.rfc-editor.org/rfc/rfc3394) (also known as aes-key-wrap). \
It's written in TypeScrypt.

## Introduction

This package implements the aes-key-wrap (key wrapping and unwrapping), following [this heise article](https://www.heise.de/netze/rfc/rfcs/rfc3394.shtml),
based on the specification by nist.

## Supported key/kek lengths

Following key/kek lengths are supported:

* 128-bit key with 128-bit kek
* 192-bit key with 192-bit kek
* 256-bit key with 256-bit kek

Mixed lengths (128-bit key with 256-bit kek, for example) are not supported, currently, but they don't make any sense either, since a chain with a weaker link does not become stronger by adding a stronger link.

## Use case

With aes-key-wrap you can wrap (encrypt) a key, used to encrypt data, using a so-called kek (usally a key, derived from a password).

## Features

* Wrap a key with a KEK*, using aes-key-wrap
* Unwrap a key with a KEK*, using aes-key-wrap
* Uint8Array <=> string conversion

*KEK = Key encryption key (key, used to encrypt another key)

## Install (node.js)
```bash
npm i aeskeywrap
```

## Import / Loading

### Node.js

```js
// Replace ... with a comma-separated list of the functions, you need
import { ... } from 'aeskeywrap';
```

### Browser

```html
<!-- Load the file from jsDelivr -->
<script src="https://cdn.jsdelivr.net/npm/aeskeywrap@1.2.2/dist/aeskeywrap.js"></script>

<!-- or load the file from unpkg -->
<script src="https://unpkg.com/aeskeywrap@1.2.2/dist/aeskeywrap.js"></script>

<!-- or download the file and host it yourself -->
<script src="/js/aeskeywrap.js"></script>

<script>
  // Replace ... with a comma-separated list of the functions, you need
  const { ... } = aeskeywrap;
</script>
```

### Available functions
* keyWrap: wraps a key with a kek
* unwrapKey: unwraps a wrapped key with a kek
* toString: encodes an Uint8Array to a string
* fromString: decodes a string to an Uint8Array
* wrapKeyToString: wraps a key with a kek and encodes it
* unwrapKeyFromString: decodes a wrappedKey and unwraps it

## Usage

### Wrap key with kek

```js
// key, kek and wrappedKey are Unit8Arrays
const wrappedKey = wrapKey(key, kek);
```

### Unwrap key with kek

```js
// key, kek and wrappedKey are Unit8Arrays
const key = unwrapKey(wrappedKey, kek);
```

### Conversions

#### Uint8Array to string

```js
// convert Uint8Array to base64 string
const wrappedKeyBase64 = toString(wrappedKey, 'base64')

// convert Uint8Array to hex string
const wrappedKeyHex = toString(wrappedKey, 'hex')
```

#### string to Uint8Array

```js
// convert Uint8Array to base64 string
const wrappedKey = fromString(wrappedKeyBase64, 'base64')

// convert Uint8Array to hex string
const wrappedKey_ = fromString(wrappedKeyhex, 'hex')
```

#### wrap and convert to base64 string at once

```js
const wrappedKey = wrapKeyToString(key, kek, 'base64');
```

#### convert from base64 string and unwrap at once

```js
const key = unwrapKeyFromString(wrappedKeyBase64, kek, 'base64');
```

#### encodings

You can use all encodings, available at buffer.toString() function. \
Currently this includes:
* ascii
* utf8
* utf-8
* utf16le
* ucs2
* ucs-2
* base64
* base64url
* latin1
* binary
* hex

## Error handling

There are 3 possible errors. \
Each error only contains a message, specifying the error type.

These are the 3 different messages (they are very self-explanatory):

* `Unauthentic data. Wrong kek?`
* `Invalid data length(s). kek must be 16, 24 or 32 bytes, key must be same length.`
* `Invalid data length(s). kek must be 16, 24 or 32 bytes, wrappedKey must be 8 bytes longer`

There are 2 different reasons for unauthentic data:
* The wrapped key has been tampered with
* The kek is wrong (e.g. due to an wrong password), which is the most common case

The message `Unauthentic data. Wrong kek?` will never change (design decision). Therefore, it can be reliably used to determine whether the process failed due to unauthentic data.

## Used crypto libraries

* [crypto-js](https://www.npmjs.com/package/crypto-js) by [evanvosberg](https://www.npmjs.com/~evanvosberg), \
  used for AES single block encryption and decryption

## Tests

Unit Tests based on official test vectors
* [for 128-bit key](https://datatracker.ietf.org/doc/html/rfc3394#section-4.1)
* [for 192-bit key](https://datatracker.ietf.org/doc/html/rfc3394#section-4.4)
* [for 256-bit key](https://datatracker.ietf.org/doc/html/rfc3394#section-4.6)

## Changelog

[Changelog](https://github.com/johanna-herrmann/aeskeywrap/blob/main/CHANGELOG.md)

## License

This project is licensed under the [MIT License](LICENSE.txt)
