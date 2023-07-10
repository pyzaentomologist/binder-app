const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");
const initializePassport = require("../passport-config");
const checkNotAuthenticated = require("../middleware/checkNotAuthenticated");
const mongoose = require("mongoose");
initializePassport(
  passport,
  async function (email) {
    return await User.findOne({ email }).exec();
  },
  async function (id) {
    const objectId = new mongoose.Types.ObjectId(id);
    return await User.findOne({ _id: objectId }).exec();
  }
);
router.get("/", checkNotAuthenticated, async (req, res) => {
  res.render("login/index");
});
router.post(
  "/",
  checkNotAuthenticated,
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

module.exports = router;
