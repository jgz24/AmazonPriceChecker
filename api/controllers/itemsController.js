const mongoose = require("mongoose");

const Item = require("../models/itemsModel");

//Function for getting all items
exports.get_all_items = (req, res, next) => {
  Item.find()
    .select("name url currentPrice _id")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        items: docs.map(doc => {
          return {
            name: doc.name,
            url: doc.url,
            currentPrice: doc.currentPrice,
            _id: doc._id,
            request: {
              type: "GET",
              appItemUrl: "http://localhost:3000/items/" + doc._id
            }
          };
        })
      };
      res.status(200).json(response);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

//Function to post an item
exports.post_item = (req, res, next) => {
  /*
   *Create a new Mongoose model.
   *With body-parser can create objects
   *that have body property that can extract
   *different properties depending on data received.
   *
   */
  const item = new Item({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    url: req.body.url,
    currentPrice: req.body.currentPrice
  });
  //Mongoose method that can be used on mongoose
  //models to save to the database
  item
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Created item sucessfully",
        createdItem: {
          name: result.name,
          url: result.url,
          currentPrice: result.currentPrice,
          _id: result._id,
          request: {
            type: "POST",
            appItemUrl: "http://localhost:3000/items/" + result._id
          }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

//Function to delete an item
exports.delete_item = (req, res, next) => {
  const id = req.params.itemId;
  Item.deleteOne({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Item deleted successfully",
        request: {
          type: "POST",
          url: "http://localhost:3000/items",
          body: { name: "String", url: "String", currentPrice: "Number" }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

//Function to update an item
exports.update_item = (req, res, next) => {
  const id = req.params.itemId;
  const update = {};
  //Limits the patching to the known
  //properties we have. Doesn't allow
  //new properties to be added.
  for (const ops of req.body) {
    update[ops.propName] = ops.value;
  }
  Item.update({ _id: id }, { $set: update })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Item updated",
        request: {
          type: "GET",
          appItemUrl: "http://localhost:3000/items/" + id
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

//Function that handles get requests for individual items
exports.get_item = (req, res, next) => {
  const id = req.params.itemId;
  Item.findById(id)
    .select("name url currentPrice _id")
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
          item: doc,
          request: {
            type: "GET",
            appItemUrl: "http://localhost:3000/items" + doc._id
          }
        });
      } else {
        res.status(404).json({ message: "No entry found for that ID." });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: error });
    });
};