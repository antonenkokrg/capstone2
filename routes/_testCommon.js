"use strict";

const db = require("../db.js");
const Businesses = require("../models/businesses");
const { createToken } = require("../helpers/tokens");


async function commonBeforeAll() {
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM businesses");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM dishes");

  await Businesses.register({
    username: "u1",
    email: "user1@user.com",
    password: "password1",
  });
  await Businesses.register({
    username: "u2",
    email: "user2@user.com",
    password: "password2",
  });
  await Businesses.register({
    username: "u3",
    email: "user3@user.com",
    password: "password3",
  });

  await Businesses.create(
    {
      type: "dinner",
      name: "Double-double",
      description: " Ground meat, usually beef, placed inside a sliced bread roll or bun",
      price: 9.99,
    }, "u1");
  await Businesses.create(
    {
      type: "dinner",
      name: "Hamburger",
      description: " Ground meat, usually beef, placed inside a sliced bread roll or bun",
      price: 3.99,
    }, "u1");
  await Businesses.create(
    {
      type: "dinner",
      name: "Cheesburger",
      description: " Ground meat, usually beef, placed inside a sliced bread roll or bun",
      price: 4.99,
    }, "u1");
}

async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}


const u1Token = createToken({ username: "u1" });
const u2Token = createToken({ username: "u2" });


module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u2Token,
};
