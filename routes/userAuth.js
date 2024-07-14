const jwt = require("jsonwebtoken")

const authenticateToken  = (req,res,next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1] // bearer "your_token"
    
    if (token == null) {
        return res.status(401).json({message:"Authorization token required"})
    }

    jwt.verify(token,"books123",(err,user) => {
        if (err) {
            return res.status(403).json({message:err})
        }
        req.user =user // attack user to req.user
        next()
    })
}

module.exports = {authenticateToken} // sends a object