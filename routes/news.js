const express = require("express");
var router = express.Router();
const puppeteer = require("puppeteer");

// Cultaholic
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

// WrestleTalk
router.get("/get-wrestletalk-news", async (req, res) => {
  let browser = null;
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--single-process", "--no-zygote", "--no-sandbox"],
      devtools: false,
    });
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);
    page.goto("https://wrestletalk.com/news", {
      waitUntil: "domcontentloaded",
    });
    await page.waitForSelector(
      "section.search-block.news-block div.search-result h6 > a"
    );

    console.log("Browser started and navigated");

    const images = await page.evaluate(() => {
      const srcs = Array.from(
        document.querySelectorAll("div.search-result figure > a > img")
      ).map((image) => image.getAttribute("src"));
      return srcs;
    });

    const dates = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll("div.search-result div > p")
      ).map((x) => x.innerText.trim());
    });
    const titleArr = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll(
          "section.search-block.news-block div.search-result h6 > a"
        )
      ).map((x) => x.innerText.trim());
    });
    const postLink = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll(
          "section.search-block.news-block div.search-result h6 > a"
        )
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
        image: images[index],
        source: "wrestletalk.com",
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

//  WWE
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

// AEW
router.get("/get-aew-news", async (req, res) => {
  let browser = null;
  try {
    const browser = await puppeteer.launch({
      headless: true,
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

// NJPW
router.get("/get-njpw-news", async (req, res) => {
  let browser = null;
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--single-process", "--no-zygote", "--no-sandbox"],
      devtools: false,
    });
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);
    page.goto("https://www.njpw1972.com/news", {
      waitUntil: "domcontentloaded",
    });
    await page.waitForSelector("#newsListRow a");

    console.log("Browser started and navigated");

    const images = await page.evaluate(() => {
      const srcs = Array.from(
        document.querySelectorAll("#newsListRow .ph img")
      ).map((image) => image.getAttribute("src"));
      return srcs;
    });

    const dates = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll("#newsListRow .text .date")
      ).map((x) => x.innerText.trim());
    });
    const titleArr = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll(
          "#newsListRow .text .cap.textOverflowEllipsis"
        )
      ).map((x) => x.innerText.trim());
    });
    const postLink = await page.evaluate(() => {
      return Array.from(document.querySelectorAll("#newsListRow a")).map((x) =>
        x.href.trim()
      );
    });
    // const description = await page.evaluate(() => {
    //   return Array.from(
    //     document.querySelectorAll(
    //       ".blog-post-description-style-font.blog-post-post-list-description-style-font > div > div"
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
        image: images[index],
        source: "njpw1972.com",
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

// Ring of honor
router.get("/get-roh-news", async (req, res) => {
  let browser = null;
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--single-process", "--no-zygote", "--no-sandbox"],
      devtools: false,
    });
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);
    page.goto("https://www.rohwrestling.com/news", {
      waitUntil: "domcontentloaded",
    });
    await page.waitForSelector(
      "#block-system-main > div .view-content > .item-list > ul > li.views-row .field-content a"
    );

    console.log("Browser started and navigated");

    const images = await page.evaluate(() => {
      const srcs = Array.from(
        document.querySelectorAll("#block-system-main > div img")
      ).map((image) => image.getAttribute("src"));
      return srcs;
    });

    // const dates = await page.evaluate(() => {
    //   return Array.from(
    //     document.querySelectorAll("#block-system-main > div .date")
    //   ).map((x) => x.innerText.trim());
    // });
    const titleArr = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll(
          "#block-system-main > div > div.view-content > div > ul > li.views-row > div > span > a > div > div:nth-child(2)"
        )
      ).map((x) => x.innerText.trim());
    });
    const postLink = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll(
          "#block-system-main > div .view-content > .item-list > ul > li.views-row .field-content a"
        )
      ).map((x) => x.href.trim());
    });
    const description = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll("#block-system-main > div .int-txt")
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
        date: "",
        image: images[index],
        source: "rohwrestling.com",
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

// AAA
router.get("/get-aaa-news", async (req, res) => {
  let browser = null;
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--single-process", "--no-zygote", "--no-sandbox"],
      devtools: false,
    });
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);
    page.goto("http://www.luchalibreaaa.com/en/hexadrilatero", {
      waitUntil: "domcontentloaded",
    });
    await page.waitForSelector(
      "#hexadrilatero div.article-header div.article-thumb a"
    );

    console.log("Browser started and navigated");

    const images = await page.evaluate(() => {
      const srcs = Array.from(
        document.querySelectorAll(
          "#hexadrilatero div.article-header div.article-thumb img"
        )
      ).map((image) => image.getAttribute("src"));
      return srcs;
    });

    // const dates = await page.evaluate(() => {
    //   return Array.from(
    //     document.querySelectorAll("#block-system-main > div .date")
    //   ).map((x) => x.innerText.trim());
    // });
    const titleArr = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll(
          "#hexadrilatero div.article-title.is-inside.inside--bottom"
        )
      ).map((x) => x.innerText.trim());
    });
    const postLink = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll(
          "#hexadrilatero div.article-header div.article-thumb a"
        )
      ).map((x) => x.href.trim());
    });
    // const description = await page.evaluate(() => {
    //   return Array.from(
    //     document.querySelectorAll("#block-system-main > div .int-txt")
    //   ).map((x) => x.innerText.trim());
    // });
    console.log("scrpae completed");

    await browser.close();

    console.log("browser closed");

    var result = [];
    await titleArr.map((title, index) => {
      result.push({
        title,
        description: "See more",
        postLink: postLink[index],
        date: "",
        image: images[index],
        source: "luchalibreaaa.com",
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

// Impact
router.get("/get-impact-news", async (req, res) => {
  let browser = null;
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--single-process", "--no-zygote", "--no-sandbox"],
      devtools: false,
    });
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);
    page.goto("https://impactwrestling.com/news", {
      waitUntil: "domcontentloaded",
    });
    await page.waitForSelector("article img");

    console.log("Browser started and navigated");

    const images = await page.evaluate(() => {
      const srcs = Array.from(document.querySelectorAll("article img")).map(
        (image) => image.getAttribute("srcset")
      );
      return srcs;
    });

    // const dates = await page.evaluate(() => {
    //   return Array.from(
    //     document.querySelectorAll("#block-system-main > div .date")
    //   ).map((x) => x.innerText.trim());
    // });
    const titleArr = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll("article .elementor-post__title a")
      ).map((x) => x.innerText.trim());
    });
    const postLink = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll("article .elementor-post__title a")
      ).map((x) => x.href.trim());
    });
    const description = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll("article .elementor-post__excerpt p")
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
        date: "",
        image: images[index],
        source: "impactwrestling.com",
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
