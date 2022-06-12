const Identicon = require("identicon.js");

const INITIAL_ACCOUNT_ID = 0;

const createUser = ({ uid, wid, address, pubkey }) => {
  // const data = new Identicon(address, 64).toString();
  // const icon = `data:image/png;base64,${data}`;

  return {
    uid,
    wid,
    accounts: JSON.stringify([
      {
        id: INITIAL_ACCOUNT_ID,
        sid: address,
        ethAddress: address,
        pubkey,
        signer: "mpc",
      },
    ]),
    created_at: new Date(),
    updated_at: new Date(),
  };
};

const createWallet = ({ wid, uid, ucPubKey }) => {
  return {
    wid,
    uid,
    ucPubKey,
    created_at: new Date(),
    updated_at: new Date(),
  };
};

const createUserProxy = ({ sid, uid }) => {
  return {
    sid,
    uid,
    created_at: new Date(),
    updated_at: new Date(),
  };
};

module.exports = {
  createUser,
  createWallet,
  createUserProxy,
};
