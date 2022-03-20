# fgo-servant-planner-server
### Requirements
Node.js 14.10.0 or higher (needed for [Crypto.randomInt](https://nodejs.org/api/crypto.html#cryptorandomintmin-max-callback))
### Dev Instructions
- The submodules must be initiliazed and updated after cloning the repository. This must be done before running `npm install`. This can be done by running the following commands:
    ```
    git submodule init
    git submodule update
    ```
- A `.env` file must be created before the server can run. An example file `.env.example` is provided as a template.
- To run local development server, use command `npm run watch`. Transpiled .js files will be located in the `dist` folder. The `tsconfig.ts` file must be copied into the `dist` folder. Currently, this must be done manually.
- To run unit tests, use command `npm run test`.
