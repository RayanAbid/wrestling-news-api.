const express = require("express");
var router = express.Router();
const puppeteer = require("puppeteer");
const News = require("../models/News");

// Add pwinsider
// Add fightful

// Cultaholic

router.get("/get-all-news", async (req, res) => {
  try {
    await News.aggregate([
      {
        $sort: {
          date: -1,
        },
      },
      {
        $group: {
          _id: "$source",
          news: {
            $push: "$$ROOT",
          },
        },
      },
      {
        $project: {
          news: {
            $slice: ["$news", 4],
          },
        },
      },
    ]).exec(async function (err, news) {
      console.log("newsss", news);

      var newsArr = [];

      news.map((item) => {
        newsArr.push(item.news);
        console.log();
      });

      const flat = newsArr.flat();
      await res.send({
        status: "🤼 Success",
        success: true,
        resultLength: flat?.length,
        news: flat,
      });
    });
  } catch (err) {
    res.send({
      status: `🤼 failed ${err}`,
      success: failed,
    });
  }
});

module.exports = router;
