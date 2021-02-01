const express = require("express");
const storiesController = require("../controllers/storiesController");

const router = express.Router();

router.route("/create").post(storiesController.create);
router.route("/test").post(storiesController.test);

module.exports = router;
