const express = require("express");
const path = require("path");
const app = express();
const cors = require("cors");
require("dotenv").config();

const { mongoose } = require("mongoose");

app.use(express.static("views"));

// cors
app.use(cors());

// call routes
const news = require("./routes/News");
require("./cron/cronJob.js")();

mongoose
  .connect(process.env.MONGO_DB_URL, {
    useNewUrlParser: true,
  })
  .then(() => {
    app.get("/", (req, res, next) => {
      const fileName = "./views/index.html";
      var options = {
        root: path.join(__dirname),
      };
      res.sendFile(fileName, options, function (err) {
        if (err) {
          next(err);
        } else {
          console.log("Sent:", fileName);
          next();
        }
      });
      // res.sendFile("./");
    });

    app.use("/news", news);

    app.listen(process.env.PORT || 3001, () => {
      console.log("Started");
    });
  });
