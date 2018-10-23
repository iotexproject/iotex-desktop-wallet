#!/usr/bin/env node
require('babel-register');
require('babel-polyfill');
const startServer = require('./src/server').startServer;
startServer();
