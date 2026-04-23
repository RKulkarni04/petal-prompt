const {
    Given,
    When,
    Then,
    Before,
    After,
    setDefaultTimeout
  } = require("@cucumber/cucumber");
  const puppeteer = require("puppeteer");
  const assert = require("assert");
  
  let browser;
  let page;
  
  // Give Cucumber more time for browser launch + LLM response
  setDefaultTimeout(30000);
  
  Before(async () => {
    browser = await puppeteer.launch({
      headless: true
    });
  
    page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
  });
  
  After(async () => {
    if (browser) {
      await browser.close();
    }
  });
  
  Given("I open the application", async () => {
    await page.goto("http://localhost:3000", {
      waitUntil: "domcontentloaded"
    });
  });
  
  Then("I should see the app title", async () => {
    const content = await page.content();
    assert(content.includes("Petal Prompt"));
  });
  
  When("I click the submit button without entering a question", async () => {
    await page.click("#submitBtn");
  });
  
  Then("I should see a validation message", async () => {
    await page.waitForSelector("#statusMessage");
    const message = await page.$eval("#statusMessage", el => el.textContent);
    assert(message.includes("Please enter a question"));
  });
  
  When('I enter {string}', async (question) => {
    await page.type("#questionInput", question);
  });
  
  When("I click the submit button", async () => {
    await page.click("#submitBtn");
  });
  
  Then("I should be taken to the results page", async () => {
    await page.waitForFunction(
      () => window.location.pathname.includes("/results"),
      { timeout: 30000 }
    );
  
    const url = page.url();
    assert(url.includes("/results"));
  });