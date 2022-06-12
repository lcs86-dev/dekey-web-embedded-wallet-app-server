const crypto = require("crypto");
const { verifySelfSign } = require("../src/service/user");

// sid":"0x9DeC9A323602894373a46209B277CE5F21Dff3da"} ip: 119.200.18.11
// 2021-03-24 09:06:18 info: POST /unlock {"r":"0xc053794a0030851157278100deea757376c5b9a8bb167f2ffe769665b8b31fb6","s":"0x23dd9d2476fd8db9c30bf0a7a85c975e052ff7a22a72c3eee084e6ba0ee641bd","hashMessage":"f5fd69b9225ea5015381bb1123394c2a6d7ac818dff34efe8e7d80b67af169b4","aaid":0,"sid":"0x9DeC9A323602894373a46209B277CE5F21Dff3da"} ip: 119.200.18.11
// 2021-03-24 09:06:18 info: user: {"_id":"605994731631a500123aff65","uid":1616483443534

// const { sid } = req.body;
// const { uid } = await MongoDB.userProxies.findOne({ sid });

// {"r":"0xc053794a0030851157278100deea757376c5b9a8bb167f2ffe769665b8b31fb6","s":"0x23dd9d2476fd8db9c30bf0a7a85c975e052ff7a22a72c3eee084e6ba0ee641bd",
// "hashMessage":"f5fd69b9225ea5015381bb1123394c2a6d7ac818dff34efe8e7d80b67af169b4","aaid":0,
// "sid":"0x9DeC9A323602894373a46209B277CE5F21Dff3da"} ip: 119.200.18.11

// POST /recover/verify {"r":"0x425d2b664d6fdf2de5c96118b63cbc6aff9d97896d78329c9c7a488453f2cb64","s":"0xc02900d8cc77652f08192d353b117ee337c9571b04e25c3c0188974cdac47b54",
// "json":"{\"sid\":\"0xA0d18EdC6750eC2aE5f9cae91C0e85ada9439B28\",\"challenge\":\"SEHEE1616576732694\"}"} ip: 119.200.18.11

const uid = 1616483443534;

// const hashMessage = crypto
//   .createHash("sha256")
//   .update(`${uid}${Date.now().toString()}`)
//   .digest("hex");

// {"r":"0x425d2b664d6fdf2de5c96118b63cbc6aff9d97896d78329c9c7a488453f2cb64","s":"0xc02900d8cc77652f08192d353b117ee337c9571b04e25c3c0188974cdac47b54","json":"{\"sid\":\"0xA0d18EdC6750eC2aE5f9cae91C0e85ada9439B28\",\"challenge\":\"SEHEE1616576732694\"}"} ip: 119.200.18.11
// 2021-03-24 09:05:32 info: uCPubKey: 0x03bb0f531c5e0875fea7d673f845bf87c08483f72b7c466499a4ad2630bf38f8b5

const json = JSON.stringify({ a: "bccd" });

const hashMessage = crypto.createHash("sha256").update(json).digest("hex");

// const { r, s, hashMessage, aaid, uid } = dto;

const dto = {
  r: "0xc053794a0030851157278100deea757376c5b9a8bb167f2ffe769665b8b31fb6",
  s: "0x23dd9d2476fd8db9c30bf0a7a85c975e052ff7a22a72c3eee084e6ba0ee641bd",
  hashMessage,
  // hashMessage:
  //   "f5fd69b9225ea5015381bb1123394c2a6d7ac818dff34efe8e7d80b67af169b4",
  uCPubKey:
    "0x023582c897f34485efe435371ce27cc3d1817583f418d97d922fc4198daa3b6059",
  uid,
};

try {
  verifySelfSign(dto);
} catch (error) {
  console.error(error);
}
