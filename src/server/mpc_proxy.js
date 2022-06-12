"use strict";
const httpProxy = require("http-proxy");
const { verifyTxJwt, verifyJwt, verifyMpcJwt } = require("../utils/jwt");
const { logger } = require("../utils/logger");

// new httpProxy.createProxyServer({
//   target: protocolPrefix + host + ':' + port,
//   secure: false,
//   changeOrigin: true,
//   xfwd: true,
//   autoRewrite: true
//  }).on('error', function (err) {
//   console.log(err);
//   console.log('Listening... [press Control-C to exit]');
//  })

var mpcProxies = {
  mpc_server_1: new httpProxy.createProxyServer({
    target: `ws://localhost:8080/gen`,
  }).on("error", (err) => {
    logger.error(err.toString());
  }),
  // mpc_server_2: new httpProxy.createProxyServer({
  //   target: `ws://${process.env.MPC_DUMMY_SERVER}/`
  //   //target: {
  //   //  host: "localhost",
  //   //  port: 8081
  //   //}
  // })
  // extend this...
};

const proxyResMon = (proxyRes, req, res) => {
  logger.debug(
    "RAW Response from the target",
    JSON.stringify(proxyRes.headers, true, 2)
  );
};

const selectMpcServer = (req) => {
  // TODO mpc server queue management / loadbalancer
  return "mpc_server_1";
};

/*
//ToDo: remove this
const verifyToken = (token, req, socket) => {
  if (!token) {
    console.log((new Date()).toLocaleString() + ' ' + "No jwt authorization token found...")
    socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n')
    socket.destroy()
    return false
  }

  try {
    req.headers['jwt'] = JSON.stringify(jwt.verify(token, jwt_server_key))
    return true
  } 
  catch(err) {
    console.log((new Date()).toLocaleString() + ' ' + err)
    socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n')
    socket.destroy()
    return false
  }
}
*/

const socketAuth = async (req, socket, head) => {
  try {
    console.log("socketAuth url", req.url);
    const mpcServer = mpcProxies[selectMpcServer(req)];
    mpcServer.ws(req, socket, head);
    mpcServer.on("proxyRes", proxyResMon);
    mpcServer.on("open", (proxySocket) => {
      console.log("open");
    });
    mpcServer.on("close", (res, socket, head) => {
      console.log("close");
    });

    // if (!req.url.includes("/gen")) {
    //   var verified = await verifyMpcJwt(req, socket);
    // if (verified) {

    // } else {
    //   logger.warn("MPC JWT authorization failed");
    // }
    // } else {
    // }
  } catch (error) {
    logger.error(error.toString());
  }
};

module.exports = { socketAuth, mpcProxies };
