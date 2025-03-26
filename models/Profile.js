const mongoose = require('mongoose');   

const ProfileSchema = new mongoose.Schema({
    profileimg : {type: String, required: true},
    username : {type: String, required: true},
    bio : {type: String, required: true},
    posts : {type: Array, required: true},
});

module.exports = mongoose.model('Profile', ProfileSchema);
