const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const cors = require("cors")
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));
app.use('/api/auth', authRoutes);
app.use(cors());

try{
    connectDB().then(()=>{
        console.log("database is connected successfully");
        app.listen(process.env.PORT,()=>{
            console.log(`server is running on port ${process.env.PORT}`);
        })
    })
    
}
catch(err){
    console.log("there is an error in the db connection", err);
    process.exit(1);
}