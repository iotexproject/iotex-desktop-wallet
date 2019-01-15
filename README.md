[![CircleCI](https://circleci.com/gh/iotexproject/iotex-explorer.svg?style=svg)](https://circleci.com/gh/iotexproject/iotex-explorer)

# iotex-explorer

Frontend website for [iotex-core blockchain](https://github.com/iotexproject/iotex-core).

Check our site hosted at [https://iotexscan.io](https://iotexscan.io).

Or deploy your own instance on Heroku.

<a href="https://heroku.com/deploy?template=https://github.com/iotexproject/iotex-explorer">
  <img src="https://www.herokucdn.com/deploy/button.svg" alt="Deploy">
</a>

## Development

Prepare environment variables.

```
cp ./.env.tmpl ./.env
```

And specify environment variables in `.env` file.

```
nvm install 10.14.2
npm install

# watch the change during development
npm run watch
# go visit http://localhost:4004/

# test
npm run test
```

We use [inferno-test-utils](https://www.npmjs.com/package/inferno-test-utils/v/3.10.1) for the view test.

## Configuration

configuration is located in `.env` file. `IOTEX_CORE_URL` is the iotex-core API endpoint and `IOTEX_WALLET_URL` is the wallet-core endpoint.

```.env
CHAINS=[{"id":1,"name":"mainchain","url":"http://iotexscan.io/","gatewayUrl":"https://iotexscan.io/"},{"id":2,"name":"subchain","url":"http://subchain.iotexscan.io/","gatewayUrl":"https://subchain.iotexscan.io/"}]
GOOGLE_TID=UA-111756489-2
IOTEX_CORE_URL=http://30.30.30.30:30100
IOTEX_WALLET_URL=35.247.78.183:30500
NODE_ENV=production
```

## Build and Run in Production

```
npm run bp
NODE_ENV=production npm run start
```

### Scripts

- `npm run test` to run all tests
- `npm run ava <path/to/file>` to run a specific test

### Run with Docker if you want

##### Please install Docker: `https://docs.docker.com/install/`

Building your image:
`docker build -t <your username>/explorer .`

Your image is now listed by Docker:
`docker images`

##### Run the image

`docker run -p <port>:4004 -d <your username>/explorer`
the `-p` flag redirects a public prot to a private port inside the container.
Just choose any port ex) 49160

Print the output of the app:
`docker ps`

print app output
`docker logs <container id>`

If you need to test your app, get the port of your app that Docker mapped:
`docker ps`
`curl -i localhost:<port ex) 49160>`
