define(function () {

    var config = {
        ignoredKeys: ["BOUNDEDBY", "SHAPE", "SHAPE_LENGTH", "SHAPE_AREA", "OBJECTID", "GLOBALID", "GEOMETRY", "SHP", "SHP_AREA", "SHP_LENGTH", "GEOM"],
        wfsImgPath: "../components/lgv-config/img/",
        allowParametricURL: true,
        view: {
            center: [565874, 5934140] // Rathausmarkt
        },
        namedProjections: [
            // ETRS89 UTM
            ["EPSG:25832", "+proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"]
        ],
        layerConf: "../components/lgv-config/services-internet.json",
        restConf: "../components/lgv-config/rest-services-internet.json",
        styleConf: "../components/lgv-config/style.json",
        print: {
            printID: "99999",
            title: "Geoportal-Verkehr",
            gfi: false
        },
        proxyURL: "/cgi-bin/proxy.cgi",
        mouseHover: true,
        scaleLine: true,
        customModules: ["../portale/verkehr-geoportal/verkehrsfunctions"],
        startUpModul: "",
        gemarkungen: "../components/lgv-config/gemarkung.json"

    };

    return config;
});
