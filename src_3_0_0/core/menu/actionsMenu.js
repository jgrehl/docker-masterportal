/**
 * determines if not found node key are identifiable by a defined property map
 * @param {Object} getters to retrieve stored values
 * @param {Object} nodeObject node object to test if property exists
 * @returns {Object|null} the found component or null
 */
function findComponentByProperty (getters, nodeObject) {
    return Object.entries(getters.identifyComponentByProperty)
        .reduce((found, [propertyKey, value]) => {
            if (found) {
                return getters.identifyComponentByProperty[found];
            }
            return Object.hasOwnProperty.call(nodeObject, propertyKey) ? value : null;
        }, null);
}

/**
 * recursively builds the menu matrix with child elements
 * @param {Object} getters to retrieve stored values
 * @param {Object} node current node to work on
 * @returns {Array} Array of menu objects with children
 */
function buildMenuMatrix (getters, node) {
    const menuMatrix = [];

    Object
        .keys(node)
        .forEach(nodeKey => {
            const nodeObject = node[nodeKey];

            if (typeof nodeObject === "object" && nodeObject.name) {
                const menuItem = {
                    props: nodeObject,
                    nodeKey
                };

                menuItem.component = getters.componentMap[nodeKey]
                    || findComponentByProperty(getters, nodeObject);

                if (menuItem.component) {
                    if (nodeObject.children && typeof nodeObject.children === "object") {
                        menuItem.props.children = buildMenuMatrix(getters, nodeObject.children);
                    }

                    menuMatrix.push(menuItem);
                }
            }
        });

    return menuMatrix;
}

export default {
    loadMenuItems ({commit, getters}) {
        commit("setMenuItems", buildMenuMatrix(getters, getters.configuration));
    }
};
