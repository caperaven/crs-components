const {navigateTo} = require("./ui-tests-utils.js");

beforeAll(async () => {
    await navigateTo("welcome");
})

afterAll(async () => {
    await page.goBack();
})

test("welcome", async() => {
    await page.waitForSelector("h2");
})