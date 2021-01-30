"use strict";

/** Routes for users. */

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureCorrectUser } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const Businesses = require("../models/businesses");
const newDishSchema = require("../schemas/newDish.json");

const router = express.Router();



/** GET /[business] => { menu }
 *
 * Returns {id, type, description, price, businesses_id}
 *   where jobs is { id, title, companyHandle, companyName, state }
 *
 * Authorization required: admin or same user-as-:username
 **/

router.get("/:username", async function (req, res, next) {
  try {
    const menu = await Businesses.get(req.params.username);
    return res.json({ menu });
  } catch (err) {
    return next(err);
  }
});

/** GET /[business] => { profile }
 *
 * Returns {id, type, description, price, businesses_id}
 *   where jobs is { id, title, companyHandle, companyName, state }
 *
 * Authorization required: admin or same user-as-:username
 **/

router.get("/profile/:username", async function (req, res, next) {
  try {
    const user = await Businesses.getBusiness(req.params.username);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});

/** POST /[business] { dish } => { dish }
 *
 * Dish should be { type, name, description, price, businesses_id }
 *
 * Returns { id, name}
 * 
 * Authorization required: current business
 */

router.post("/:username", ensureCorrectUser, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, newDishSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const dish = await Businesses.create(req.body, req.params.username);
    return res.status(201).json({ dish });
  } catch (err) {
    return next(err);
  }
});


/** DELETE /[business]/[id]  =>  { deleted: dish }
 *
 * Authorization required:  same-user-as-:username
 **/

router.delete("/:username/:id", ensureCorrectUser, async function (req, res, next) {
  try {
    await Businesses.remove(req.params.id);
    return res.json({ deleted: req.params.id });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
