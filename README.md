# web-onefx-boilerplate

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/bdc4bc3ce5c84e5fb18c69d10491d80f)](https://app.codacy.com/app/puncsky/web-onefx-boilerplate?utm_source=github.com&utm_medium=referral&utm_content=puncsky/web-onefx-boilerplate&utm_campaign=Badge_Grade_Dashboard)


## Getting Started

OneFx is a full-stack framework for building web apps. Here are the features you'll find in Onefx.js:

* server side rendering and universal rendering with react and redux
* ES2017, JSX, flowtype support out of the box
* server-side development via Koa.js

### Create a project

```bash
git clone git@github.com:puncsky/web-onefx-boilerplate.git my-awesome-project
```

### Run your project

This is intended for *nix users. If you use Windows, go to [Run on Windows](#run-on-windows). Let's first prepare the environment.

```bash
cd my-awesome-project

nvm use 10.15.0
npm install

# prepare environment variable
cp ./.env.tmpl ./.env
```

#### Development mode

To run your project in development mode, run:

```bash
npm run watch
```

The development site will be available at http://localhost:4000.

#### Production Mode

It's sometimes useful to run a project in production mode, for example, to check bundle size or to debug a production-only issue. To run your project in production mode locally, run:

```
npm run build-production && NODE_ENV=production npm run start
```

#### NPM scripts


- `npm run test`: test the whole project and generate a test coverage
- `npm run ava ./path/to/test-file.js`: run a specific test file
- `npm run build`: build source code from `src` to `dist`
- `npm run lint`: run the linter
- `npm run flow`: run the flow type check
- `npm run kill`: kill the node server occupying the port 4100.

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
├── flow-typed              // flowtype's type definition
│   ├── global.js
│   └── npm
├── gulpfile.babel.js       // gulp task runner config
├── package.json
├── renovate.json           // renovate bot to automate dependency bumps
├── server.js               // project entry
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
│   │   ├── index.js
│   │   └── model.js
│   ├── server                        // onefx server
│   │   ├── babel-register.js
│   │   ├── index.js
│   │   ├── middleware                // koa middleware
│   │   │   ├── index.js
│   │   │   ├── manifest-middleware.js
│   │   │   └── set-middleware.js
│   │   ├── server-routes.js          // server-side routes
│   │   └── start-server.js           // server initialization
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


## Guides

### State management

We use redux to manage state in onefx.js. To pass the state from the server to the initial page during the server-side rendering, in the server use `ctx.setState(path, val)` to set the state:

```js
server.get('SPA', '/*', function onRoute(ctx) {
  ctx.setState('base.sampleState', 'this is a sample initial state');
  ctx.body = ctx.isoReactRender({
    VDom: (
      <AppContainer/>
    ),
    reducer: noopReducer,
    clientScript: '/main.js',
  });
});
```

And use the state in the react component:

```js
const SampleStateContainer = connect(
  state => ({text: state.base.sampleState})
)(function SampleState({text}) {
  return (
    <div>{text}</div>
  );
});
```

### Styling

We support both global styles with [sass](https://sass-lang.com/guide) in `./src/client/stylesheets/main.scss` and modular styles with [styletron-react](https://github.com/styletron/styletron/blob/master/packages/styletron-react/README.md):

```js
import react from 'react';
import {styled} from 'onefx/lib/styletron-react';

const Panel = styled('div', {
  backgroundColor: 'silver',
});

export default <Panel>Hello</Panel>;
```

### Routing

server-side routing is using [koa-router](https://github.com/alexmingoia/koa-router) and located in `./src/server/server-routes.js`. The basic usage is:


```js
server
  .get('/', (ctx, next) => {
    ctx.body = 'Hello World!';
  })
  .post('/users', (ctx, next) => {
    // ...
  })
  .put('/users/:id', (ctx, next) => {
    // ...
  })
  .del('/users/:id', (ctx, next) => {
    // ...
  })
  .all('/users/:id', (ctx, next) => {
    // ...
  });
```

client-side routing is using [react-router v4](https://reacttraining.com/react-router/web/guides/quick-start) and located in `./src/shared/app.js`.


``` js
<Switch>
  <Route exact path='/' component={Home}/>
  <Route component={NotFound}/>
</Switch>
```

### Internationalization

Onefx reads translations from `./translations` directory. Please create a file there named with a corresponding locale, for example, `en.yaml`. And then add an entry

``` yaml
homepage.hello: hello, ${userName}!
```

and then in the react view file

``` js
import {t} from 'onefx/lib/iso-i18n';

function Greetings() {
  return (
    <div>{t('homepage.hello', {userName: 'John'})}</div>
  );
}
```

When users visit this site with `accept-language: en` in the header, which is set by the browser, then they will see translated greetings. If you want to explicitly set the locale, then visit the page with a query string `?locale=en` then it will memorize this in the cookie.


### Testing

test files are supposed to be placed in any module like `./__test__/example.test.js` in [ava test utils](https://github.com/avajs/ava/tree/master/docs).

```js
import test from 'ava';

test('testname', async t => {
  // ...
});

```

### Security

Onefx enables secure web app development with

1. CSRF protection that can be exempted at `./config/default.js` (`config.server.noCsrfRoutes`)
2. Helmet headers that can be exempted at `config.server.noSecurityHeadersRoutes`
3. Content Security Policy configured at `config.csp`

for example, in `default.js`,

```js
  server: {
    noSecurityHeadersRoutes: {
      '/embed/checkout/': true,
    },
    noCsrfRoutes: {
      '/api-gateway/': true,
    },
  },
  csp: {
    'default-src': [
      'none',
    ],
  }
```


### Static assets

Static assets are placed in `./client/static/` and loaded into the root directory of the website. Take `./client/static/favicon.png` for example, you can get it at http://localhost:4100/favicon.png, or use it in the react component:

```js
import {assetURL} from 'onefx/lib/asset-url';

function ImgExample() {
  return (
    <img src={assetURL('/favicon.png')}/>
  );
}
```

### Configuration

#### Environment variables

The environment variable is read from commandline as well as `.env` file. Take `PORT` for example,

```
PORT=4004 npm run watch
```

or in `.env` file

```env
PORT=4004
```

In the js file, you can read the value by `process.env.PORT`.

#### Static configuration

The static configuration is located in `./config` and can be read according to the environment variable `NODE_ENV`.

## References

Tech Stack

* react - view https://reactjs.org/
    * styletron - local style in JS https://github.com/rtsao/styletron
    * sass - global style in sass
    * flexbox - view layout https://css-tricks.com/snippets/css/a-guide-to-flexbox/
* redux - state management https://redux.js.org/
* Koa.js - server http://koajs.com/
* graphql apollo - api gateway https://www.apollographql.com/
* MongoDB mongoose - database ODM https://mongoosejs.com/
* MySQL sequalize - database ORM http://docs.sequelizejs.com/

Design Resources

* Carbon Design System http://carbondesignsystem.com/
* Font Awesome http://fontawesome.io/
* flaticon - icons and graphics https://www.flaticon.com/

## Roadmap

Vision: Onefx = fusionjs + django + react native + SRE infra + data pipeline

1. MVP
	1. Getting started
		1. Create a project
		2. Run your project
		3. Framework Comparison
		4. Coding Styles
	2. Guides
		1. State management
		2. styling
			1. import styles
			2. modular styles (now we have global root provider dependency on styletron)
		3. Routing
		4. Fetching data
		5. Forms
		6. Internationalization
		7. testing
		8. typing
		9. security
		10. Universal rendering
		11. Server code
		12. Performance
			1. automatic code splitting
		13. debugging
		14. Static assets
		15. Configuration
		16. Working with Secrets
2. ver 1.0.0 Web
	1. yarn create
	2. Auth: Sign in / sign up / forgot-password
	3. Admin Site
	4. Boilerplates
3. Ver 2.0.0 Mobile
	1. React native, Apollo graphql
4. Ver 3.0.0 Infra
  1. Kubernetes
  2. metrics
  3. logging
5. Ver 4.0.0 Data Pipeline
  1. ELK
  2. BI platform

## Run on Windows

1. install Windows Subsystem for Linux https://docs.microsoft.com/en-us/windows/wsl/install-win10. Choose Ubuntu, for example.
2. On WSL Ubuntu, install node version manager and install the latest lts dubnium

```bash
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

nvm ls
nvm install lts/Dubnium
nvm use lts/dubnium
```

3. clone repo to `C:/`

```bash
cd /mnt/c/
https://github.com/puncsky/web-onefx-boilerplate.git
```

4. install VS Code https://code.visualstudio.com/ and open WSL terminal with ctrl + \` . Not sure about WSL terminal? Go to https://blogs.msdn.microsoft.com/commandline/2017/10/27/running-node-js-on-wsl-from-visual-studio-code/
