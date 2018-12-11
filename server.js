#!/usr/bin/env node
require('./src/server/babel-register');
const startServer = require('./src/server').startServer;
startServer();
