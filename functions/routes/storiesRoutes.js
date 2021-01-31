const express = require("express");
const storiesController = require("../controllers/storiesController");

const router = express.Router();

router.route("/create").post(storiesController.addStory);
router.route("/test").post(storiesController.test);
router.route("/delete").post(storiesController.deleteStory);

module.exports = router;
