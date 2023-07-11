const fs = require("fs-extra"),
    path = require("path"),
    rootPath = path.resolve(__dirname, "../../");

function readMapView(data) {
    return data[ "Portalconfig" ]["mapView"];
}

function readControls(data) {
    return data[ "Portalconfig" ]["controls"];
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
            const file = files.find(file => file.indexOf("config.json") > -1),
                sourceFile = path.resolve(sourceFolder, file),
                destFile = path.resolve(destFolder, file);

            console.warn("convert sourceFile ", sourceFile, "to destFile ", destFile);

            fs.readFile(sourceFile, "utf8")
                .then(data => {
                    // console.warn("data", data);
                    let converted = {}
                    const parsed = JSON.parse(data);

                    converted.mapView = readMapView(parsed);
                    converted.controls = readControls(parsed);
                    console.warn("converted", converted);

                    fs.ensureDir(destPath)
                        .then(() => {
                            fs.writeFile(destFile, JSON.stringify(converted, null, 4), "utf8")
                                .then(() => {
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
