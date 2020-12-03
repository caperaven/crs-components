const {navigateTo} = require("./ui-tests-utils.js");

beforeAll(async () => {
    await navigateTo("toolbars");
})

afterAll(async () => {
    await page.goBack();
})

test("standard-toolbar", async() => {
    await page.waitForSelector("#standard-toolbar");
})

test("overflow-toolbar", async() => {
    await page.waitForSelector("overflow-toolbar");
})