const express = require("express");
const router = express.Router();

const {
  verifyRefreshToken,
  generateAccessToken,
  generateRefreshToken,
} = require("../../../controllers/auth");

router.post("/refresh", async (req, res) => {
  const refreshToken = req.body.refreshToken;

  try {
    const decoded = verifyRefreshToken(refreshToken);

    const accessToken = generateAccessToken(decoded.user);
    const newRefreshToken = generateRefreshToken(decoded.user);

    res.json({ accessToken, refreshToken: newRefreshToken });
  } catch (error) {
    res.status(401).json({ message: "Invalid refresh token" });
  }
});
module.exports = router;
