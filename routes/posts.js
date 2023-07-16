const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authenticateToken");
const posts = [
  {
    email: "a@gmail.com",
    title: "post",
  },
  {
    email: "b@gmail.com",
    title: "post 2",
  },
  {
    email: "c@gmail.com",
    title: "post 3",
  },
];

router.get("/", authenticateToken, (req, res) => {
  res.json(posts.filter((post) => post.email === req.user.name));
});

module.exports = router;
