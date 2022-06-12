"use strict";
const addressRouter = require("express").Router();

const { verifyJwt, createMpcJwt } = require("../utils/jwt");
const { customLog } = require("../utils/logger");

addressRouter.use(verifyJwt, customLog);

addressRouter.post("/auth/gen", (req, res, next) => {
  /* generate a share and derive the frist child key from the share */
  try {
    const uid = req.user.uid;
    const claim = {
      uid,
      timestamp: new Date().getTime(),
      op: "gen",
      data: { dsa: "ecdsa", curve: "secp256k1" },
    };
    const mpcJwt = createMpcJwt(claim);
    res.send({ uid, mpcJwt });
  } catch (err) {
    next(err);
  }
});

module.exports = { addressRouter };
