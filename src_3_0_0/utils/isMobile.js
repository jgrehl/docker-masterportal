/**
 * Checks if the current window size indicates a mobile device.
 * @returns {Boolean} True if screen is considered mobile device.
 */
function isMobile () {
    return window.innerWidth < 768;
}

export default isMobile;
