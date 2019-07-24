const express = require("express");
const router = express.Router();

const itemController = require("../controllers/itemsController");

//Handles /items get requests
router.get("/", itemController.get_all_items);

//Handles /items post requests
router.post("/", itemController.post_item);

//Handles /items delete requests
router.delete("/:itemId", itemController.delete_item);

//Handles /items patch requests
router.patch("/:itemId", itemController.update_item);

//Handles specific item get requests
router.get("/:itemId", itemController.get_item);

module.exports = router;
