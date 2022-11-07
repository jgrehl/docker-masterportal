/**
 * Checks if the module is to be applied in the map- and device mode.
 * @param {String} mapMode The current map mode.
 * @param {String} deviceMode The used device.
 * @param {String[]} [supportedMapModes=["2D", "3D"]] Supported map modes.
 * @param {String[]} [supportedDevices=["Desktop", "Mobile", "Table"]] The supported devices.
 * @returns {Boolean} The module is shown.
 */
export default function isModuleVisible (mapMode, deviceMode, supportedMapModes = ["2D", "3D"], supportedDevices = ["Desktop", "Mobile", "Table"]) {
    let isVisible = false;

    if (supportedMapModes?.includes(mapMode)
         && supportedDevices.map(device => device.toUpperCase()).includes(deviceMode.toUpperCase())
    ) {
        isVisible = true;
    }

    return isVisible;
}
