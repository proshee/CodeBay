const router = require("express").Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./userAuth");
const Book = require("../models/book");

// add books to cart
router.put("/add-book-to-cart", authenticateToken, async (req, res) => {
  try {
    const { bookid, id } = req.headers;
    const userData = await User.findById(id);
    const isBookCarted = userData.cart.includes(bookid);
    if (isBookCarted) {
      return res
        .status(200)
        .json({ message: "Book is already added in cart" });
    }
    await User.findByIdAndUpdate(userData.id, { $push: { cart: bookid } });
    return res
      .status(200)
      .json({ message: "Book is added in cart successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// remove book from favorite
router.put(
  "/remove-book-from-cart/:bookid",
  authenticateToken,
  async (req, res) => {
    try {
      const { bookid } = req.params;
      const {id}  = req.headers
      const userData = await User.findById(id);
      const isBookCarted = userData.cart.includes(bookid);
      if (isBookCarted) {
        await User.findByIdAndUpdate(userData.id, {
          $pull:{cart:bookid}
        });
      }
      return res
        .status(200)
        .json({ message: "Book is removed from cart successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

// get all favorties
router.get(
  "/get-all-books-from-cart",
  authenticateToken,
  async (req, res) => {
    try {
      const {id } = req.headers;
      const userData = await User.findById(id).populate("cart");
      const cartedBooks = userData.cart
      return res
        .status(200)
        .json({ 
          status:"success",
          data:cartedBooks
         });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);


module.exports = router;
