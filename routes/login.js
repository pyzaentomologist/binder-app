const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");
const initializePassport = require("../passport-config");
const checkNotAuthenticated = require("../middleware/checkNotAuthenticated");
const generateAccessToken = require("../middleware/generateAccessToken");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
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
  }),
  function (req, res) {
    const username = req.body;
    const user = { name: username.email };
    console.log(user);
    const accessToken = generateAccessToken(user);
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
    res.json({ accessToken: accessToken, refreshToken: refreshToken });
  }
);

module.exports = router;
