const router = require("express").Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./userAuth");
const Book = require("../models/book");

// add-books -admin
router.post("/add-book", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const { role } = await User.findById(id);
    if (role !== "admin") {
      return res.status(403).json({ message: "you don't have rights" });
    }

    const newBook = new Book({
      url: req.body.url,
      title: req.body.title,
      price: req.body.price,
      author: req.body.author,
      desc: req.body.desc,
      language: req.body.language,
    });

    await newBook.save();
    return res.status(200).json({ message: "Book added successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// update books
router.put("/update-book", authenticateToken, async (req, res) => {
  try {
    const { bookid } = req.headers; // use non-capital words for headers
    console.log(bookid);
    const existingBook = await Book.findById(bookid);
    if (!existingBook) {
      return res.status(404).json({ message: "Book is not found" });
    }
    // Find the book by ID and update
    const updatedBook = await Book.findByIdAndUpdate(
      bookid,
      {
        url: req.body.url,
        title: req.body.title,
        price: req.body.price,
        author: req.body.author,
        desc: req.body.desc,
        language: req.body.language,
      },
      { new: true } // Return the updated document
    );

    if (!updatedBook) {
      return res.status(404).json({ message: "Book is not updated" });
    }
    return res.status(200).json({ message: "Book updated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

//delete books -admin
router.delete("/delete-book", authenticateToken, async (req, res) => {
  try {
    const { id, bookid } = req.headers; // use non-capital words for headers
    const { role } = await User.findById(id);
    if (role !== "admin") {
      return res.status(403).json({ message: "you don't have rights" });
    }
    console.log(bookid);
    const existingBook = await Book.findById(bookid);
    if (!existingBook) {
      return res.status(404).json({ message: "Book is not found" });
    }
    await Book.findByIdAndDelete(bookid)
    return res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// get all books
router.get("/get-all-books",async(req,res)=> {
    try {
        const data  = await Book.find().sort({createdAt:-1}) // -1 -> descending To sort the data in ascending order using Mongoose in your Book.find() query, you should use 1 instead of -1 for the createdAt field. Here’s how you can do it:
        return res.status(200).json({
            status:'success',
            data:data
        })
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
})


// get recent books limited to 4
router.get("/get-some-books",async(req,res)=> {
    try {
        const data  = await Book.find().sort({createdAt:-1}).limit(4) // -1 -> descending To sort the data in ascending order using Mongoose in your Book.find() query, you should use 1 instead of -1 for the createdAt field. Here’s how you can do it:
        return res.status(200).json({
            status:'success',
            data:data
        })
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
})


// get book by id
router.get("/get-book-by-id/:id",async(req,res)=> {
    try {
        const {id} = req.params
        const data = await Book.findById(id)
        return res.status(200).json({
            status:'success',
            data:data
        })
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
})



module.exports = router;
