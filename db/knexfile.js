const path = require("path");

const {
  POSTGRESQL_PASSWORD,
  POSTGRESQL_USERNAME,
  POSTGRESQL_HOST,
  POSTGRESQL_DATABASE,
} = process.env;

module.exports = {
  production: {
    client: "pg",
    connection: {
      host: POSTGRESQL_HOST,
      database: POSTGRESQL_DATABASE,
      user: POSTGRESQL_USERNAME,
      password: POSTGRESQL_PASSWORD,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },
  development: {
    client: "pg",
    connection: {
      host: "127.0.0.1",
      database: "postgres",
      user: "postgres",
      password: "example",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },
};
