const express = require("express");
const app = express();
const cors = require("cors");

// call cors
app.use(cors());

// call routes
const news = require("./routes/news");

app.get("/", (req, res) => {
  res.send("🤼 News API");
});

app.use("/news", news);

app.listen(process.env.PORT || 3001, () => {
  console.log("Started");
});
