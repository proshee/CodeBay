const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {authenticateToken} = require("./userAuth")

//sign-up
router.post("/sign-up", async (req, res) => {
  try {
    //   return res.status(200).json({message:"testing"})
    const { username, email, password, address } = req.body;
    if (!username || !email || !password || !address) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    if (username.length < 4) {
      return res.status(400).json({
        message: "username should be atleast of length 4",
      });
    }
    const existingUsername = await User.findOne({ username: username });
    if (existingUsername) {
      return res.status(400).json({
        message: "Username already exists",
      });
    }
    const existingEmail = await User.findOne({ email: email });
    if (existingEmail) {
      return res.status(400).json({
        message: "This email is already in use",
      });
    }
    if (password.length <= 5) {
      return res.status(400).json({
        message: "Password should be atleast of length 6",
      });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username: username,
      password: hashPassword,
      email: email,
      address: address,
    });
    await newUser.save();
    res.status(200).json({
      message: "Your Profile has been registered successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//sign-in
router.post("/sign-in", async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username: username });
    if (!existingUser) {
      return res.status(400).json({ message: "Invalid Credentials " });
    }
    await bcrypt.compare(password, existingUser.password, (err, bool) => {
      if (bool) {
        const authClaims = [
          { username: existingUser.username },
          { role: existingUser.role },
        ];
        const token = jwt.sign({ authClaims }, "books123", {
          expiresIn: "30d",
        });
        return res
          .status(200)
          .json({ id: existingUser.id, role: existingUser.role, token: token });
      } else {
        return res.status(400).json({ message: "Invalid Credentials " });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// get user information
router.get("/get-user-information", authenticateToken, async (req,res) =>{ // next if authenicattoken is true only then it goes to callback function

  try {
    const {id} = req.headers;
    const data = await User.findById(id).select("-password") //exclude password
    return res.status(200).json(data)
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }

})


// update address
router.put("/update-address", authenticateToken, async (req,res) =>{ // next if authenicattoken is true only then it goes to callback function

  try {
    const {id} = req.headers;
    const {address} = req.body
    await User.findByIdAndUpdate(id,{address:address})
    return res.status(200).json({message:"Address updated Successfully"})
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" , error:error});
  }

})

module.exports = router;
