<h1 align="center" style="border-bottom: none;">📈 Rotating Provider</h1>
<p align="center">
  <a href="https://www.npmjs.com/package/rotating-provider">
    <img alt="npm latest version" src="https://img.shields.io/npm/v/rotating-provider/latest.svg">
  </a>
  <a href="https://github.com/Decubate-com/rotating-provider/issues">
    <img alt="GitHub issues" src="https://img.shields.io/github/issues/Decubate-com/rotating-provider">
  </a>
  <a href="https://github.com/Decubate-com/rotating-provider/blob/main/LICENSE">
    <img alt="License" src="https://img.shields.io/github/license/Decubate-com/rotating-provider">
  </a>
  <a href="https://github.com/Decubate-com/rotating-provider/actions/workflows/build.yml">
    <img alt="Build" src="https://github.com/Decubate-com/rotating-provider/actions/workflows/build.yml/badge.svg">
  </a>
</p>

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Introduction

Rotating Provider is a utility library that helps manage and switch between multiple providers in a decentralized application (dApp) that interacts with multiple blockchain networks. It facilitates the rotation of providers to ensure continuous service availability while handling issues with individual providers.

## Features

- Efficiently switch between multiple blockchain providers.
- Automatic validation and rotation of providers to avoid downtime.
- Simple and flexible integration with existing dApp projects.
- Customizable interval and provider lists to suit different use cases.

## Installation

Install the package using npm:

```bash
npm install rotating-provider
```

or pnpm:

```bash
pnpm add rotating-provider
```

## Usage

To use the Rotating Provider library, follow these steps:

1. Import the library in your JavaScript/TypeScript file:

```javascript
const { RotatingProvider } = require("rotating-provider"); // For JavaScript
// or
import { RotatingProvider } from "rotating-provider"; // For TypeScript
```

2. Create a new instance of RotatingProvider by providing chain id and interval between rotation:

```javascript
const providerInterval = 5000; // Set the interval (in milliseconds) for provider rotation.
const chainId = 1; // Chain id of blockchain
const rotatingProvider = new RotatingProvider(chainId, providerInterval);
```

3. Access the provider functions

```javascript
const blocknumber = await rotatingProvider.provider.getBlockNumber();
```

## Author

- Aceson Sunny ([0xask3](https://github.com/0xask3))

## Contributing

Contributions to the Rotating Provider library are welcome! If you find a bug, have an idea for an improvement, or want to contribute new features, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them with descriptive commit messages.
4. Push your branch to your forked repository.
5. Submit a pull request to the main repository, explaining your changes.

## License

The Rotating Provider library is licensed under the MIT License.
