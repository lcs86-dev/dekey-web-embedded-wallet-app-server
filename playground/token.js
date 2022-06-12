"use strict";
const { JWK, JWT, JWKS, JWE } = require("jose");
const { readFileSync, writeFileSync } = require("fs");
const requestIp = require("request-ip");
const keyStorage = "./storage/key_store.json";

const jsonKeystore = JSON.stringify({
  keys: [
    {
      crv: "Ed25519",
      x: "-VnRo9og0ELlKk1RYcwNsWAY9PRjk_znM4XUJpG_oj0",
      d: "m_FirTvGobtSU2tYJ48_ZFoPac11K3gLgHaXrJWyEsQ",
      kty: "OKP",
      kid: "session",
    },
    {
      crv: "Ed25519",
      x: "PRPEic-E9zI0I2O671ftRxq31m6Ww7FBCCkBIUevNIU",
      d: "75jPB_GikkBmIO7PZ7pNs8j65krsk9hHXXYno2R-tRE",
      kty: "OKP",
      kid: "mpc",
    },
  ],
});

let keyStore;
try {
  // keyStore = JWKS.asKeyStore(JSON.parse(readFileSync(keyStorage)));
  keyStore = JWKS.asKeyStore(JSON.parse(jsonKeystore));
} catch (err) {
  if (err.code == "ENOENT") {
    keyStore = new JWKS.KeyStore();
    keyStore.generateSync("OKP", "Ed25519", { kid: "session" });
    keyStore.generateSync("OKP", "Ed25519", { kid: "mpc" });
    // keyStore.generateSync("RSA", 2048, { kid: "encrypt" });
    writeFileSync(keyStorage, JSON.stringify(keyStore.toJWKS(true)));
  } else {
    console.log(err);
  }
}

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
  return JWT.sign(claim, mpcKey, { expiresIn: "1 sec" });
};

const createJwt = (uid) => {
  console.log("createJwt");
  const signKey = keyStore.get({ kid: "session" });
  console.log(signKey);
  return JWT.sign({ uid }, signKey, { expiresIn: "10 min" });
};

const claim = {
  uid: 1,
  op: "gen",
  data: { dsa: "ecdsa", curve: "secp256k1" },
};

console.log(createMpcJwt(claim));
setTimeout(() => {
  console.log(createMpcJwt(claim));
}, 1000);

// console.log(createMpcJwt(claim));
// setTimeout(() => {
// 	console.log(createMpcJwt(claim));
// }, 5000)
