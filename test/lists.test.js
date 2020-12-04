const {navigateTo, checkKeyboardNavigation} = require("./ui-tests-utils.js");

beforeAll(async () => {
    await navigateTo("lists");
})

afterAll(async () => {
    await page.goBack();
})

test("lists", async() => {
    await checkKeyboardNavigation("#example-nav-list");
    await checkKeyboardNavigation("#unordered-list");
    await checkKeyboardNavigation("#ordered-list");
});