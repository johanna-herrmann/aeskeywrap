# aeskeywrap

Provides the [RFC 3394 key wrapping](http://csrc.nist.gov/encryption/kms/key-wrap.pdf) (also known as aes-key-wrap), written in TypeScrypt.

## Introduction

This package implements the aes-key-wrap (key wrapping and unwrapping), following [this heise article](https://www.heise.de/netze/rfc/rfcs/rfc3394.shtml),
based on the [specification by nist](http://csrc.nist.gov/encryption/kms/key-wrap.pdf).

It works in:
* nodejs
* browsers (using, build and package tools like webpack)

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
import { wrap } from 'aeskeywrap';

// key, kek and wrappedKey are Unit8Arrays
const wrappedKey = wrap(key, kek);
```

### Unwrap key with kek

```js
import { unwrap } from 'aeskeywrap';

// key, kek and wrappedKey are Unit8Arrays
const key = unwrap(wrappedKey, kek);
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

## License

This project is licensed under the [MIT License](LICENSE.txt)
