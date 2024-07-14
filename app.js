const express = require('express')
require('dotenv').config()
require("./conn/conn.js") // always after dotenv b/c it uses it
const user = require("./routes/user.js")
const book = require('./routes/book.js')
const favorite = require("./routes/favorite.js")
const cart = require("./routes/cart.js")
const order = require("./routes/order.js")
const cors = require("cors")

const app = express()
// Middleware to parse JSON bodies
app.use(express.json());

app.use(cors())
app.use("/api/v1",user)
app.use("/api/v1",book)
app.use("/api/v1",favorite)
app.use("/api/v1",cart)
app.use("/api/v1",order)


app.get("/",(req,res) => {
    res.send("hell no")
})

//creating Port 
app.listen(process.env.PORT , () => {
    console.log(`server is running at port ${process.env.PORT}` )
})
