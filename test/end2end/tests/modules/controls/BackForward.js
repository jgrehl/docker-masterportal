const webdriver = require("selenium-webdriver"),
    {expect} = require("chai"),
    {getCenter} = require("../../../library/scripts"),
    {onMoveEnd} = require("../../../library/scriptsAsync"),
    {initDriver} = require("../../../library/driver"),
    {isCustom, isMaster, isMobile, isChrome} = require("../../../settings"),
    {until, By} = webdriver;

/**
 * @param {e2eTestParams} params parameter set
 * @returns {void}
 */
function BackForwardTests ({builder, url, resolution, browsername}) {
    const testIsApplicable = !isMobile(resolution) && // buttons not visible mobile
        (isCustom(url) || isMaster(url)); // backForward active in these

    if (testIsApplicable) {
        describe("Modules Controls BackForward", function () {
            let driver, forwardButton, backwardButton;

            before(async function () {
                driver = await initDriver(builder, url, resolution);
            });

            after(async function () {
                await driver.quit();
            });

            it("should provide the forward and backward button", async function () {
                await driver.wait(until.elementLocated(By.css(".backForwardButtons .forward")), 50000);
                forwardButton = driver.findElement(By.css(".backForwardButtons .forward"));
                backwardButton = driver.findElement(By.css(".backForwardButtons .backward"));

                expect(forwardButton).to.exist;
                expect(backwardButton).to.exist;
            });

            // canvas panning is currently broken in Chrome, see https://github.com/SeleniumHQ/selenium/issues/6332
            // feature broken in master: buttons can not be clicked since obscured by other elements
            (isChrome(browsername) || isMaster(url) ? it.skip : it)("should move forwards/backwards after panning on button click", async function () {
                const viewport = await driver.findElement(By.css(".ol-viewport")),
                    positions = [];

                /**
                 * Encapsulate all steps necessary for panning.
                 * @returns {void}
                 */
                async function pan () {
                    await driver.actions({bridge: true})
                        .dragAndDrop(viewport, {x: 10, y: 10})
                        .perform();

                    await driver.executeAsyncScript(onMoveEnd);

                    positions.push(await driver.executeScript(getCenter));
                }

                positions.push(await driver.executeScript(getCenter));
                await pan();
                await pan();
                await pan();

                expect(positions[0]).not.to.eql(positions[1]);
                expect(positions[1]).not.to.eql(positions[2]);
                expect(positions[2]).not.to.eql(positions[3]);
                expect(positions[3]).to.eql(await driver.executeScript(getCenter));

                // wait for information to trickle through to back button functionality ...
                await new Promise(resolve => setTimeout(resolve, 100));

                // move backwards
                await backwardButton.click();
                expect(positions[2]).to.eql(await driver.executeScript(getCenter));
                await backwardButton.click();
                expect(positions[1]).to.eql(await driver.executeScript(getCenter));
                await backwardButton.click();
                expect(positions[0]).to.eql(await driver.executeScript(getCenter));

                // move forwards
                await forwardButton.click();
                expect(positions[1]).to.eql(await driver.executeScript(getCenter));
                await forwardButton.click();
                expect(positions[2]).to.eql(await driver.executeScript(getCenter));
                await forwardButton.click();
                expect(positions[3]).to.eql(await driver.executeScript(getCenter));
            });
        });
    }
}

module.exports = BackForwardTests;
