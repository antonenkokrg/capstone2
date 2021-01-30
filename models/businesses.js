"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config.js");

/** Related functions for users. */

class Businesses {
  /** authenticate user with username, password.
   *
   * Returns { username, first_name, last_name, email, is_admin }
   *
   * Throws UnauthorizedError is user not found or wrong password.
   **/

  static async authenticate(username, password) {
    // try to find the user first
    const result = await db.query(
      `SELECT username,
                  password,
                  email,
                  logo_url,
                  address
           FROM businesses
           WHERE username = $1`,
      [username],
    );

    const user = result.rows[0];

    if (user) {
      // compare hashed password to a new hash from password
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid === true) {
        delete user.password;
        return user;
      }
    }

    throw new UnauthorizedError("Invalid username/password");
  }

  /** Register user with data.
   *
   * Returns { username, firstName, lastName, email, isAdmin }
   *
   * Throws BadRequestError on duplicates.
   **/

  static async register(
    { username, password, email, logo_url, address }) {
    const duplicateCheck = await db.query(
      `SELECT username
           FROM businesses
           WHERE username = $1`,
      [username],
    );

    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`Duplicate username: ${username}`);
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    const result = await db.query(
      `INSERT INTO businesses
           (username,
            password,
            email,
            logo_url,
            address)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING username, email, logo_url, address`,
      [
        username,
        hashedPassword,
        email,
        logo_url,
        address
      ],
    );

    const user = result.rows[0];

    return user;
  }

  /** Given a business name, return data about businesses menu.
   *
   * Returns { id, type, name, description, price, jobs }
   *  
   *
   * Throws NotFoundError if user not found.
   **/

  static async get(business) {
    const userRes = await db.query(
      `SELECT *
           FROM dishes
           WHERE businesses_id = $1`,
      [business],
    );

    if (!userRes.rows[0]) throw new NotFoundError(`No user or menu`);
    return userRes.rows;
  }

  static async getBusiness(username) {
    const userRes = await db.query(
      `SELECT username, email, logo_url, address
           FROM businesses
           WHERE username = $1`,
      [username],
    );

    const user = userRes.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);

    return user;
  }

  static async create(data, username) {
    const result = await db.query(
      `INSERT INTO dishes (type,
                             name,
                             description,
                             price,
                             businesses_id)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING id, name`,
      [
        data.type,
        data.name,
        data.description,
        data.price,
        username
      ]);
    let dish = result.rows[0];

    return dish;
  }

  static async remove(id) {
    let result = await db.query(
      `DELETE
           FROM dishes
           WHERE id = $1
           RETURNING id`,
      [id],
    );
    const dish = result.rows[0];

    if (!dish) throw new NotFoundError(`No such dish`);
  }
}


module.exports = Businesses;
