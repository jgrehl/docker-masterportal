const fs = require("fs-extra"),
    path = require("path"),
    replace = require("replace-in-file"),
    rootPath = path.resolve(__dirname, "../../"),
    PORTALCONFIG = "Portalconfig",
    TOPICS = "Themenconfig",
    BASEMAPS = "Hintergrundkarten",
    SUBJECTDATA = "Fachdaten",
    convertedTools = [],
    convertedMenuEntries = [];

function readMapView(data) {
    console.log("mapView");
    return data[PORTALCONFIG]["mapView"];
}

function convertControls(data) {
    console.log("controls");
    const controls = data[PORTALCONFIG]["controls"];

    controls.expandable={};
    console.info("--- HINT: fill controls into expandable, to expand and collapse controlbar.");
    console.info("--- HINT: use control 'startModule' to start tool by control-icon.");
    return controls;
}

function convertTree(data) {
    console.log("tree");
    const oldTree = data[PORTALCONFIG]["tree"],
        newTree = {};

    if (oldTree.highlightedFeatures) {
        newTree.highlightedFeatures = oldTree.highlightedFeatures;
    }
    newTree.addLayerButton = true;
    newTree.layerPills = {};
    newTree.layerPills.active = true;

    return newTree;
}

function convertFooter(configJS) {
    console.log("portalFooter");
    const newFooter = configJS.footer;

    if (typeof configJS.scaleLine === "boolean") {
        newFooter.scaleLine = configJS.scaleLine;
        delete configJS.scaleLine;
    }
    delete configJS.footer;

    return newFooter;
}


function createMainMenu(data, configJS) {
    console.log("mainMenu");
    const mainMenu = {
        expanded: true,
        sections: [[]]
    };

    addTitle(data, mainMenu);
    addSearchbar(data, mainMenu);
    fillMainSections(data, configJS, mainMenu);

    return mainMenu;
}

function fillMainSections(data, configJS, mainMenu) {
    console.log("   tools");
    const  menu = data[PORTALCONFIG]["menu"],
    tools = menu["tools"]["children"],
    section = mainMenu.sections[0];

    if(tools.print) {
        console.log("       print");
        const print = {...tools.print};

        if(print.name.includes("translate#")) {
            delete print.name;
        }
        print.type = "print";
        section.push(print);
        convertedTools.push("print");
    }
    console.log("       openConfig");
    section.push({
        type: "openConfig",
    });
    if(menu.legend) {
        console.log("       legend");
        section.push({
            type: "legend",
        });
        convertedMenuEntries.push("contact");
    }
    console.log("       shareView");
    section.push({
        type: "shareView",
    });
    if(menu.contact) {
        console.log("       contact");
        const contact = {...menu.contact};

        if(contact.name.includes("translate#")) {
            delete contact.name;
        }
        contact.type = "contact";
        section.push(contact);
        convertedMenuEntries.push("contact");
    }
    console.log("       news");
    section.push({
        type: "news",
    });
    if(configJS.portalLanguage?.enabled){
        console.log("       language");
        section.push({
            type: "language",
        });
    }  
    console.info("--- HINT: add nested folders to menu containing menu entries by using type 'folder'."); 
    console.info("--- HINT: display HTML or excute action or open url by using type 'customMenuElement'."); 
}

function addSearchbar(data, mainMenu) {
    if (data[PORTALCONFIG]["searchBar"]) {
        const oldSearchbar = data[PORTALCONFIG]["searchBar"],
            newSearchbar = {
                searchInterfaces: {}
            };

        Object.entries(oldSearchbar).forEach(([searchName, interface]) => {
            console.log("   searchbar entry " + searchName);
            if (interface.minchars === 3) {
                delete interface.minchars;
            }
            newSearchbar.searchInterfaces[searchName] = interface;
        });
        mainMenu.searchBar = newSearchbar;
    }
    else {
        console.warn("  no 'searchBar' found");
    }
}

function addTitle(data, mainMenu) {
    if (data[PORTALCONFIG]["portalTitle"]) {
        const oldTitle = data[PORTALCONFIG]["portalTitle"],
            oldTitleText = oldTitle.title,
            newTitle = oldTitle;

        newTitle.text = oldTitleText;
        delete newTitle.title;
        mainMenu.title = newTitle;
        console.log("   title");
    }
    else {
        console.warn("  no 'portalTitle' found");
    }
}

function createSecondaryMenu() {
    console.log("secondaryMenu");
    const secondaryMenu = {
        expanded: false,
        sections: [[]]
    }
    return secondaryMenu;
}

function convertTopics(data) {
    console.log(TOPICS);
    const oldTopics = data[TOPICS],
        oldBaseMaps = oldTopics[BASEMAPS],
        oldSubjectData = oldTopics[SUBJECTDATA],
        topics = {};

    topics[BASEMAPS] = convertBaseMaps(oldBaseMaps);
    topics[SUBJECTDATA] = convertSubjectData(oldSubjectData);
    return topics;
}

function convertBaseMaps(oldData) {
    console.log("   " + BASEMAPS);
    const baseMaps = {
        elements: []
    };
    if(oldData.Layer){
        baseMaps.elements = oldData.Layer;
    }

    return baseMaps;
}

function convertSubjectData(oldData) {
    console.log("   " + SUBJECTDATA);
    const subjectData = {
        elements: []
    };

    if(JSON.stringify(oldData).includes("Ordner")) {
        console.warn("Converting folder strucure ist not implemented yet!");
    }
    else if(oldData.Layer){
        subjectData.elements = oldData.Layer;
    }
    return subjectData;
}

function replaceInFile(file){
    replace.sync({
        files: file,
        from: "modules.footer",
        to: "modules.portalFooter"
    });
}



/**
 * start the build process with webpack
 * @param {Object} answers contains the attributes for the portal to be build
 * @returns {void}
 */
function convert(sourcePath = "portal/master_dev", destPath = "portal/master_dev_vue") {
    const
        sourceFolder = path.resolve(rootPath, sourcePath),
        destFolder = path.resolve(rootPath, destPath);

    fs.readdir(sourceFolder)
        .then(files => {
            const configJsonFile = files.find(fileName => fileName === "config.json"),
                configJsFile = files.find(fileName => fileName === "config.js"),
                indexFile = files.find(fileName => fileName === "index.html"),
                srcFile = path.resolve(sourceFolder, configJsonFile),
                destFile = path.resolve(destFolder, configJsonFile),
                configJS = require(path.resolve(sourceFolder, configJsFile));

            console.warn("convert sourceFile ", srcFile, "to destFile ", destFile, "\n");

            fs.copy(path.resolve(sourceFolder, configJsFile), path.resolve(destFolder, configJsFile));
            fs.copy(path.resolve(sourceFolder, indexFile), path.resolve(destFolder, indexFile));

            fs.readFile(srcFile, "utf8")
                .then(data => {
                    // console.warn("data", data);
                    let converted = {};
                    const parsed = JSON.parse(data);

                    converted[PORTALCONFIG] = {};
                    console.log("convert...");
                    converted[PORTALCONFIG].mapView = readMapView(parsed);
                    converted[PORTALCONFIG].portalFooter = convertFooter(configJS);
                    converted[PORTALCONFIG].controls = convertControls(parsed);
                    converted[PORTALCONFIG].tree = convertTree(parsed);
                    converted[PORTALCONFIG].mainMenu = createMainMenu(parsed, configJS);
                    converted[PORTALCONFIG].secondaryMenu = createSecondaryMenu(parsed);
                    converted[TOPICS] = convertTopics(parsed);

                    // console.warn("converted", converted);

                    fs.ensureDir(destPath)
                        .then(() => {
                            fs.writeFile(destFile, JSON.stringify(converted, null, 4), "utf8")
                                .then(() => {
                                    replaceInFile(destFile);
                                    console.warn(destFile + " was saved!");
                                })
                                .catch(err => {
                                    console.error(err)
                                })
                        })
                        .catch(err => {
                            console.error(err)
                        })
                })
                .catch(err => {
                    console.error(err)
                })

        })
        .catch(err => {
            console.error(err)
        })

};

convert();
