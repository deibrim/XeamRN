const express = require("express");
const storiesController = require("../controllers/storiesController");

const router = express.Router();

router.route("/add-story").post(storiesController.addStory);
router.route("/delete-story").post(storiesController.deleteStory);

module.exports = router;
