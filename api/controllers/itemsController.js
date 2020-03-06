const Item = require("../models/itemsModel");

const puppeteer = require("puppeteer");
const mongoose = require("mongoose");

//Function for getting all items
get_all_items = async (req, res) => {
  try {
    const result = await Item.find({});
    res.json(result);
  } catch (err) {
    res.json({ message: err });
  }
};

//Function to post an item
post_item = async (req, res) => {
  try {
    const itemUrl = req.body.url;

    (async () => {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(itemUrl);

      const productInfo = await page.evaluate(() => {
        return {
          name: document
            .querySelector("#productTitle")
            .innerText.substring(0, 40),
          currentPrice: document.querySelector("#priceblock_ourprice")
            .innerText,
          img: document.querySelector(".imgTagWrapper").children[0].currentSrc
        };
      });

      await browser.close();

      // Create a new mongoose model with the scraped amazon data.
      const item = new Item({
        _id: new mongoose.Types.ObjectId(),
        name: productInfo["name"],
        url: itemUrl,
        currentPrice: productInfo["currentPrice"],
        img: productInfo["img"]
      });

      // Save newly created item to database
      try {
        const savedItem = await item.save();
        res.redirect("/");
      } catch (err) {
        res.json({ message: err });
      }
    })();
  } catch (err) {
    console.log({ message: err });
  }
};

//Function to delete an item
delete_item = async (req, res) => {
  try {
    const id = req.params.itemId;

    const deleteItem = await Item.deleteOne({ _id: id });
    res.json(deleteItem);
  } catch (err) {
    console.log({ message: err });
  }
};

module.exports = { get_all_items, post_item, delete_item };
