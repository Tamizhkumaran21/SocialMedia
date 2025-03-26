const {storage} = require("@google-cloud/storage");
const multer = require("multer");
const path = require("path");
const Profile = require("../models/Profile");

const profileview = async(req,res)=>{
  const user = req.user;
}