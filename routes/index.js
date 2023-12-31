const express = require("express");
const router = express.Router();
const Book = require("../models/book");

router.get("/", async (req, res) => {
  if (req.isAuthenticated()) {
    user = await req.user;
  }
  let books;
  try {
    books = await Book.find().sort({ createAt: "desc" }).limit(5).exec();
    res.render("index", {
      books: books,
    });
  } catch {
    books = [];
  }
});

module.exports = router;
