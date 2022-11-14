# aeskeywrap

[![npm package](https://nodei.co/npm/aeskeywrap.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/aeskeywrap/)

[![npm](https://img.shields.io/npm/v/aeskeywrap)](https://www.npmjs.com/package/aeskeywrap) [![QA](https://github.com/mark-herrmann/aeskeywrap/actions/workflows/qa.yml/badge.svg?branch=main)](https://github.com/mark-herrmann/aeskeywrap/actions/workflows/qa.yml)

This package provides the [RFC 3394 key wrapping](http://csrc.nist.gov/encryption/kms/key-wrap.pdf) (also known as aes-key-wrap). \
It's written in TypeScrypt.

## Introduction

This package implements the aes-key-wrap (key wrapping and unwrapping), following [this heise article](https://www.heise.de/netze/rfc/rfcs/rfc3394.shtml),
based on the [specification by nist](http://csrc.nist.gov/encryption/kms/key-wrap.pdf).

It works in:
* nodejs
* browsers (using, build and package tools like webpack or browserify)

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

## Install
```bash
npm i aeskeywrap
```

## Usage

### Wrap key with kek

```js
import { wrapKey } from 'aeskeywrap';

// key, kek and wrappedKey are Unit8Arrays
const wrappedKey = wrapKey(key, kek);
```

### Unwrap key with kek

```js
import { unwrapKey } from 'aeskeywrap';

// key, kek and wrappedKey are Unit8Arrays
const key = unwrapKey(wrappedKey, kek);
```

### Conversions

#### Uint8Array to string

```js
import { toString } from 'aeskeywrap';

// convert Uint8Array to base64 string
const wrappedKeyBase64 = toString(wrappedKey, 'base64')

// convert Uint8Array to hex string
const wrappedKeyHex = toString(wrappedKey, 'hex')
```

#### string to Uint8Array

```js
import { fromString } from 'aeskeywrap';

// convert Uint8Array to base64 string
const wrappedKey = fromString(wrappedKeyBase64, 'base64')

// convert Uint8Array to hex string
const wrappedKey_ = fromString(wrappedKeyhex, 'hex')
```

#### wrap and convert to base64 string at once

```js
import { wrapKeyToString } from 'aeskeywrap';

const wrappedKey = wrapToString(key, kek, 'base64');
```

#### convert from base64 string and unwrap at once

```js
import { unwrapKeyFromString } from 'aeskeywrap';

const key = unwrapFromString(wrappedKeyBase64, kek, 'base64');
```

#### encodings

You can use all encodings, available at buffer.toString() function. \
Currently this includes:
* 'ascii'
* 'utf8'
* 'utf-8'
* 'utf16le'
* 'ucs2'
* 'ucs-2'
* 'base64'
* 'base64url'
* 'latin1'
* 'binary'
* 'hex'

## Used crypto libraries

* [node-forge](https://www.npmjs.com/package/node-forge) by [digitalbazaar](https://github.com/digitalbazaar), \
  used for AES encryption and decryption (AES-256)

## Tests

Unit Tests based on official test vectors
* [for 128-bit key](https://datatracker.ietf.org/doc/html/rfc3394#section-4.1)
* [for 192-bit key](https://datatracker.ietf.org/doc/html/rfc3394#section-4.4)
* [for 256-bit key](https://datatracker.ietf.org/doc/html/rfc3394#section-4.6)

## License

This project is licensed under the [MIT License](LICENSE.txt)
