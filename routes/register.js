const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.get("/", async (req, res) => {
  res.render("register/index");
});

router.post("/", async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  try {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });
    const newUser = await user.save();
    res.redirect("/login");
  } catch {
    const params = { errorMessage: "Error Register" };
    res.redirect("/", params);
  }
});

module.exports = router;
