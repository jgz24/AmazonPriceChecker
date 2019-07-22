const mongoose = require('mongoose');

var itemSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    URL:{
        type: String,
        required:true
    },
    current_price: {
        type: Number,
        required:true
    },
    create_date: {
        type: Date,
        default:Date.now
    }
});

const Item = mongoose.model('Items', itemSchema);
module.exports = Item;
