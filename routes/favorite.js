const router = require("express").Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./userAuth");
const Book = require("../models/book");

// add books to favorites
router.put("/add-book-to-favorite", authenticateToken, async (req, res) => {
  try {
    const { bookid, id } = req.headers;
    const userData = await User.findById(id);
    const isBookFavourite = userData.favorite.includes(bookid);
    if (isBookFavourite) {
      return res
        .status(200)
        .json({ message: "Book is already added in favorites" });
    }
    await User.findByIdAndUpdate(userData.id, { $push: { favorite: bookid } });
    return res
      .status(200)
      .json({ message: "Book is added in favorites successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// remove book from favorite
router.put(
  "/remove-book-from-favorite",
  authenticateToken,
  async (req, res) => {
    try {
      const { bookid, id } = req.headers;
      const userData = await User.findById(id);
      const isBookFavourite = userData.favorite.includes(bookid);
      if (isBookFavourite) {
        await User.findByIdAndUpdate(userData.id, {
          $pull:{favorite:bookid}
        });
      }
      return res
        .status(200)
        .json({ message: "Book is removed from favorites successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

// get all favorties
router.get(
  "/get-all-books-from-favorite",
  authenticateToken,
  async (req, res) => {
    try {
      const {id } = req.headers;
      const userData = await User.findById(id).populate("favorite");
      const favoriteBooks = userData.favorite
      return res
        .status(200)
        .json({ 
          status:"success",
          data:favoriteBooks
         });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

module.exports = router;
