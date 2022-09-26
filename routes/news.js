const express = require("express");
var router = express.Router();
const puppeteer = require("puppeteer");

router.get("/get-cultaholic-news", async (req, res) => {
  let browser = null;
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--single-process", "--no-zygote", "--no-sandbox"],
      devtools: false,
    });
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);
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

router.get("/get-wwe-news", async (req, res) => {
  let browser = null;
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--single-process", "--no-zygote", "--no-sandbox"],
      devtools: false,
    });
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);
    page.goto("https://www.wwe.com/news", {
      waitUntil: "domcontentloaded",
    });
    await page.waitForSelector("div.card-copy > h2 > a > span");

    console.log("Browser started and navigated");

    const images = await page.evaluate(() => {
      const srcs = Array.from(
        document.querySelectorAll("div.card-image-area > div > a > div > img")
      ).map((image) => image.getAttribute("src"));
      return srcs;
    });

    const dates = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll("div.card-copy > div > time")
      ).map((x) => x.innerText.trim());
    });
    const titleArr = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll("div.card-copy > h2 > a > span")
      ).map((x) => x.innerText.trim());
    });
    const postLink = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll("div.card-copy > h2 > a")
      ).map((x) => x.href.trim());
    });
    // const description = await page.evaluate(() => {
    //   return Array.from(
    //     document.querySelectorAll(
    //       ".media-body.p-mb-none-child.media-margin30 p"
    //     )
    //   ).map((x) => x.innerText.trim());
    // });
    console.log("scrpae completed");

    await browser.close();

    console.log("browser closed");

    var result = [];
    await titleArr.map((title, index) => {
      result.push({
        title,
        description: "Read more...",
        postLink: postLink[index],
        date: dates[index],
        image: "https://www.wwe.com/" + images[index],
        source: "wwe.com",
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

router.get("/get-wwe-news", async (req, res) => {
  let browser = null;
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--single-process", "--no-zygote", "--no-sandbox"],
      devtools: false,
    });
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);
    page.goto("https://www.wwe.com/news", {
      waitUntil: "domcontentloaded",
    });
    await page.waitForSelector("div.card-copy > h2 > a > span");

    console.log("Browser started and navigated");

    const images = await page.evaluate(() => {
      const srcs = Array.from(
        document.querySelectorAll("div.card-image-area > div > a > div > img")
      ).map((image) => image.getAttribute("src"));
      return srcs;
    });

    const dates = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll("div.card-copy > div > time")
      ).map((x) => x.innerText.trim());
    });
    const titleArr = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll("div.card-copy > h2 > a > span")
      ).map((x) => x.innerText.trim());
    });
    const postLink = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll("div.card-copy > h2 > a")
      ).map((x) => x.href.trim());
    });

    console.log("scrpae completed");

    await browser.close();

    console.log("browser closed");

    var result = [];
    await titleArr.map((title, index) => {
      result.push({
        title,
        description: "Read more...",
        postLink: postLink[index],
        date: dates[index],
        image: "https://www.wwe.com/" + images[index],
        source: "wwe.com",
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

router.get("/get-aew-news", async (req, res) => {
  let browser = null;
  try {
    const browser = await puppeteer.launch({
      headless: false,
      args: ["--single-process", "--no-zygote", "--no-sandbox"],
      devtools: false,
    });
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);
    page.goto("https://www.allelitewrestling.com/aew-news", {
      waitUntil: "domcontentloaded",
    });
    await page.waitForSelector(
      ".blog-post-post-list-link-hashtag-hover-color > a"
    );

    console.log("Browser started and navigated");

    const images = await page.evaluate(() => {
      const srcs = Array.from(
        document.querySelectorAll(
          ".gallery-item-visible.gallery-item.gallery-item-preloaded img"
        )
      ).map((image) => image.getAttribute("src"));
      return srcs;
    });

    const dates = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll(".post-metadata__date.time-ago")
      ).map((x) => x.innerText.trim());
    });
    const titleArr = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll(
          ".post-title.blog-hover-container-element-color.blog-post-post-list-title-color.blog-post-post-list-title-font"
        )
      ).map((x) => x.innerText.trim());
    });
    const postLink = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll(
          ".blog-post-post-list-link-hashtag-hover-color > a"
        )
      ).map((x) => x.href.trim());
    });
    const description = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll(
          ".blog-post-description-style-font.blog-post-post-list-description-style-font > div > div"
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
        source: "allelitewrestling.com",
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

module.exports = router;
