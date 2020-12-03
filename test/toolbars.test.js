const {navigateTo, focus, childHasFocus} = require("./ui-tests-utils.js");

beforeAll(async () => {
    await navigateTo("toolbars");
})

afterAll(async () => {
    await page.goBack();
})

async function checkKeyboardNavigation(query) {
    await page.waitForSelector(query);
    await focus(query);

    expect(await childHasFocus(query, 0)).toBeTruthy();
    expect(await childHasFocus(query, 1)).toBeFalsy();
    expect(await childHasFocus(query, 2)).toBeFalsy();
    expect(await childHasFocus(query, 3)).toBeFalsy();
    expect(await childHasFocus(query, 4)).toBeFalsy();
    expect(await childHasFocus(query, 5)).toBeFalsy();

    await page.keyboard.press('ArrowRight');

    expect(await childHasFocus(query, 0)).toBeFalsy();
    expect(await childHasFocus(query, 1)).toBeTruthy();
    expect(await childHasFocus(query, 2)).toBeFalsy();
    expect(await childHasFocus(query, 3)).toBeFalsy();
    expect(await childHasFocus(query, 4)).toBeFalsy();
    expect(await childHasFocus(query, 5)).toBeFalsy();

    await page.keyboard.press('ArrowLeft');

    expect(await childHasFocus(query, 0)).toBeTruthy();
    expect(await childHasFocus(query, 1)).toBeFalsy();
    expect(await childHasFocus(query, 2)).toBeFalsy();
    expect(await childHasFocus(query, 3)).toBeFalsy();
    expect(await childHasFocus(query, 4)).toBeFalsy();
    expect(await childHasFocus(query, 5)).toBeFalsy();

    await page.keyboard.press('End');

    expect(await childHasFocus(query, 0)).toBeFalsy();
    expect(await childHasFocus(query, 1)).toBeFalsy();
    expect(await childHasFocus(query, 2)).toBeFalsy();
    expect(await childHasFocus(query, 3)).toBeFalsy();
    expect(await childHasFocus(query, 4)).toBeFalsy();
    expect(await childHasFocus(query, 5)).toBeTruthy();

    await page.keyboard.press('Home');

    expect(await childHasFocus(query, 0)).toBeTruthy();
    expect(await childHasFocus(query, 1)).toBeFalsy();
    expect(await childHasFocus(query, 2)).toBeFalsy();
    expect(await childHasFocus(query, 3)).toBeFalsy();
    expect(await childHasFocus(query, 4)).toBeFalsy();
    expect(await childHasFocus(query, 5)).toBeFalsy();
}

test("standard-toolbar", async() => {
    await checkKeyboardNavigation("#standard-toolbar")
})

test("overflow-toolbar", async() => {
    await checkKeyboardNavigation("#overflow-toolbar-long")
})