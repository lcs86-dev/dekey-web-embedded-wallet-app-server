const path = require("path");

if (process.env.NODE_ENV === "development") {
  require("dotenv").config();
} else {
  require("dotenv").config({ path: path.resolve(__dirname, "../conf/.env") });
}

require("./db/postgres");

(async () => {
  if (
    process.env.NODE_ENV === "production" ||
    process.env.NODE_ENV === "testing"
  ) {
    const options = {
      apiVersion: "v1",
      endpoint: process.env.VAULT_ADDR,
      token: process.env.VAULT_TOKEN,
    };
    const vault = require("node-vault")(options);

    const result = await vault.read("dkeys/data/appserver/mongodb");
    const {
      data: {
        data: { password, username, database, host },
      },
    } = result;
    process.env.POSTGRESQL_PASSWORD = password;
    process.env.POSTGRESQL_USERNAME = username;
    process.env.POSTGRESQL_HOST = host;
    process.env.POSTGRESQL_DATABASE = database;

    // const {
    //   data: {
    //     data: { crv, x, d, kty },
    //   },
    // } = sessionResult;
    const sessionResult = await vault.read(
      "dkeys/data/appserver/token/session"
    );
    const mpcResult = await vault.read("dkeys/data/appserver/token/mpc");
    process.env.KEY_STORE = JSON.stringify({
      keys: [
        { ...sessionResult.data.data, kid: "session" },
        { ...mpcResult.data.data, kid: "mpc" },
      ],
    });

    const aeskeysource = await vault.read("dkeys/data/appserver/aeskeysource");
    process.env.AES_KEY_SOURCE = aeskeysource;
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
