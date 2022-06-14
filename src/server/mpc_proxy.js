"use strict";
const httpProxy = require("http-proxy");
const { verifyTxJwt, verifyJwt, verifyMpcJwt } = require("../utils/jwt");
const { logger } = require("../utils/logger");

var mpcProxies = {
  mpc_server_1: new httpProxy.createProxyServer({
    target: `ws://${process.env.MPC_CS_ADDRESS}/gen`,
  }).on("error", (err) => {
    logger.error(err.toString());
  }),
};

const proxyResMon = (proxyRes, req, res) => {
  logger.debug(
    "RAW Response from the target",
    JSON.stringify(proxyRes.headers, true, 2)
  );
};

const selectMpcServer = (req) => {
  return "mpc_server_1";
};

const socketAuth = async (req, socket, head) => {
  try {
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
