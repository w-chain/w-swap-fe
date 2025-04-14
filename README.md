# Quick Start
## Prerequisites
- Node version: 18.x

## Build
Go the root repo and run:
```bash
yarn
yarn build:sdk
yarn build:interface
```

You will have a build folder with the interface and the sdk.
It can be served statically by any static file server from that directory.

To run the interface locally for the development, go to the `uniswap-2-interface` folder and run:
```bash
yarn start
```


## Tweaking the interface
Anything related to the whitelabel is marked with a comment:
```
/** NOTE: Wadz-specific */
```

Use a search tool to find all the places that are marked with this comment.

## Adding tokens
You need to duplicate the token list in 2 places in the code:

Go to the file `/uniswap/uniswap-2-interface/src/constants/lists.ts`
- Update DEFAULT_TOKEN_LIST variable with the new tokens

Go to the file `/uniswap/uniswap-2-interface/public/token-list/token-list.json`
- Update the json file with the new tokens
