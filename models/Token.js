const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
    token : {type:String, required:true},
    userId : {type: String, required: true},
    createdAt: { type: Date, default: Date.now, expires: "7d" },
})

module.exports = mongoose.model("userToken", tokenSchema);