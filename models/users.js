const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required:true
    },
    items: {
        type: Map,
        of: String
    }
});

const User =  mongoose.model('Users',userSchema,'Users');
module.exports = User;

module.exports.getUsers = (callback, limit) => {
    User.find(callback).limit(limit);
}