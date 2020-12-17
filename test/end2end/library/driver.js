const {until, By} = require("selenium-webdriver"),
    {getResolution} = require("./scripts"),
    {isBasic, isMaster, isCustom, isDefault} = require("../settings");

/**
 * Activates 3D mode for opened Masterportal.
 * This is prepared here to rerun universally applicable tests
 * in multiple modes. Turning the 3D mode on/off and other
 * mode-specific tests are done from 2D mode in separate files.
 * @param {selenium.webdriver.Driver} driver to manipulate
 * @returns {void}
 */
async function prepare3D (driver) {
    await driver.wait(until.elementLocated(By.css("#button3D")));
    await (await driver.findElement(By.css("#button3D"))).click();
    await driver.wait(until.elementLocated(By.css("#orientation3d")));
}

/**
 * Activates OB mode for opened Masterportal.
 * This is prepared here to rerun universally applicable tests
 * in multiple modes. Turning the OB mode on/off and other
 * mode-specific tests are done from 2D mode in separate files.
 * @param {selenium.webdriver.Driver} driver to manipulate
 * @returns {void}
 */
async function prepareOB (driver) {
    await driver.wait(until.elementLocated(By.css("#buttonOblique")));
    await (await driver.findElement(By.css("#buttonOblique"))).click();
    // downloads >42MB before setting compass, give it some time
    await driver.wait(until.elementLocated(By.css("#orientation3d .control-box-container.oblique #zoom-in")), 120000);
}

/**
 * Loads url and waits until loading overlays are hidden and backbone is initialized.
 * Will also prepare mode.
 * @param {selenium-webdriver.driver} driver driver object
 * @param {String} url url to load
 * @param {String} mode additional instance preparation before tests can be executed
 * @returns {void}
 */
async function loadUrl (driver, url, mode) {
    await driver.get(url);

    if (isBasic(url) || isMaster(url)) {
        await driver.wait(until.elementLocated(By.id("loader")), 90000);
        if (isBasic(url)) {
            await driver.wait(until.elementIsNotVisible(await driver.findElement(By.id("loader"))));
            await driver.wait(until.elementLocated(By.css(".loading")), 90000);
            await driver.wait(until.elementIsNotVisible(await driver.findElement(By.css(".loading"))));
        }
        if (isMaster(url)) {
            // wait for logo to disappear (only appears in master)
            await driver.wait(until.elementIsNotVisible(await driver.findElement(By.id("portal-logo"))));
        }
    }

    if (isCustom(url) || isDefault(url)) {
        const loading = await driver.wait(until.elementLocated(By.className("loading")), 90000);

        await driver.wait(until.elementIsNotVisible(loading), 90000);
    }

    // wait until resolution is ready, else Firefox will often find uninitialized Backbone initially
    await driver.wait(async () => await driver.executeScript(getResolution) !== null);

    // prepare 3D resp. OB mode for tests - 2D mode is initial mode, nothing to do
    if (mode === "3D") {
        await prepare3D(driver);
    }
    else if (mode === "OB") {
        await prepareOB(driver);
    }
}

/**
 * Builds the driver and sets its resolution.
 * @param {selenium-webdriver.Builder} builder builder for current driver
 * @param {String} resolution formatted as "AxB" with A, B integers
 * @returns {selenium.webdriver.Driver} driver instance
 */
async function getUnnavigatedDriver (builder, resolution) {
    const driver = await builder.build(),
        widthHeight = resolution.split("x").map(x => parseInt(x, 10));

    await driver.manage().window().setRect({width: widthHeight[0], height: widthHeight[1]});
    await driver.manage().setTimeouts(
        {
            implicit: 5000,
            pageLoad: 60000,
            script: 30000
        }
    );

    return driver;
}

/**
 * Prepares the driver for testing; build, set resolution, activate mode, get url.
 * @param {selenium-webdriver.Builder} builder builder for current driver
 * @param {String} url to get
 * @param {String} resolution formatted as "AxB" with A, B integers
 * @param {String} mode additional instance preparation before tests can be executed
 * @returns {selenium.webdriver.Driver} driver instance
 */
async function initDriver (builder, url, resolution, mode) {
    const driver = await getUnnavigatedDriver(builder, resolution);

    await loadUrl(driver, url, mode);

    return driver;
}

module.exports = {
    getUnnavigatedDriver,
    initDriver,
    loadUrl
};
