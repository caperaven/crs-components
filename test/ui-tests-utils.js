const pti = require('puppeteer-to-istanbul');
const puppeteer = require('puppeteer');

globalThis.browser = null;
globalThis.page = null;

beforeAll(async () => {
    jest.setTimeout(100000);
    globalThis.browser = await puppeteer.launch({headless: false, slowMo: 10, args: ['--disable-dev-shm-usage', '--start-maximized']});
    globalThis.page = await browser.newPage();

    await globalThis.page.setViewport({
        width: 1366,
        height: 1366,
    });

    await Promise.all([
        globalThis.page.coverage.startJSCoverage(),
        globalThis.page.coverage.startCSSCoverage()
    ]);

    await globalThis.page.goto('http://127.0.0.1:8000/#welcome', {waitUntil: 'networkidle2'});
});

afterAll(async () => {
    const [jsCoverage, cssCoverage] = await Promise.all([
        globalThis.page.coverage.stopJSCoverage(),
        globalThis.page.coverage.stopCSSCoverage(),
    ]);
    pti.write([...jsCoverage, ...cssCoverage], { includeHostname: true , storagePath: './.nyc_output' });
    await globalThis.page.close();
    await globalThis.browser.close();
});

async function navigateTo(hash) {
    return Promise.all([
        await globalThis.page.goto(`http://127.0.0.1:8000/#${hash}`, {waitUntil: 'networkidle2'})
    ]).catch(e => console.log(e));
}

async function focus(query) {
    await page.click(query);
}

async function childHasFocus(query, childIndex) {
    return await page.evaluate((query, childIndex) => {
        return document.querySelector(query).children[childIndex].getAttribute("tabindex") === "0";
    }, query, childIndex);
}

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

module.exports = {
    navigateTo: navigateTo,
    focus: focus,
    childHasFocus: childHasFocus,
    checkKeyboardNavigation: checkKeyboardNavigation
}