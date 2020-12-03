const {navigateTo} = require("./ui-tests-utils.js");

beforeAll(async () => {
    await navigateTo("lists");
})

afterAll(async () => {
    await page.goBack();
})

test("lists", async() => {
    await page.waitForSelector("#example-nav");
});