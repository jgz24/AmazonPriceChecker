const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

const app = express();

User = require('./models/users');

// Connect to the database
mongoose.connect('mongodb://localhost:27017/AmazonPriceChecker', {useNewUrlParser: true});
// Takes care of DeprecationWarning
mongoose.set('useCreateIndex', true);
const db = mongoose.connection;

//Sets the public folder as static
//app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req,res) => {
    res.send('Hello');
});
  
app.get('/api/users', (req,res) => {
    User.getUsers((err,users) => {
        if(err){
            throw err;
        }
        res.json(users);
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server running on port " + PORT + "...");
})