const jwt  = require('jsonwebtoken');

module.exports = (req, res, next) =>{
    const token = req.cookies.accesstoken || req.headers["Authorization"]?.split(" ")[1];

    if(!token){
        return res.status(401).json({message : "Unauthorized"});
    }
    try{
        const decoded = jwt.verify(token, process.env.SECRETKEY);
        req.user = decoded;
        next();
    }
    catch(err){
        return res.status(401).json({msg : err.message});
    }
}