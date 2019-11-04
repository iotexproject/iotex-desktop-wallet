[![CircleCI](https://circleci.com/gh/iotexproject/iotex-explorer.svg?style=svg)](https://circleci.com/gh/iotexproject/iotex-explorer)

# iotex-explorer

iotex-explorer is a frontend website for [iotex-core blockchain](https://github.com/iotexproject/iotex-core).

Check our site hosted at [https://iotexscan.io](https://iotexscan.io).

Or deploy your own instance on Heroku.

<a href="https://heroku.com/deploy?template=https://github.com/iotexproject/iotex-explorer">
  <img src="https://www.herokucdn.com/deploy/button.svg" alt="Deploy">
</a>

## Getting Started

```bash
git clone git@github.com:iotexproject/iotex-explorer.git
```

### Run your project

This is intended for \*nix users. If you use Windows, go to [Run on Windows](#run-on-windows). Let's first prepare the environment.

```bash
cd guanxilab

nvm use 10.15.0
npm install

# prepare environment variable
cp ./.env.tmpl ./.env
```

Note: please provide your iotex-core URL like `IOTEX_CORE=http://api.mainnet.iotex.one:80` in `./.env` file.

#### Development mode

To run your project in development mode, run:

```bash
npm run watch
```

The development site will be available at [http://localhost:4004](http://localhost:4004).

#### Production Mode

It's sometimes useful to run a project in production mode, for example, to check bundle size or to debug a production-only issue. To run your project in production mode locally, run:

```bash
npm run build-production
NODE_ENV=production npm run start
```

#### NPM scripts

- `npm run test`: test the whole project and generate a test coverage
- `npm run ava ./path/to/test-file.js`: run a specific test file
- `npm run build`: build source code from `src` to `dist`
- `npm run lint`: run the linter
- `npm run kill`: kill the node server occupying the port 4004.

## Contribute to Localization?

Join here to contribute: https://lokalise.co/public/903185115c91ceff0cb2a0.70666943/
