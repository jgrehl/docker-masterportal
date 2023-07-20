const fs = require("fs-extra"),
    path = require("path"),
    replace = require("replace-in-file"),
    createMainMenu = require("./createMainMenu"),
    createSecondaryMenu = require("./createSecondaryMenu"),
    {PORTALCONFIG, TOPICS, BASEMAPS, SUBJECTDATA} = require("./constants"),
    rootPath = path.resolve(__dirname, "../../../"),
    deprecated = ["searchByCoord", "supplyCoord", "parcelSearch", "extendedFilter"],
    notToConvert = ["gfi", "compareFeatures", "saveSelection"],
    convertedTools = notToConvert.concat(deprecated),
    convertedMenuEntries = [];

function readMapView (data) {
    console.log("mapView");
    return data[PORTALCONFIG].mapView;
}

function convertControls (data) {
    console.log("controls");
    const controls = data[PORTALCONFIG].controls;

    controls.expandable = {};
    console.info("--- HINT: fill controls into expandable, to expand and collapse controlbar.");
    console.info("--- HINT: use control 'startModule' to start tool by control-icon.");
    return controls;
}

function convertTree (data, configJS) {
    console.log("tree");
    const oldTree = data[PORTALCONFIG].tree,
        newTree = {};

    if (oldTree?.highlightedFeatures) {
        newTree.highlightedFeatures = oldTree.highlightedFeatures;
    }
    newTree.addLayerButton = true;
    newTree.layerPills = {};
    newTree.layerPills.active = true;

    if (data[PORTALCONFIG].treeType === "default") {
        if (configJS.tree) {
            newTree.layerIDsToIgnore = [...configJS.tree.layerIDsToIgnore];
            newTree.layerIDsToStyle = [...configJS.tree.layerIDsToStyle];
            newTree.metaIDsToMerge = [...configJS.tree.metaIDsToMerge];
            newTree.metaIDsToIgnore = [...configJS.tree.metaIDsToIgnore];
        }
        newTree.type = "auto";
        newTree.validLayerTypesAutoTree = [
            "WMS",
            "SENSORTHINGS",
            "TERRAIN3D",
            "TILESET3D",
            "OBLIQUE"
        ];
        newTree.categories = [
            {
                "key": "kategorie_opendata",
                "name": "common:modules.layerTree.categoryOpendata",
                "active": true
            },
            {
                "key": "kategorie_inspire",
                "name": "common:modules.layerTree.categoryInspire"
            },
            {
                "key": "kategorie_organisation",
                "name": "common:modules.layerTree.categoryOrganisation"
            }
        ];

    }

    return newTree;
}

function convertFooter (configJS) {
    let newFooter = {};

    if (configJS.footer) {
        console.log("portalFooter");
        newFooter = configJS.footer;

        if (typeof configJS.scaleLine === "boolean") {
            newFooter.scaleLine = configJS.scaleLine;
        }
        delete newFooter.showVersion;
    }
    return newFooter;
}


function convertTopics (data) {
    console.log(TOPICS);
    const oldTopics = data[TOPICS],
        oldBaseMaps = oldTopics[BASEMAPS],
        oldSubjectData = oldTopics[SUBJECTDATA],
        topics = {};

    topics[BASEMAPS] = convertBaseMaps(oldBaseMaps);
    topics[SUBJECTDATA] = convertSubjectData(oldSubjectData);
    return topics;
}

function convertBaseMaps (oldData) {
    console.log("   " + BASEMAPS);
    const baseMaps = {
        elements: []
    };

    if (oldData.Layer) {
        baseMaps.elements = oldData.Layer;
    }

    return baseMaps;
}

function convertSubjectData (oldData) {
    console.log("   " + SUBJECTDATA);
    const subjectData = {
        elements: []
    };

    if (oldData && JSON.stringify(oldData).includes("Ordner")) {
        console.warn("Converting folder strucure ist not implemented yet!");
    }
    else if (oldData?.Layer) {
        subjectData.elements = oldData.Layer;
    }
    return subjectData;
}

function convertIndexHtml (sourceFolder, destFolder, indexFile) {
    fs.readFile(path.resolve(sourceFolder, indexFile), "utf8")
        .then(data => {
            const regex = /<div id="loader" [\s\S]*loaders.js"><\/script>/g,
                result = data.replace(regex, "");

            fs.writeFile(path.resolve(destFolder, indexFile), result, "utf8");
        })
        .catch(err => {
            console.error("write index.html", err);
        });
}

function checkConfigJS (sourceFolder, configJsFile) {
    if (Object.keys(require(path.resolve(sourceFolder, configJsFile))).length === 0) {
        fs.readFile(path.resolve(sourceFolder, configJsFile), "utf8")
            .then((data) => {
                data = data + "\n  if (typeof module !== \"undefined\") { module.exports = Config; }";
                fs.writeFile(path.resolve(sourceFolder, configJsFile), data, "utf8");
            })
            .catch(err => {
                console.error(err);
            });
    }
}


function convertConfigJS (destFolder, configJsFile, config) {
    const configJS = {...config};
    let result;

    delete configJS.footer;
    delete configJS.defaultToolId;
    delete configJS.scaleLine;
    if (configJS.tree) {
        delete configJS.tree.layerIDsToIgnore;
        delete configJS.tree.layerIDsToStyle;
        delete configJS.tree.metaIDsToMerge;
        delete configJS.tree.metaIDsToIgnore;
    }
    result = "const Config = " + JSON.stringify(configJS, null, " ") + ";",
    unquoted = result.replace(/"([^"]+)":/g, "$1:");

    fs.writeFile(path.resolve(destFolder, configJsFile), unquoted, "utf8")
        .catch(err => {
            console.error(err);
        });
}

function replaceInFile (file) {
    const replacements = {
        "menu.tools.parcelSearch": "modules.wfsSearch.parcelSearch",
        "modules.tools.wfsSearch": "modules.wfsSearch",
        "modules.tools.gfi": "modules.getFeatureInfo",
        "modules.footer": "modules.portalFooter",
        "modules.tools.layerSlider": "modules.layerSlider",
        "menu.filter": "modules.filter.name",
        "menu.contact": "modules.contact.name",
        "menu.tools.print": "modules.print.name",
        "modules.searchbar": "modules.searchBar",
        "translate#common": "common",
        "translate#additional": "additional"
    };

    Object.entries(replacements).forEach(([key, value]) => {
        // to replace all occurrences of key in file, use regex with g flag
        const regex = new RegExp(key, "g");

        replace.sync({
            files: file,
            from: regex,
            to: value
        });
    });

}


/**
 * converts config.json to version 3.0.0
 * @param {Object} answers contains the attributes for the portal to be build
 * @returns {void}
 */
module.exports = function convert (answers) {
    const
        sourceFolder = path.resolve(rootPath, answers.sourcePath),
        destFolder = path.resolve(rootPath, answers.destPath);

    fs.readdir(sourceFolder)
        .then(files => {
            let configJS;
            const configJsonFile = files.find(fileName => fileName === "config.json"),
                configJsFile = files.find(fileName => fileName === "config.js"),
                indexFile = files.find(fileName => fileName === "index.html"),
                srcFile = path.resolve(sourceFolder, configJsonFile),
                destFile = path.resolve(destFolder, configJsonFile);

            checkConfigJS(sourceFolder, configJsFile);
            configJS = require(path.resolve(sourceFolder, configJsFile));

            fs.readFile(srcFile, "utf8")
                .then(data => {
                    // console.warn("data", data);
                    const converted = {},
                        parsed = JSON.parse(data);

                    if (!parsed[PORTALCONFIG].mainMenu) {
                        console.warn("\nconvert\n", srcFile, " to\n", destFile, "\n");

                        converted[PORTALCONFIG] = {};
                        converted[PORTALCONFIG].mapView = readMapView(parsed);
                        converted[PORTALCONFIG].portalFooter = convertFooter(configJS);
                        converted[PORTALCONFIG].controls = convertControls(parsed);
                        converted[PORTALCONFIG].tree = convertTree(parsed, configJS);
                        converted[PORTALCONFIG].mainMenu = createMainMenu(parsed, configJS, convertedTools, convertedMenuEntries);
                        converted[PORTALCONFIG].secondaryMenu = createSecondaryMenu(parsed, convertedTools, convertedMenuEntries);
                        converted[TOPICS] = convertTopics(parsed);

                        fs.ensureDir(answers.destPath)
                            .then(() => {
                                fs.writeFile(destFile, JSON.stringify(converted, null, 4), "utf8")
                                    .then(() => {
                                        replaceInFile(destFile);
                                        convertConfigJS(destFolder, configJsFile, configJS);
                                        convertIndexHtml(sourceFolder, destFolder, indexFile);
                                        console.warn(destFile + " was saved!");
                                    })
                                    .catch(err => {
                                        console.error(err);
                                    });
                            })
                            .catch(err => {
                                console.error(err);
                            });
                    }
                    else {
                        console.warn("portal is already converted");
                    }
                })
                .catch(err => {
                    console.error(err);
                });
        })
        .catch(err => {
            console.error(err);
        });

};

