const express = require("express");
const app = express();
const cors = require("cors");
const puppeteer = require("puppeteer");

app.use(cors());

app.get("/", (req, res) => {
  res.send("🤼 News API");
});

app.get("/get-news", async (req, res) => {
  let browser = null;
  try {
    const browser = await puppeteer.launch({
      headless: false,
      args: ["--single-process", "--no-zygote", "--no-sandbox"],
      devtools: false,
    });
    const page = await browser.newPage();
    //   await page.setDefaultNavigationTimeout(0);
    page.goto("https://cultaholic.com/posts/categories/news", {
      waitUntil: "domcontentloaded",
    });
    await page.waitForSelector(
      "div.position-relative.width-40 > a > picture > source:nth-child(2)"
    );

    console.log("Browser started and navigated");

    const images = await page.evaluate(() => {
      const srcs = Array.from(
        document.querySelectorAll(
          "div.position-relative.width-40 > a > picture > source:nth-child(2)"
        )
      ).map((image) => image.getAttribute("srcset"));
      return srcs;
    });

    const dates = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll(
          "article > div.media-body.p-mb-none-child.media-margin30 > div > ul > li:nth-child(2)"
        )
      ).map((x) => x.innerText.trim());
    });
    const titleArr = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll(".title-semibold-dark.size-lg.mb-15 a")
      ).map((x) => x.innerText.trim());
    });
    const postLink = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll(".title-semibold-dark.size-lg.mb-15 a")
      ).map((x) => x.href.trim());
    });
    const description = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll(
          ".media-body.p-mb-none-child.media-margin30 p"
        )
      ).map((x) => x.innerText.trim());
    });
    console.log("scrpae completed");

    await browser.close();
    console.log("browser closed");

    var result = [];
    await titleArr.map((title, index) => {
      result.push({
        title,
        description: description[index],
        postLink: postLink[index],
        date: dates[index],
        image: images[index],
        source: "cultaholic.com",
      });
    });

    res.send({
      status: "🤼 Success",
      success: true,
      resultLength: result?.length,
      result,
    });
  } catch (err) {
    res.send({
      status: "🤼 Failed",
      success: false,
      resultLength: 0,
      result: [],
    });
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
});

app.listen(process.env.PORT || 3001, () => {
  console.log("Started");
});
