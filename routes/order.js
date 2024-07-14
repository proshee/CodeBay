const router = require("express").Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./userAuth");
const Book = require("../models/book");
const Order = require("../models/order");

// place order
router.post("/place-order", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const { orders } = req.body;

    for (const order of orders) {
      const newOrder = new Order({
        user: id,
        book: order._id,
      });
      const orderDb = await newOrder.save();

      // add in user's model
      await User.findByIdAndUpdate(id, { $push: { orders: orderDb._id } });

      //clear cart
    }
    await User.findByIdAndUpdate(id, { $set: { cart:[] } });
    return res.status(200).json({
      status: "success",
      message: "Order Placed Successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// get order history of user i
router.get("/get-order-history", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const userData = await User.findById(id).populate({
      path: "orders",
      populate: { path: "book" },
    }); // nested populting

    const data = userData.orders.reverse();
    return res.status(200).json({
      status: "success",
      data: data,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error",error:error });
  }
});

// get-all-orders of all users --admin
router.get("/get-all-orders", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const userData = await Order.find()
      .populate({ path: "user" })
      .populate({ path: "book" })
      .sort({ createdAt: -1 });
    return res.status(200).json({
      status: "success",
      data: userData
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});


// update order --admin
router.put("/update-orders/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userData = await Order.findByIdAndUpdate(id,{
        status:req.body.status
    })
    return res.status(200).json({
        message:"Status updated"
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});



module.exports = router;
