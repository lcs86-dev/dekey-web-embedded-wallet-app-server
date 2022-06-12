const _ = require("lodash");
const EC = require("elliptic");

const db = require("../../db/postgres");

const verifySelfSign = async (dto) => {
  console.log("verifySelfSign dto", dto);
  try {
    const ec = new EC.ec("secp256k1");
    const { r, s, hashMessage, aaid, uid, wid } = dto;
    const wallet = await db("wallets")
      .where({
        uid,
        wid,
      })
      .first();
    const uCPubKey = wallet.ucPubKey;

    console.log("wallet", wallet);
    console.log("uCPubKey", uCPubKey);

    const key = ec.keyFromPublic(uCPubKey.replace("0x", ""), "hex");
    const verified = key.verify(hashMessage, {
      r: r.replace("0x", ""),
      s: s.replace("0x", ""),
    });
    if (!verified) {
      throw new Error("Selfsign verification failed");
    }
  } catch (error) {
    throw error;
  }
};

const _getWallet = (wallets) => {
  const wids = wallets.map((w) => {
    return w.wid;
  });
  const walletId = Math.max(...wids);
  return wallets.find((w) => w.wid == walletId);
};

module.exports = {
  verifySelfSign,
};
