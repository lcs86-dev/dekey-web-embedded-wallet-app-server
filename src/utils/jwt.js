"use strict";
const { JWT, JWKS, JWE } = require("jose");
const { readFileSync, writeFileSync } = require("fs");
const keyStorage = "./storage/key_store.json";
const { logger, customLog } = require("./logger");
const db = require("../db/postgres");

const SESSION_JWT_DURATION = process.env.SESSION_JWT_DURATION;
const MPC_JWT_DURATION = process.env.MPC_JWT_DURATION;

console.log("process.env.KEY_STORE", process.env.KEY_STORE);

let keyStore;
try {
  // keyStore = JWKS.asKeyStore(JSON.parse(readFileSync(keyStorage)));
  keyStore = JWKS.asKeyStore(JSON.parse(process.env.KEY_STORE));
} catch (err) {
  if (err.code == "ENOENT") {
    keyStore = new JWKS.KeyStore();
    keyStore.generateSync("OKP", "Ed25519", { kid: "session" });
    keyStore.generateSync("OKP", "Ed25519", { kid: "mpc" });
    // keyStore.generateSync("RSA", 2048, { kid: "encrypt" });
    writeFileSync(keyStorage, JSON.stringify(keyStore.toJWKS(true)));
  } else {
    logger.error(err.toString());
  }
}

const createJwt = (uid) => {
  const signKey = keyStore.get({ kid: "session" });
  return JWT.sign({ uid }, signKey, { expiresIn: SESSION_JWT_DURATION });
};

const verifyJwt = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null)
    return res.status(401).send({ error: "No accessToken found" });
  let sessionKey = keyStore.get({ kid: "session" });

  console.log("verifyJwt", token);

  try {
    const claim = JWT.verify(token, sessionKey);
    console.log("verifyJwt claim", claim);
    const uid = claim.uid;

    if (!uid) {
      return res
        .status(404)
        .send({ error: "No uid from claim", code: "ERR_UID_NOT_FOUND" });
    }

    const user = await db("users")
      .where({
        uid,
      })
      .first();

    if (!user) {
      return res
        .status(404)
        .send({ error: "No user found", code: "ERR_USER_NOT_FOUND" });
    }

    req.user = user;

    next();
  } catch (err) {
    console.error(err);

    if (err.code == "ERR_JWT_EXPIRED") {
      return res
        .status(401)
        .send({ error: "Access token expired", code: "ERR_JWT_EXPIRED" });
      //need to redirect
    } else {
      return res
        .status(401)
        .send({ error: "Authoriziation failed", code: "ERR_AUTHORIZATION" });
    }
  }
};

const verifyJwtForBackup = async (req, res, next) => {
  try {
    const token = req.query.token;
    if (token == null)
      return res.status(401).send({ error: "No accessToken found" });
    let sessionKey = keyStore.get({ kid: "session" });

    const claim = JWT.verify(token, sessionKey);
    const uid = claim.uid;

    if (!uid) {
      return res
        .status(404)
        .send({ error: "No uid from claim", code: "ERR_UID_NOT_FOUND" });
    }

    const user = await db("users")
      .where({
        uid,
      })
      .first();
    if (!user) {
      return res
        .status(404)
        .send({ error: "No user found", code: "ERR_USER_NOT_FOUND" });
    }

    req.user = user;

    next();
  } catch (err) {
    logger.info(err.toString());
    if (err.code == "ERR_JWT_EXPIRED") {
      return res
        .status(401)
        .send({ error: "Access token expired", code: "ERR_JWT_EXPIRED" });
      //need to redirect
    } else {
      return res
        .status(401)
        .send({ error: "Authoriziation failed", code: "ERR_AUTHORIZATION" });
    }
  }
};

const createMpcJwt = (claim) => {
  /**
   * 
  op_enum = ['sign', 'gen', 'regen', 'derive']
  signData  = { pubkey, txhash }
  genData = { dsa: 'ecdsa', curve: 'secp256k1', threshold: '2/2' }
  regenData = { pubkey } 
  deriveDate = { pubkey, path }

  const claim_example  = { uid: 12233,
                           op: 'gen', 
                           data: { dsa: 'ecdsa', curve:'secp256k1' } 
                          }
  **/
  const mpcKey = keyStore.get({ kid: "mpc" });
  //claim  = JSON.stringify(claim)
  return JWT.sign(claim, mpcKey, { expiresIn: MPC_JWT_DURATION });
};

const verifyMpcJwt = async (req, socket) => {
  try {
    const mpcKey = keyStore.get({ kid: "mpc" });
    const token = req.headers["sec-websocket-protocol"];
    if (!token) {
      throw new Error("No token");
    }

    const claim = JWT.verify(token, mpcKey);
    req.headers["jwt"] = JSON.stringify(claim);

    return true;
  } catch (err) {
    logger.error(err.toString());
    socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
    socket.destroy();
    return false;
  }
};

const exportPubKey = (kid, format = "PEM") => {
  let key = keyStore.get({ kid: kid });
  if (format == "PEM") return key.toPEM();
  else return key.toJWK();
};

module.exports = {
  JWT,
  JWE,
  keyStore,
  createJwt,
  verifyJwt,
  verifyJwtForBackup,
  createMpcJwt,
  verifyMpcJwt,
  exportPubKey,
};
