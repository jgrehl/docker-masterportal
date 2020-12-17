const webdriver = require("selenium-webdriver"),
    capabilities = {
        firefox: {"browserName": "firefox", acceptSslCerts: true, acceptInsecureCerts: true},
        chrome: {"browserName": "chrome", version: "80", acceptSslCerts: true, acceptInsecureCerts: true},
        ie: webdriver.Capabilities.ie()
    },
    /** TODO
     * when changing the following values, also change the functions beneath; the values there should eventually
     * be replaced with references to these arrays, but during test writing, cases are oftentimes commented out,
     * effectively changing indices lots of time; do this when all e2e tests have been written
     */
    resolutions = [
        "1920x1080"
        // "600x800"
    ],
    configs = new Map([
        ["basic", "/portal/basic"],
        ["master", "/portal/master"],
        ["custom", "/portal/masterCustom"],
        ["default", "/portal/masterDefault"]
    ]),
    modes = [
        "2D"
        // "3D",
        // "OB"
    ];

/**
 * Returns true for all resolutions marked mobile.
 * @param {String} resolution as WIDTHxHEIGHT
 * @returns {boolean} whether resolution is supposed to model mobile view
 */
function isMobile (resolution) {
    return resolution === "600x800";
}

/**
 * Returns true for 2D mode.
 * @param {String} mode to check
 * @returns {boolean} whether mode is 2D
 */
function is2D (mode) {
    return mode === "2D";
}

/**
 * Returns true for 3D mode.
 * @param {String} mode to check
 * @returns {boolean} whether mode is 3D
 */
function is3D (mode) {
    return mode === "3D";
}

/**
 * Returns true for OB mode.
 * @param {String} mode to check
 * @returns {boolean} whether mode is OB
 */
function isOB (mode) {
    return mode === "OB";
}

/**
 * Returns true for url indicating basic configuration.
 * @param {String} url url in use
 * @returns {boolean} whether configuration is basic
 */
function isBasic (url) {
    return url.split("?")[0].endsWith(configs.get("basic"));
}

/**
 * Returns true for url indicating master configuration.
 * @param {String} url url in use
 * @returns {boolean} whether configuration is basic
 */
function isMaster (url) {
    return url.split("?")[0].endsWith(configs.get("master"));
}

/**
 * Returns true for url indicating default configuration.
 * @param {String} url url in use
 * @returns {boolean} whether configuration is default
 */
function isDefault (url) {
    return url.split("?")[0].endsWith(configs.get("default"));
}

/**
 * Returns true for url indicating custom configuration.
 * @param {String} url url in use
 * @returns {boolean} whether configuration is custom
 */
function isCustom (url) {
    return url.split("?")[0].endsWith(configs.get("custom"));
}

/**
 * Returns true for browsername indicating chrome is running.
 * @param {String} browsername is browsername or contains browsername
 * @returns {boolean} whether running browser is chrome
 */
function isChrome (browsername) {
    return browsername.toLowerCase().includes("chrome");
}

/**
 * Returns true for browsername indicating firefox is running.
 * @param {String} browsername is browsername or contains browsername
 * @returns {boolean} whether running browser is firefox
 */
function isFirefox (browsername) {
    return browsername.toLowerCase().includes("firefox");
}

/**
 * Produces browserstack configurations.
 * @param {String} browserstackuser username
 * @param {String} browserstackkey key
 * @returns {Array} array of bs configuration objects
 */
function getBsCapabilities (browserstackuser, browserstackkey) {
    const base = {
        // do not set selenium version here, then selenium uses the detected_language, see "Input Capabilities" of each test in browserstack
        "acceptSslCerts": true,
        "project": "MasterPortal",
        "browserstack.local": true,
        "browserstack.user": browserstackuser,
        "browserstack.key": browserstackkey,
        // resolution of device, not resolution of browser window
        "resolution": "1920x1080",
        "browserstack.debug": false,
        "browserstack.networkLogs": true,
        "browserstack.console": "verbose",
        "browserstack.idleTimeout": 300,
        // Use this capability to specify a custom delay between the execution of Selenium commands
        "browserstack.autoWait": 50
    };

    return [
        {
            ...base,
            "browserName": "Chrome",
            "browser_version": "83.0",
            "os": "Windows",
            "os_version": "10"
        }/*
        {
            ...base,
            "browserName": "Safari",
            "browser_version": "12.0",
            "os": "OS X",
            "os_version": "Mojave"
        }*/
    ];
}

module.exports = {
    capabilities,
    resolutions,
    configs,
    modes,
    is2D,
    is3D,
    isOB,
    isMobile,
    isChrome,
    isFirefox,
    isBasic,
    isMaster,
    isDefault,
    isCustom,
    getBsCapabilities
};
