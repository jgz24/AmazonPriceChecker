const mongoose = require("mongoose");
const request = require("request");
const puppeteer = require("puppeteer");

const Item = require("../models/itemsModel");

//Function for getting all items
exports.get_all_items = (req, res, next) => {
  Item.find()
    .select("name url currentPrice img _id")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        items: docs.map(doc => {
          return {
            name: doc.name,
            url: doc.url,
            currentPrice: doc.currentPrice,
            img: doc.img,
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
  const url = req.body.url;

  (async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    const productInfo = await page.evaluate(() => {
      return {
        name: document.querySelector("#productTitle").innerText,
        currentPrice: document.querySelector("#priceblock_ourprice").innerText,
        img: document.querySelector(".imgTagWrapper").children[0].currentSrc
      };
    });

    await browser.close();

    /*
     *Create a new Mongoose model.
     *With body-parser can create objects
     *that have body property that can extract
     *different properties depending on data received.
     *
     */
    const item = new Item({
      _id: new mongoose.Types.ObjectId(),
      name: productInfo["name"],
      url: url,
      currentPrice: productInfo["currentPrice"],
      img: productInfo["img"]
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
            img: result.img,
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
  })();
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
  const id = req.body._id;
  const url = req.body.url;

  (async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    const productInfo = await page.evaluate(() => {
      return {
        currentPrice: document.querySelector("#priceblock_ourprice").innerText
      };
    });

    await browser.close();

    Item.updateOne({ _id: id }, { $set: productInfo })
      .exec()
      .then(result => {
        res.status(200).json({
          message: "Item updated",
          request: {
            updatedPrice: productInfo["currentPrice"],
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
  })();
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
