"use strict";

const request = require("supertest");

const app = require("../app");
const User = require("../models/businesses");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u2Token,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** GET /businesses/[business] */

describe("GET /businesses/[business_name]", function () {
  test("get menu", async function () {
    const resp = await request(app)
      .get("/businesses/u1");
    expect(resp.body).toEqual({
      menu: [
        {
          id: expect.any(Number),
          type: "dinner",
          name: "Double-double",
          description: " Ground meat, usually beef, placed inside a sliced bread roll or bun",
          price: "9.99",
          businesses_id: "u1",
        },
        {
          id: expect.any(Number),
          type: "dinner",
          name: "Hamburger",
          description: " Ground meat, usually beef, placed inside a sliced bread roll or bun",
          price: "3.99",
          businesses_id: "u1",
        },
        {
          id: expect.any(Number),
          type: "dinner",
          name: "Cheesburger",
          description: " Ground meat, usually beef, placed inside a sliced bread roll or bun",
          price: "4.99",
          businesses_id: "u1",
        },
      ],
    });
  });

  test("No such business", async function () {
    const resp = await request(app)
      .get("/businesses/u1123")
    expect(resp.statusCode).toEqual(404);
  });
});

/************************************** Post /businesses/:business */

describe("Post /businesses/:business", function () {
  test("works for post for correct user", async function () {
    const resp = await request(app)
      .post(`/businesses/u1`)
      .send({
        type: "dinner",
        name: "Pizza",
        description: " Ground meat, usually beef, placed inside a sliced bread roll or bun",
        price: 3.99,
        _token: u1Token
      })
    expect(resp.body).toEqual(
      {
        dish: {
          id: expect.any(Number),
          name: "Pizza"
        }
      }
    );
  });
  test("no token post", async function () {
    const resp = await request(app)
      .post(`/businesses/u1`)
      .send({
        type: "dinner",
        name: "Pizza",
        description: " Ground meat, usually beef, placed inside a sliced bread roll or bun",
        price: 3.99
      })
    expect(resp.statusCode).toEqual(500);
  });
})

/************************************** Delete /businesses/:business/:id */
describe("Delete /businesses/:business/:id", function () {
  test("works for post for correct user", async function () {
    const resp = await request(app)
      .post(`/businesses/u1`)
      .send({
        type: "dinner",
        name: "Pizza",
        description: " Ground meat, usually beef, placed inside a sliced bread roll or bun",
        price: 3.99,
        _token: u1Token
      })
    const dishId = resp.body.dish.id
    expect(resp.body).toEqual(
      {
        dish: {
          id: expect.any(Number),
          name: "Pizza"
        }
      }
    );
    const respDel = await request(app)
      .delete(`/businesses/u1/${dishId}`)
      .send({
        _token: u1Token
      })
    expect(respDel.body).toEqual(
      {
        "deleted": dishId.toString()
      }
    )
  });

})
