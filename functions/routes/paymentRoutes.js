const express = require("express");
const paymentController = require("../controllers/paymentController");

const router = express.Router();

router.route("/pay-with-card").post(paymentController.payWithCard);
router
  .route("/direct-bank-transfer")
  .post(paymentController.directBankTransfer);

module.exports = router;
