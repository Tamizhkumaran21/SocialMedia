const jwt  = require("jsonwebtoken");

const generateAccessToken = (user)=>{
    return jwt.sign({id : user._id}, process.env.SECRETKEY, {expiresIn : "15m"});
}

const generateRefreshToken = (user)=>{
    return jwt.sign({id : user._id, date : new Date()}, process.env.SECRETKEY_REFRESH,{expiresIn : "7d"})
}

const verifyToken = (token, secret)=>{
    return jwt.verify(token, secret);
}

module.exports = {generateAccessToken, generateRefreshToken, verifyToken};