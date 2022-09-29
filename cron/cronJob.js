var cron = require("node-cron");

const puppeteer = require("puppeteer");
const News = require("../models/News");

module.exports = async () => {
  let browser;

  browser = await puppeteer.launch({
    headless: false,
    args: ["--single-process", "--no-zygote", "--no-sandbox"],
    devtools: false,
  });
  browser.on("disconnected", () => {
    if (browser.process() != null) browser.process().kill("SIGINT");
    puppeteerLaunch();
  });

  const mainPage = await browser.newPage();
  await mainPage.setDefaultNavigationTimeout(0);
  mainPage.goto("https://example.com/", {
    waitUntil: "domcontentloaded",
  });

  // AAA
  cron.schedule("* * * * *", async () => {
    console.log("fetching luchalibre from source");
    try {
      // const browser = await puppeteer.launch({
      //   headless: true,
      //   args: ["--single-process", "--no-zygote", "--no-sandbox"],
      //   devtools: false,
      // });
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

      console.log("scrpae completed");

      await page.close();

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

      try {
        await News.insertMany(result, { ordered: false, silent: true });
      } catch (err) {
        console.error("Now new news found from this source");
      }
    } catch (err) {
      console.error("Something went wrong", err);
    }
  });

  // ring of honor
  cron.schedule("* * * * *", async () => {
    console.log("fetching ROH from source");

    try {
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

      await page.close();

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

      try {
        await News.insertMany(result, { ordered: false, silent: true });
      } catch (err) {
        console.error("No news found from this source");
      }
    } catch (err) {
      console.error("Something went wrong", err);
    }
  });

  // impact
  cron.schedule("* * * * *", async () => {
    try {
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

      try {
        await News.insertMany(result, { ordered: false, silent: true });
      } catch (err) {
        console.error("No news found from this source");
      }
    } catch (err) {
      console.error("Something went wrong", err);
    }
  });
};
