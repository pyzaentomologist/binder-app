const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  res.render("login/index");
});
router.post("/", async (req, res) => {
  res.render("/");
});

module.exports = router;
