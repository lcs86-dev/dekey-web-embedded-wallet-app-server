exports.up = function (knex, Promise) {
  return knex.schema
    .createTable("users", function (table) {
      table.string("uid").notNullable();
      table.integer("wid").notNullable();
      table.json("accounts").notNullable();
      table.timestamps();

      table.unique("uid");
    })
    .createTable("wallets", function (table) {
      table.string("uid").notNullable();
      table.integer("wid").notNullable();
      table.string("ucPubKey").notNullable();
      table.timestamps();
    })
    .createTable("user_proxies", function (table) {
      table.string("uid").notNullable();
      table.string("sid").notNullable();
      table.timestamps();

      table.unique("uid");
    });
};

exports.down = function (knex, Promise) {
  return knex.schema
    .dropTable("users")
    .dropTable("wallets")
    .dropTable("user_proxies");
};
