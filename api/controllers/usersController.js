const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../models/usersModel");

//Function that signs up a user
exports.sign_up = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .exec()
    .then(user => {
      if (user) {
        //Error 409 means we got the request
        //and can handle it, but have conflicts
        //with resources we already have
        return res.status(409).json({
          message: "E-mail already exists"
        });
      } else {
        //Salting it means adding some letters
        //to the password before hashing.
        //Added security since plaintext of
        //strings can easily be found.
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash
            });
            user
              .save()
              .then(result => {
                console.log(result);
                res.status(201).json({
                  message: "New user created"
                });
              })
              .catch(err => {
                console.log(err);
                res.status(500).json({
                  error: err
                });
              });
          }
        });
      }
    })
    .catch();
};

//Function that signs in a user
exports.user_login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .exec()
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: "Authorization failed"
        });
      }
      bcrypt.compare(req.body.password, user.password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Authorization failed"
          });
        }
        if (result) {
          return res.status(200).json({
            message: "Authorization successful"
          });
        }
        res.status(401).json({
          message: "Authorization failed"
        });
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

//Function that deletes a user's account
exports.delete_user = (req, res, next) => {
  User.deleteOne({ _id: req.params.userId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "User deleted"
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};
