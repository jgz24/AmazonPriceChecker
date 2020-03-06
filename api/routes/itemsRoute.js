const {
  get_all_items,
  post_item,
  delete_item
} = require("../controllers/itemsController");

const express = require("express");
const router = express.Router();

//Handles /items get requests
router.get("/", get_all_items);

//Handles /items post requests
router.post("/", post_item);

//Handles /items delete requests
router.delete("/:itemId", delete_item);

module.exports = router;
