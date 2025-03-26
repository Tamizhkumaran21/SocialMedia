const express = require('express');
const User = require('../models/User');
const {register, login, logout, refreshtoken}= require('../controllers/authcontrollers.js');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post("/refresh_token", refreshtoken);
router.get("/logout", logout);
router.get("/dashboard", authMiddleware,async (req,res)=>{
    const user = await User.findById(req.user.id);
    res.status(200).json({msg: `Welcome to dashboard ${user.name}`,
        user: req.user
    });
})

module.exports = router;