const express = require("express");
const path = require("path");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
const useragent = require("express-useragent");
require("dotenv").config();

const { mongoose } = require("mongoose");

app.use(express.static("views"));

// cors
app.use(cors());

// call routes
const news = require("./routes/news.js");
const user = require("./routes/user");
require("./cron/cronJob.js")();

mongoose
  .connect(process.env.MONGO_DB_URL, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("DataBase connected");

    app.use(cors());
    app.use(helmet());
    app.use(express.json({ limit: "20mb" }));
    app.use(express.urlencoded({ limit: "20mb", extended: true }));
    app.use(useragent.express());

    app.get("/", (req, res, next) => {
      res.send("Welcome to wrestle break 🤼");
    });

    app.use("/news", news);
    app.use("/user", user);

    app.listen(process.env.PORT || 3001, () => {
      console.log("Started on Port: " + process.env.PORT || 3001);
    });
  });
