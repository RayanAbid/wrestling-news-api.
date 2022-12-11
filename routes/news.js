const express = require("express");
var router = express.Router();
const News = require("../models/News");

// Add pwinsider
// Add fightful

// Cultaholic

router.get("/get-all-news", async (req, res) => {
  try {
    await News.aggregate([
      {
        $sort: {
          createdAt: -1,
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
            $slice: ["$news", 5],
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

router.get("/get-today-headlines", async (req, res) => {
  try {
    await News.aggregate([
      {
        $sort: {
          createdAt: -1,
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
            $slice: ["$news", 5],
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

router.get("/del-src", async (req, res) => {
  try {
    // Deleting all users whose age >= 15
    News.deleteMany({ source: "wwe.com" })
      .then(function () {
        console.log("Data deleted"); // Success
      })
      .catch(function (error) {
        console.log(error); // Failure
      });
    await res.send({
      status: "🤼 delete Success",
      success: true,
    });
  } catch (err) {
    res.send({
      status: `🤼 failed ${err}`,
      success: failed,
    });
  }
});

router.post("/like-post/:id", async (req, res) => {
  const { userId } = req.body;
  const news = await News.countDocuments({
    _id: req.params.id,
    likes: { $in: userId },
  });

  console.log("testing the news", news);

  if (news > 0) {
    News.findOneAndUpdate(
      { _id: req.params.id },
      {
        $pull: { likes: userId },
      },
      { new: true },
      function (err, docs) {
        if (err) {
          res.status(406).json({
            success: false,
            message: err,
          });
        } else {
          res.status(201).json({
            success: true,
            data: docs,
            message: "post liked",
          });
        }
      }
    );
  } else {
    News.findOneAndUpdate(
      { _id: req.params.id },
      {
        $push: { likes: userId },
        $pull: { dislikes: userId },
      },
      { new: true },
      function (err, docs) {
        if (err) {
          res.status(406).json({
            success: false,
            message: err,
          });
        } else {
          res.status(201).json({
            success: true,
            data: docs,
            message: "Like removed",
          });
        }
      }
    );
  }
});

router.post("/dislike-post/:id", async (req, res) => {
  const { userId } = req.body;
  const news = await News.countDocuments({
    _id: req.params.id,
    dislikes: { $in: userId },
  });

  console.log("testing the news", news);

  if (news > 0) {
    News.findOneAndUpdate(
      { _id: req.params.id },
      {
        $pull: { dislikes: userId },
      },
      { new: true },
      function (err, docs) {
        if (err) {
          res.status(406).json({
            success: false,
            message: err,
          });
        } else {
          res.status(201).json({
            success: true,
            data: docs,
            message: "post liked",
          });
        }
      }
    );
  } else {
    News.findOneAndUpdate(
      { _id: req.params.id },
      {
        $push: { dislikes: userId },
        $pull: { likes: userId },
      },
      { new: true },
      function (err, docs) {
        if (err) {
          res.status(406).json({
            success: false,
            message: err,
          });
        } else {
          res.status(201).json({
            success: true,
            data: docs,
            message: "Like removed",
          });
        }
      }
    );
  }
});

module.exports = router;
