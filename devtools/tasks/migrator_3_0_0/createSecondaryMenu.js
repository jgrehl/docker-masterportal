/* eslint-disable no-console */
const {PORTALCONFIG} = require("./constants");

module.exports = function createSecondaryMenu (data, migratedTools) {
    console.info("secondaryMenu");
    const secondaryMenu = {
        expanded: false,
        sections: [[]]
    };

    fillSections(data, secondaryMenu, migratedTools);
    return secondaryMenu;
};

/**
 * Fills the menu sections of secondary menu with tools contained in v2 config.json.
 * @param {Object} data parsed config.json content
 * @param {Object} secondaryMenu v3 secondary menu object
 * @param {Array} migratedTools already migrated v2 tools
 * @returns {void}
 */
function fillSections (data, secondaryMenu, migratedTools) {
    console.info("   tools");
    const menu = data[PORTALCONFIG].menu,
        tools = menu.tools?.children,
        section = secondaryMenu.sections[0];

    if (tools) {
        Object.entries(tools).forEach(([toolName, toolConfig]) => {
            if (!migratedTools.includes(toolName)) {
                console.info("       " + toolName);
                const tool = {...toolConfig};

                tool.type = toolName;
                if (tool.name?.includes("translate#")) {
                    delete tool.name;
                }
                delete tool.icon;
                delete tool.renderToWindow;
                delete tool.active;
                delete tool.isVisibleInMenu;
                section.push(tool);
                migratedTools.push(toolName);
            }
        });
    }
}

