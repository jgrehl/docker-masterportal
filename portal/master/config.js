// eslint-disable-next-line no-unused-vars
const Config = {
    addons: ["bildungsatlas", "dataTable", "exampleSearch", "populationRequest", "schulinfo", "solaratlas", "sturmflut", "trafficCount", "trinkwasser", "verkehrsstaerken"],
    ignoredKeys: ["BOUNDEDBY", "SHAPE", "SHAPE_LENGTH", "SHAPE_AREA", "OBJECTID", "GLOBALID", "GEOMETRY", "SHP", "SHP_AREA", "SHP_LENGTH", "GEOM"],
    namedProjections: [
        // ETRS89 UTM
        ["EPSG:4647", "+title=ETRS89_UTM32, EPSG 4647 (zE-N) +proj=tmerc +lat_0=0 +lon_0=9 +k=0.9996 +x_0=32500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs"],
        // EPSG: 25832
        ["EPSG:25832", "+title=EPSG 25832 +proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"],
        // ETRS89_3GK3
        ["EPSG:8395", "+title=ETRS89_3GK3 +proj=tmerc +lat_0=0 +lon_0=9 +k=1 +x_0=3500000 +y_0=0 +ellps=GRS80 +datum=GRS80 +units=m +no_defs"],
        // EPSG: 8395
        ["EPSG:8395", "+title=EPSG 8395 +proj=tmerc +lat_0=0 +lon_0=9 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +datum=GRS80 +units=m +no_defs"],
        // GK DHDN
        ["EPSG:31467", "+title=DE_DHDN_3GK3, EPSG 31467 +proj=tmerc +lat_0=0 +lon_0=9 +k=1 +x_0=3500000 +y_0=0 +ellps=bessel +datum=potsdam +units=m +no_defs"],
        // WGS84
        ["EPSG:4326", "+title=WGS84_Lat-Lon (Grad, Minuten, Sekunden), EPSG 4326 +proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs"]
    ],
    layerConf: "https://geodienste.hamburg.de/services-internet.json",
    restConf: "https://geodienste.hamburg.de/lgv-config/rest-services-internet.json",
    styleConf: "https://geodienste.hamburg.de/lgv-config/style_v3.json",
    wfsImgPath: "https://geodienste.hamburg.de/lgv-config/img/",
    alerting: {
        fetchBroadcastUrl: "./resources/newsFeedPortalAlerts.json"
    },
    startingMap3D: false,
    cesiumParameter: {
        fog: {
            enabled: true,
            density: 0.0002,
            screenSpaceErrorFactor: 2.0
        },
        fxaa: true,
        globe: {
            enableLighting: true,
            maximumScreenSpaceError: 2,
            tileCacheSize: 20
        }
    },
    featureViaURL: {
        zoomTo: "42",
        epsg: 4326,
        layers: [
            {
                id: "42",
                geometryType: "Point",
                name: "Punkt Feature",
                styleId: "location_eventlotse"
            },
            {
                id: "4200",
                geometryType: "LineString",
                name: "Übergebene Linien Feature",
                styleId: "mapMarkerPolygon_flaecheninfo"
            },
            {
                id: "4020",
                geometryType: "Polygon",
                name: "Übergebene Polygon Feature",
                styleId: "mapMarkerPolygon_flaecheninfo"
            }
        ]
    },
    zoomTo: [
        {
            id: "zoomToGeometry",
            layerId: "1692",
            property: "bezirk_name",
            allowedValues: [
                "ALTONA",
                "HARBURG",
                "HAMBURG-NORD",
                "BERGEDORF",
                "EIMSBÜTTEL",
                "HAMBURG-MITTE",
                "WANDSBEK"
            ]
        },
        {
            id: "zoomToFeatureId",
            layerId: "4560",
            property: "flaechenid",
            styleId: "location_eventlotse"
        }
    ],
    portalLanguage: {
        enabled: true,
        debug: false,
        languages: {
            de: "Deutsch",
            en: "English",
            es: "Español",
            it: "Italiano",
            platt: "Platt",
            pt: "Português",
            ru: "Русский",
            tr: "Türkçe",
            ua: "Українська"
        },
        fallbackLanguage: "de",
        changeLanguageOnStartWhen: ["querystring", "localStorage", "htmlTag"]
    }
};
