const express = require("express");
const router = express.Router();
const passport = require("passport");
require("../../passport-config")(passport);
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../../controllers/auth");
const checkNotAuthenticated = require("../../../middleware/checkNotAuthenticated");

router.get("/", checkNotAuthenticated, async (req, res) => {
  res.render("login/index");
});

router.post("/", checkNotAuthenticated, async (req, res, next) => {
  passport.authenticate("jwt", { session: false }, async (err, user, info) => {
    try {
      if (err) {
        throw err;
      }
      console.log(info);
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      res.json({ accessToken, refreshToken });
    } catch (error) {
      next(error);
    }
  })(req, res, next);
});

module.exports = router;
