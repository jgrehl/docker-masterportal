const {PORTALCONFIG} = require("./constants");


module.exports = function createSecondaryMenu (data, convertedTools, convertedMenuEntries) {
    console.log("secondaryMenu");
    const secondaryMenu = {
        expanded: false,
        sections: [[]]
    };

    fillSections(data, secondaryMenu, convertedTools, convertedMenuEntries);
    return secondaryMenu;
};

function fillSections (data, secondaryMenu, convertedTools, convertedMenuEntries) {
    console.log("   tools");
    const menu = data[PORTALCONFIG].menu,
        tools = menu.tools.children,
        section = secondaryMenu.sections[0];

    if (menu.filter) {
        console.log("       filter");
        const filter = {...menu.filter};

        filter.type = "filter";
        section.push(filter);
        convertedMenuEntries.push("filter");
    }


    Object.entries(tools).forEach(([toolName, toolConfig]) => {
        if (!convertedTools.includes(toolName)) {
            console.log("       " + toolName);
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
            convertedTools.push(toolName);
        }
    });
}

