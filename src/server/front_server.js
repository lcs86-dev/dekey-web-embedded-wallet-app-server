'use strict'
const http = require('http');
const https = require('https');
const fs = require('fs');
const app = require('./router');
const { socketAuth } = require('./mpc_proxy');
const { logger } = require('../utils/logger')
require('dotenv').config();

//process.env.FRONT_HOST
//process.env.FRONT_PORT
//process.env.FRONT_SSL

let frontServer;
if (process.env.FRONT_SSL == 'on') {
  const front_options = {
    key: fs.readFileSync('../certs/host.key'),
    cert: fs.readFileSync('../certs/host.pem')
  }
  frontServer = https.createServer(front_options, app)
} else {
  frontServer = http.createServer(app)
}

try {
  //for socket connection
  frontServer.on('upgrade', socketAuth)
} catch (error) {
  logger.error(error.toString())
}

module.exports = frontServer