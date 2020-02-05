/* eslint-disable no-unused-vars */

const Config = {
    addons: ["einwohnerabfrage"],
    ignoredKeys: ["BOUNDEDBY", "SHAPE", "SHAPE_LENGTH", "SHAPE_AREA", "OBJECTID", "GLOBALID", "GEOMETRY", "SHP", "SHP_AREA", "SHP_LENGTH", "GEOM"],
    gfiWindow: "detached",
    simpleMap: false,
    wfsImgPath: "https://geoportal-hamburg.de/lgv-config/img/",
    zoomToFeature: {
        attribute: "flaechenid",
        wfsId: "4560",
        styleId: "location_eventlotse"
    },
    zoomToGeometry: {
        layerId: "1692",
        attribute: "bezirk_name",
        geometries: [
            "ALTONA",
            "HARBURG",
            "HAMBURG-NORD",
            "BERGEDORF",
            "EIMSBÜTTEL",
            "HAMBURG-MITTE",
            "WANDSBEK"
        ]
    },
    namedProjections: [
        // GK DHDN
        ["EPSG:31467", "+title=Bessel/Gauß-Krüger 3 +proj=tmerc +lat_0=0 +lon_0=9 +k=1 +x_0=3500000 +y_0=0 +ellps=bessel +datum=potsdam +units=m +no_defs"],
        // ETRS89 UTM
        ["EPSG:25832", "+title=ETRS89/UTM 32N +proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"],
        // LS 320: zusammen mit Detlef Koch eingepflegt und geprüft
        ["EPSG:8395", "+title=ETRS89/Gauß-Krüger 3 +proj=tmerc +lat_0=0 +lon_0=9 +k=1 +x_0=3500000 +y_0=0 +ellps=GRS80 +datum=GRS80 +units=m +no_defs"],
        // WGS84
        ["EPSG:4326", "+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs"]
    ],
    earthRadius: 6378137,
    footer: {
        urls: [{
            "bezeichnung": "Kartographie und Gestaltung: ",
            "url": "https://www.geoinfo.hamburg.de/",
            "alias": "Landesbetrieb Geoinformation und Vermessung",
            "alias_mobil": "LGV"
        }],
        showVersion: true
    },
    quickHelp: {
        imgPath: "https://geoportal-hamburg.de/lgv-config/img/"
    },
    cswId: "3",
    metaDataCatalogueId: "2",
    portalConf: "./",
    layerConf: "https://geodienste.hamburg.de/services-internet.json",
    restConf: "https://geoportal-hamburg.de/lgv-config/rest-services-internet.json",
    styleConf: "https://geoportal-hamburg.de/lgv-config/style_v2.json",
    proxyURL: "/cgi-bin/proxy.cgi",
    scaleLine: true,
    mouseHover: {
        numFeaturesToShow: 2,
        infoText: "(weitere Objekte. Bitte zoomen.)"
    },
    clickCounter: {},
    startingMap3D: false,
    obliqueMap: true,
    cesiumParameter: {
        tileCacheSize: 20,
        enableLighting: true,
        fog: {
            enabled: true,
            density: 0.0002,
            screenSpaceErrorFactor: 2.0
        },
        maximumScreenSpaceError: 2,
        fxaa: true
    },
    defaultToolId: "gfi",
    portalLanguage: {
        enabled: true,
        debug: false,
        languages: {
            de: "deutsch",
            en: "englisch"
        },
        fallbackLanguage: "de",
        changeLanguageOnStartWhen: ["querystring", "localStorage", "navigator", "htmlTag"]
    }
};

/* eslint-enable no-unused-vars */
