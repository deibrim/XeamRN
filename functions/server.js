const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const paymentRoutes = require("./routes/paymentRoutes");
const storiesRoutes = require("./routes/storiesRoutes");

dotenv.config({
  path: "./config.env",
});

const app = express();
// Middlewares
// Set security HTTP headers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
// Routes
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
  });
});

app.use("/v1/payments", paymentRoutes);
app.use("/v1/stories", storiesRoutes);
// End of Middlewares

module.exports = app;
