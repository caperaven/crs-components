const {navigateTo, checkKeyboardNavigation} = require("./ui-tests-utils.js");

beforeAll(async () => {
    await navigateTo("toolbars");
})

afterAll(async () => {
    await page.goBack();
})

test("standard-toolbar", async() => {
    await checkKeyboardNavigation("#standard-toolbar")
})

test("overflow-toolbar", async() => {
    await checkKeyboardNavigation("#overflow-toolbar-long")
})