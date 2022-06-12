"use strict";
const userRouter = require("express").Router();
const crypto = require("crypto");
const { body, validationResult } = require("express-validator");

const db = require("../db/postgres");
const {
  createJwt,
  verifyJwt,
  JWT,
  JWE,
  keyStore,
  createMpcJwt,
  verifyJwtForUnlock,
} = require("../utils/jwt");
// const { createBaseRules } = require("./rule");
// const { createEthAccount } = require("../utils/coin");
const bcrypt = require("bcrypt");
const {
  lockAccount,
  unlockAccount,
  verifySelfSign,
  resetUserLimits,
  emitUserEvent,
} = require("../service/user");
// const { sendEmail } = require("../service/email");
// const { resetMfa, handleResetFailure } = require("../service/rule/rule");
const saltRound = 10;
// const encryptKey = keyStore.get({ kid: "encrypt" });
const { logger, customLog, customErrorLog } = require("../utils/logger");
const { validationErrorHandler } = require("../utils/error");
const { createUser, createWallet, createUserProxy } = require("../utils/user");
const { bodyValidationMiddleware } = require("../utils/middleware");

const filterUserSecrets = (user) => {
  delete user.lockedSessionJwts;
  // delete user.twoFactorSecret;
  // delete user.lastPath;
  // delete user.cipher;
  // delete user.twoFAResetCode;
  // delete user.created;
  // delete user.updated;
  // delete user.passResetCode;
  return {
    ...user,
    // share: user.share,
  };
};

userRouter.get("/", customLog, function (req, res) {
  res.send({ info: "user api uri" });
});

userRouter.post(
  "/register",
  customLog,
  body("address").notEmpty().isString().isLength({ min: 1, max: 100 }),
  body("pubkey").notEmpty().isString().isLength({ min: 1, max: 100 }),
  body("uCPubKey").notEmpty().isString().isLength({ min: 1, max: 100 }),
  body("sid").notEmpty().isString().isLength({ min: 1, max: 100 }),
  body("uid").notEmpty().isNumeric().isLength({ min: 1, max: 100 }),
  body("wid").notEmpty().isNumeric().isLength({ min: 1, max: 100 }),
  bodyValidationMiddleware,
  async (req, res, next) => {
    try {
      const { address, pubkey, uCPubKey, wid, sid, uid } = req.body;

      const user = createUser({
        uid,
        wid,
        address,
        pubkey,
      });

      const wallet = createWallet({
        wid,
        uid,
        ucPubKey: uCPubKey,
      });

      const userProxy = createUserProxy({
        sid,
        uid,
      });

      // TODO: transaction
      await db("users").insert(user);
      await db("user_proxies").insert(userProxy);
      await db("wallets").insert(wallet);

      const newUser = await db("users").where({ uid }).first();
      const wallets = await db("wallets").where({ uid });

      const accessToken = createJwt(uid);

      res.send({
        accessToken,
        user: filterUserSecrets(newUser),
        wallets,
        expiresIn: process.env.SESSION_JWT_DURATION_IN_MILLISECONDS,
      });
    } catch (err) {
      next(err);
    }
  }
);

userRouter.post(
  "/recover",
  customLog,
  body("uCPubKey").notEmpty().isString().isLength({ min: 1, max: 100 }),
  body("uid").notEmpty().isNumeric().isLength({ min: 1, max: 100 }),
  body("wid").notEmpty().isNumeric().isLength({ min: 1, max: 100 }),
  bodyValidationMiddleware,
  async (req, res, next) => {
    try {
      const { uCPubKey, wid, uid } = req.body;

      const wallet = createWallet({
        wid,
        uid,
        ucPubKey: uCPubKey,
      });

      await db("wallets").insert(wallet);

      const newUser = await db("users").where({ uid }).first();
      const wallets = await db("wallets").where({ uid });

      const accessToken = createJwt(uid);

      res.send({
        accessToken,
        user: filterUserSecrets(newUser),
        wallets,
        expiresIn: process.env.SESSION_JWT_DURATION_IN_MILLISECONDS,
      });
    } catch (err) {
      next(err);
    }
  }
);

userRouter.post(
  "/wallets",
  customLog,
  body("uCPubKey").notEmpty().isString().isLength({ min: 1, max: 100 }),
  body("uid").notEmpty().isNumeric().isLength({ min: 1, max: 100 }),
  body("wid").notEmpty().isNumeric().isLength({ min: 1, max: 100 }),
  bodyValidationMiddleware,
  async (req, res, next) => {
    try {
      const { uCPubKey, wid, uid } = req.body;

      const wallet = createWallet({
        wid,
        uid,
        ucPubKey: uCPubKey,
      });

      await db("wallets").insert(wallet);

      const newUser = await db("users").where({ uid }).first();
      const wallets = await db("wallets").where({ uid });

      const accessToken = createJwt(uid);

      res.send({
        accessToken,
        user: filterUserSecrets(newUser),
        wallets,
        expiresIn: process.env.SESSION_JWT_DURATION_IN_MILLISECONDS,
      });
    } catch (err) {
      next(err);
    }
  }
);

userRouter.post(
  "/uid-wid",
  customLog,
  body("sid").notEmpty().isString(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { sid } = req.body;
      const { uid, wid } = await db("user_proxies").where({ sid }).first();

      const user = await db("users").where({ uid }).first();

      if (!user || user.share.sid !== sid) {
        throw new Error(
          `No user or sid mismatch with sid ${sid} and user ${JSON.stringify(
            user
          )}`
        );
      }

      res.send({ uid, wid });
    } catch (err) {
      customErrorLog(err, req);
      next(err);
    }
  }
);

userRouter.post(
  "/accessToken/regen",
  verifyJwt,
  customLog,
  async (req, res, next) => {
    try {
      const uid = req.user.uid;
      const accessToken = createJwt(uid);
      const expiresIn = process.env.SESSION_JWT_DURATION_IN_MILLISECONDS;
      res.send({ accessToken, expiresIn });
    } catch (err) {
      customErrorLog(err, req);
      next(err);
    }
  }
);

userRouter.post("/lock", verifyJwt, customLog, async (req, res, next) => {
  const uid = req.user.uid;

  try {
    const authHeader = req.headers["authorization"];
    const accessToken = authHeader && authHeader.split(" ")[1];

    await lockAccount({ uid, accessToken });

    res.send({});
  } catch (err) {
    customErrorLog(err, req);
    next(err);
  }
});

userRouter.post(
  "/unlock",
  customLog,
  body("r").notEmpty().isString(),
  body("s").notEmpty().isString(),
  body("hashMessage").notEmpty().isString(),
  body("aaid").notEmpty().isNumeric(),
  body("sid").notEmpty().isString(),
  body("wid").notEmpty().isNumeric(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { r, s, hashMessage, aaid, sid, wid } = req.body;

      const { uid } = await db("user_proxies").where({ sid }).first();

      await verifySelfSign({ r, s, hashMessage, aaid, uid, wid });

      const accessToken = createJwt(uid);
      const expiresIn = process.env.SESSION_JWT_DURATION_IN_MILLISECONDS;

      res.status(200).send({ accessToken, expiresIn });
    } catch (err) {
      customErrorLog(err, req);
      next(err);
    }
  }
);

userRouter.post(
  "/self-sign/verify",
  verifyJwt,
  customLog,
  body("r").notEmpty().isString(),
  body("s").notEmpty().isString(),
  body("hashMessage").notEmpty().isString(),
  body("aaid").notEmpty().isNumeric(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { r, s, hashMessage, aaid } = req.body;
      const uid = req.user.uid;

      await verifySelfSign({ r, s, hashMessage, aaid, uid });

      const accessToken = createJwt(uid);
      const expiresIn = process.env.SESSION_JWT_DURATION_IN_MILLISECONDS;

      res.send({ accessToken, expiresIn });
    } catch (err) {
      customErrorLog(err, req);
      next(err);
    }
  }
);

userRouter.post("/get", verifyJwt, customLog, async (req, res, next) => {
  try {
    const uid = req.user.uid;
    const user = await db("users").where({ uid }).first();

    const accessToken = createJwt(uid);
    const expiresIn = process.env.SESSION_JWT_DURATION_IN_MILLISECONDS;

    res.send({ user: filterUserSecrets(user), accessToken, expiresIn });
  } catch (err) {
    customErrorLog(err, req);
    next(err);
  }
});

userRouter.post(
  "/get-with-sid",
  customLog,
  body("sid").notEmpty().isString(),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { sid } = req.body;
      const { uid } = await db("user_proxies").where({ sid }).first();

      const user = await db("users").where({ uid }).first();

      if (!user) {
        throw new Error(`user not found with uid ${uid}`);
      }

      const accessToken = createJwt(uid);
      const expiresIn = process.env.SESSION_JWT_DURATION_IN_MILLISECONDS;

      res.send({ user: filterUserSecrets(user), accessToken, expiresIn });
    } catch (err) {
      customErrorLog(err, req);
      res.status(500).send({ error: err.toString() });
    }
  }
);

userRouter.post(
  "/challenge-message",
  customLog,
  // body("sid").notEmpty().toString(), // TODO: why this line make errors?
  async (req, res, next) => {
    try {
      console.log("req.body", req.body);
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { sid } = req.body;

      const { uid } = await db("user_proxies")
        .where({
          sid,
        })
        .first();

      if (!uid) {
        throw new Error("uid not found");
      }

      const hashMessage = crypto
        .createHash("sha256")
        .update(`${uid}${Date.now().toString()}`)
        .digest("hex");

      res.send({ hashMessage });
    } catch (err) {
      customErrorLog(err, req);
      logger.error(err);
      next(err);
    }
  }
);

module.exports = { userRouter, filterUserSecrets };
