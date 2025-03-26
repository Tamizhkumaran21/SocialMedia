const becrypt = require('bcryptjs');
const User = require('../models/User');
const Token = require('../models/Token'); 
const {generateAccessToken, generateRefreshToken, verifyToken} = require('../config/jwt');

const register = async (req,res)=>{
    const {name, email, password} = req.body;

    if(!name || !email || !password){
        return res.status(400).json({msg: "Please enter all fields"});
    }
    try{
       const Useremail = await User.findOne({email});
       const Username = await User.findOne({name});
       if(Useremail) return res.status(400).json({msg: "email already exists"});
       if(Username) return res.status(400).json({msg: "Username already exists"});
        
       const newUser = new User({name, email, password});
        await newUser.save();
        const data = await User.findOne({email});
        const accesstoken = generateAccessToken(data);
        const refreshtoken = generateRefreshToken(data);

        await Token.create({token: refreshtoken, userId: data._id});

        res.cookie("accesstoken", accesstoken, {httpOnly: true, secure : true});
        res.cookie("refreshtoken", refreshtoken, {httpOnly: true, secure : true});

        res.json({msg: "Register Success"});
       
    }
    catch(err){
        return res.status(500).json({mssg: err.message});
    }
}

const login = async (req, res)=>{
    const {email, password} = req.body;

    if(!email || !password){
        return res.status(400).json({msg: "please enter all fields"})
    }
       
    try{
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({msg: "User does not exist"});
        }
        const isMatch = await becrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({msg: "Invalid credentials"});
        }
        const accesstoken = generateAccessToken(user);
        const  refreshtoken = generateRefreshToken(user);
        console.log("refreshtoken",refreshtoken);
        const checktopen = await Token.find({userId: user._id});
        
        if(checktopen){
            await Token.deleteMany({userId: user._id});
        }

        if (!refreshtoken) {
            console.log("Error: Token is null before saving.");
            return res.status(400).json({ message: "Error: Token is null" });
        }

        await Token.create({token : refreshtoken, userId: user._id});

        res.cookie("accesstoken", accesstoken, {httpOnly: true, secure : true});
        res.cookie("refreshtoken", refreshtoken, {httpOnly: true, secure : true});
        res.status(200).json({accesstoken, refreshtoken}); 
    }
    catch(err){
        return res.status(500).json({msg: err.message});
    }
}
const refreshtoken = async (req, res)=>
    {
    const {refreshtoken} = req.cookies;
    if(!refreshtoken){
        return res.status(400).json({msg: "please Login or Register"})
    }
    try{
        const token = await Token.findOne({token: refreshtoken});
        if(!token){
            return res.status(400).json({msg: "Invalid token"});
        }

        const user = verifyToken(refreshtoken, process.env.SECRETKEY_REFRESH);
        const newAccessToken = generateAccessToken({id: user.id});
        res.cookie("accesstoken", newAccessToken, {httpOnly: true, secure : true});
        res.status(200).json({"newAccessToken" : newAccessToken});
    }
    catch(err){
        return res.status(500).json({msg: err.message});
    }
}

const logout = async (req, res)=>{
    res.clearCookie("accesstoken");
    res.clearCookie("refreshtoken");
    console.log("req.cookies.refreshtoken",req.cookies.refreshtoken);
    await Token.deleteOne({token: req.cookies.refreshtoken});
    res.status(200).json({msg: "Logged out"});

}

module.exports = {register, login, refreshtoken, logout};