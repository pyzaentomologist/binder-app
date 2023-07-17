const express = require("express");
const router = express.Router();
const checkAuthenticated = require("../middleware/checkAuthenticated");
router.post("/", checkAuthenticated, async function (req, res, next) {
  console.log(checkAuthenticated);
  try {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  } catch (e) {
    console.error(e);
  }
});
module.exports = router;
