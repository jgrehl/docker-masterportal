/**
 * Checks if the module is to be applied in the map- and device mode.
 * @param {String} mapMode The current map mode.
 * @param {String} deviceMode The used device.
 * @param {String} treeType The used type of tree.
 * @param {String[]} [supportedMapModes=["2D", "3D"]] Supported map modes.
 * @param {String[]} [supportedDevices=["Desktop", "Mobile", "Table"]] The supported devices.
 * @param {String[]} [supportedTreeTypes=["light", "auto"]] The supported tree types.
 * @returns {Boolean} The module is shown.
 */
export default function isModuleVisible (
    mapMode, deviceMode, treeType = "light", supportedMapModes = ["2D", "3D"],
    supportedDevices = ["Desktop", "Mobile", "Table"], supportedTreeTypes = ["light", "auto"]
) {
    let isVisible = false;

    if (supportedMapModes?.includes(mapMode)
         && supportedDevices.map(device => device.toUpperCase()).includes(deviceMode.toUpperCase())
         && supportedTreeTypes.includes(treeType)
    ) {
        isVisible = true;
    }

    return isVisible;
}
