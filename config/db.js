const mongoose = require('mongoose');
require("dotenv").config();

const DBURI = process.env.DBuri
console.log(DBURI);

const dbConnect = async ()=>{
    try{
        await mongoose.connect(DBURI,{useNewUrlParser:true,useUnifiedTopology : true, dbName:"users"});
        console.log("database is connected successfully");
    }catch(err){
        console.log("there is an error in the db connection", err);
        process.exit(1);
    }
}
module.exports = dbConnect