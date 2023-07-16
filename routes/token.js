const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  const refreshToken = req.body.token;
});

module.exports = router;
