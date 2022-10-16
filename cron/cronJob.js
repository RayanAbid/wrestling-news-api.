var cron = require("node-cron");

const puppeteer = require("puppeteer");
const News = require("../models/News");
const {
  fecthwweNews,
  fecthAAANews,
  fecthROHNews,
  fecthCultaholicNews,
  fecthWrestleTalkNews,
  fecthAEWNews,
} = require("../utils/Functions");

module.exports = async () => {
  let browser;

  browser = await puppeteer.launch({
    headless: true,
    args: ["--single-process", "--no-zygote", "--no-sandbox"],
    devtools: false,
  });
  browser.on("disconnected", () => {
    if (browser.process() != null) browser.process().kill("SIGINT");
    //   puppeteerLaunch();
  });

  const mainPage = await browser.newPage();
  await mainPage.setDefaultNavigationTimeout(0);
  mainPage.goto("https://example.com/", {
    waitUntil: "domcontentloaded",
  });

  // AAA
  cron.schedule("0 */8 * * *", async () => {
    await fecthwweNews(browser);
    await fecthAEWNews(browser);
    await fecthCultaholicNews(browser);
    await fecthWrestleTalkNews(browser);
    await fecthNJPWNews(browser);
    await fecthROHNews(browser);
    await fecthAAANews(browser);
  });
};
