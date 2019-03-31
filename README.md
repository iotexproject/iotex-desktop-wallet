This is a branch for v1.0. If you want an v0.1.2 that works with iotex-core@0.4.2 please visit [here](https://github.com/iotexproject/iotex-explorer/tree/0.1.2).

[![CircleCI](https://circleci.com/gh/iotexproject/iotex-explorer.svg?style=svg)](https://circleci.com/gh/iotexproject/iotex-explorer)

# iotex-explorer

iotex-explorer is a frontend website for [iotex-core blockchain](https://github.com/iotexproject/iotex-core).

Check our site hosted at [https://iotexscan.io](https://iotexscan.io).

Or deploy your own instance on Heroku.

<a href="https://heroku.com/deploy?template=https://github.com/iotexproject/iotex-explorer">
  <img src="https://www.herokucdn.com/deploy/button.svg" alt="Deploy">
</a>

### Development

```bash
git clone git@github.com:iotexproject/iotex-explorer.git
```

### Run your project

This is intended for \*nix users. If you use Windows, go to [Run on Windows](#run-on-windows). Let's first prepare the environment.

```bash
nvm use 10.15.0
npm install

# prepare environment variable
cp ./.env.tmpl ./.env
```

Please specify your iotex-core endpoint with the envroment variable in the `.env` file:

```
IOTEX_CORE=iotexapi.example.com:80
API_GATEWAY_URL=http://mysite.example.com/api-gateway/
```

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

## Architecture

![Onefx Architecture](https://res.cloudinary.com/dohtidfqh/image/upload/v1546379050/web-guiguio/onefx-architecture.png)

```txt
.
├── README.md
├── ava.config.js           // ava test util configuration
├── babel.config.js         // babel compiler/transpiler configuration
├── config                  // project configuration
│   ├── default.js          // base config to be extended in all env
│   ├── development.js      // config in NODE_ENV=development
│   ├── production.js       // config in NODE_ENV=production
│   └── test.js             // config in NODE_ENV=test
├── coverage                // test coverage
├── dist                    // destination for src build result
├── gulpfile.babel.js       // gulp task runner config
├── package.json
├── renovate.json           // renovate bot to automate dependency bumps
├── server.ts               // project entry
├── src                               // source code
│   ├── client                        // browser-side source code
│   │   ├── javascripts
│   │   │   └── main.js
│   │   ├── static
│   │   │   ├── favicon.png
│   │   │   ├── manifest.json
│   │   │   └── robots.txt
│   │   └── stylesheets
│   │       └── main.scss
│   ├── model                         // data models
│   │   ├── index.ts
│   │   └── model.js
│   ├── server                        // onefx server
│   │   ├── babel-register.js
│   │   ├── index.ts
│   │   ├── middleware                // koa middleware
│   │   │   ├── index.ts
│   │   │   ├── manifest-middleware.js
│   │   │   └── set-middleware.js
│   │   ├── server-routes.js          // server-side routes
│   │   └── start-server.ts           // server initialization
│   └── shared                        // js code shared by both the server and the client
│       ├── app-container.js
│       ├── app.js
│       ├── common
│       ├── home
│       │   └── home.js
│       └── register-service-worker.js
├── translations          // translations supported in this website
│   ├── en.yaml
│   └── zh-cn.yaml
├── Procfile                // heroku Procfile
└── webpack.js            // webpack bundler config
```

## Run on Windows

1.  install [Windows Subsystem for Linux](https://docs.microsoft.com/en-us/windows/wsl/install-win10). Choose Ubuntu, for example.
2.  On WSL Ubuntu, install node version manager and install the latest lts dubnium

```bash
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

nvm ls
nvm install lts/Dubnium
nvm use lts/dubnium
```

3.  clone repo to `C:/`

```bash
cd /mnt/c/
https://github.com/iotexproject/iotex-explorer.git
```

4.  install [VS Code](https://code.visualstudio.com/) and open WSL terminal with ctrl + \` . Not sure about WSL terminal? Go to [this post](https://blogs.msdn.microsoft.com/commandline/2017/10/27/running-node-js-on-wsl-from-visual-studio-code/).

## Contribute to Localization?

Join here to contribute: https://lokalise.co/public/903185115c91ceff0cb2a0.70666943/
