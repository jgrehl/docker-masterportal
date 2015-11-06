define(function () {

    var config = {
        metadatenURL: "",
        wfsImgPath: "../components/lgv-config/img/",
        allowParametricURL: true,

        view: {
            center: [565874, 5934140],
            extent: [454591, 5809000, 700000, 6075769],
            resolution: 66.145965625264583, // 1:250.000
            resolutions: [
                66.145965625264583,
                26.458386250105834,
                15.875031750063500,
                10.583354500042333,
                5.2916772500211667,
                2.6458386250105834,
                1.3229193125052917,
                0.6614596562526458,
                0.2645838625010583,
                0.1322919312505292
            ],
            epsg: "EPSG:25832"
        },
        footer: true,
        quickHelp: true,

        layerConf: "../components/lgv-config/services-fhhnet.json",
        restConf: "../components/lgv-config/rest-services-fhhnet.json",
        styleConf: "../components/lgv-config/style.json",
        categoryConf: "../components/lgv-config/category.json",
        proxyURL: "/cgi-bin/proxy.cgi",

        layerIDs: [
            {id: "453", visible: true, legendUrl: "ignore"},
            {id: "452", visible: false},
            {id: "2515", visible: true} // Wohnlagen
        ],
        controls: {
            zoom: true,
            toggleMenu: true
        },
        attributions: true,
        menubar: true,
        scaleLine: true,
        mouseHover: true,
        isMenubarVisible: true,

        menu: {
            viewerName: "GeoViewer",
            searchBar: true,
            layerTree: true,
            helpButton: false,
            contactButton: true,
            tools: true,
            treeFilter: false,
            wfsFeatureFilter: false,
            legend: true,
            routing: false
        },
        searchBar: {
            placeholder: "Suche nach Adresse, Stadtteil",
<<<<<<< HEAD
            gazetteerURL: "/geofos/dog_hh/services/wfs?service=WFS&request=GetFeature&version=2.0.0"
            // bkgSuggestURL: "/bkg_suggest",
            // bkgSearchURL: "/bkg_geosearch",
           // useBKGSearch: true
=======
            gazetteer: {
                minChars: 3,
                url: "/geofos/dog_hh/services/wfs?service=WFS&request=GetFeature&version=2.0.0",
                searchStreets: true,
                searchHouseNumbers: true,
                searchDistricts: true,
                searchParcels: true
            },
            geoLocateHit: true
>>>>>>> 0f3e0c56918372e57ab622760b99851b53a2f6bf
        },
        print: {
            printID: "99999",
            title: "Wohnlagenverzeichnis Hamburg",
            gfi: false
        },
        tools: {
            gfi: true,
            measure: true,
            print: true,
            coord: true,
            draw: true,
            active: "gfi"
        },
        orientation: false,
        poi: true
    };

    return config;
});
