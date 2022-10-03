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
