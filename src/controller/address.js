"use strict";
const addressRouter = require("express").Router();
const { body, validationResult } = require("express-validator");

const { verifyJwt, createMpcJwt } = require("../utils/jwt");
const { customLog, logger, customErrorLog } = require("../utils/logger");
const { filterUserSecrets } = require("./user");
const db = require("../db/postgres");

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
    customErrorLog(err, req);
    next(err);
  }
});

// addressRouter.post(
//   "/add",
//   body("address").notEmpty().isString().isLength({ min: 1, max: 100 }),
//   body("accountName").notEmpty().isString().isLength({ min: 1, max: 100 }),
//   body("pubkey").notEmpty().isString(),
//   body("uCPubKey").notEmpty().isString(),
//   body("sid").notEmpty().isString(),
//   async (req, res, next) => {
//     try {
//       const { address, accountName, pubkey, uCPubKey, sid } = req.body;
//       const user = req.user;
//       const uid = user.uid;

//       if (user.sid) {
//         throw new Error(`Initialized user`);
//       }

//       // const data = new Identicon(address, 64).toString();
//       // const icon = `data:image/png;base64,${data}`;

//       user.share = {
//         sid,
//         ethAddress: address, //string
//         pubkey: pubkey, //string
//         uCPubKey, //string
//         accounts: {
//           ["0"]: {
//             aaid: 0,
//             signer: "mpc",
//             ethAddress: address, //string
//             pubkey: pubkey, //string
//             // name: accountName,
//             // icon,
//             // rules: {
//             //   autoConfirms: {},
//             //   limits: {
//             //     eth: {
//             //       perTx: 0.1,
//             //       perDay: 5,
//             //     },
//             //     maxGasPrice: 100,
//             //   },
//             //   blackLists: {},
//             //   whiteLists: {},
//             // },
//           },
//         },
//       };
//       // user.updated = new Date();
//       // delete user._id;

//       await db("users")
//         .withSchema("wallet")
//         .where({ uid })
//         .update({ updated: new Date(), share: user.share });

//       await db("user_proxies").withSchema("wallet").insert({
//         sid,
//         uCPubKey,
//         uid,
//         wid: user.wid,
//       });

//       const updatedUser = await db("users")
//         .withSchema("wallet")
//         .where({ uid })
//         .first();

//       res.send({ user: filterUserSecrets(updatedUser) });
//     } catch (err) {
//       customErrorLog(err, req);
//       next(err);
//     }
//   }
// );

module.exports = { addressRouter };
