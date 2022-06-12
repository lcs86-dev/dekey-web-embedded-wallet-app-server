const MongoClient = require("mongodb").MongoClient;
const { logger } = require("../utils/logger");

class MongoDB {
  db;
  users;
  userProxies;

  static async connect() {
    try {
      const dbName = "appserver";

      let url;
      if (process.env.USE_DNS_SEED_LIST === "true") {
        url = `mongodb+srv://${process.env.MONGO_APPSERVER_USERNAME}:${process.env.MONGO_APPSERVER_PASSWORD}@${process.env.MONGO_IP}/${dbName}?retryWrites=true&w=majority`;
      } else {
        url = `mongodb://${process.env.MONGO_APPSERVER_USERNAME}:${process.env.MONGO_APPSERVER_PASSWORD}@${process.env.MONGO_IP}/${dbName}?retryWrites=true&w=majority`;
      }

      // Use connect method to connect to the server
      const client = await MongoClient.connect(url);
      logger.debug("Connected successfully to server");

      this.db = client.db(dbName);
      this.users = this.db.collection("users");
      this.userProxies = this.db.collection("user_proxies");
      this.revokedJwts = this.db.collection("revoked_jwts");
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }
}

module.exports = MongoDB;
