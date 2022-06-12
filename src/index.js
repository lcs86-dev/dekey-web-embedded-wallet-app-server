const path = require("path");

require("dotenv").config({ path: path.resolve(__dirname, "../conf/.env") });

require("./db/postgres");

(async () => {
  if (
    process.env.NODE_ENV === "production" ||
    process.env.NODE_ENV === "testing"
  ) {
    // const options = {
    //   apiVersion: "v1", // default
    //   endpoint: process.env.VAULT_ADDR,
    //   token: process.env.VAULT_TOKEN,
    // };
    // // get new instance of the client
    // const vault = require("node-vault")(options);
    // // init vault server
    // const result = await vault.read("dkeys/data/appserver/mongodb");
    // const {
    //   data: {
    //     data: { password, username },
    //   },
    // } = result;
    // process.env.MONGO_APPSERVER_PASSWORD = password;
    // process.env.MONGO_APPSERVER_USERNAME = username;
    // const sessionResult = await vault.read("dkeys/data/appserver/token/session");
    // // const {
    // //   data: {
    // //     data: { crv, x, d, kty },
    // //   },
    // // } = sessionResult;
    // const mpcResult = await vault.read("dkeys/data/appserver/token/mpc");
    // process.env.KEY_STORE = JSON.stringify({
    //   keys: [
    //     { ...sessionResult.data.data, kid: "session" },
    //     { ...mpcResult.data.data, kid: "mpc" },
    //   ],
    // });
    // const aeskeysource = await vault.read("dkeys/data/appserver/aeskeysource");
    // process.env.AES_KEY_SOURCE = aeskeysource;
  }

  const frontServer = require("./server/front_server");

  frontServer.listen(process.env.FRONT_PORT, function () {
    console.log(
      new Date().toLocaleString() +
        " Server is listening on port " +
        process.env.FRONT_PORT
    );
  });
})();
