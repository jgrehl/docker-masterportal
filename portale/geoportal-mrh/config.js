define(function () {
    var config = {
        title: "Geoportal der Metropolregion Hamurg",
        tree: {
            custom:false,
            orderBy: "opendata",
            filter: true,
            layerIDsToMerge: [],

            metaIDsToMerge:[]
        },
        baseLayer: [
            {id: "0", visible: true},       //WebAtlas
            {id: "1", visible: false},       //WebAtlas_grau
            {id: "2", visible: false},      //Luftbilder
            {id: "4", visible: false}       //1:5000
        ],
        controls: {
            zoom: true,
            toggleMenu: true
        },
        footer: true,
        quickHelp: true,
        allowParametricURL: true,
        view: {
            center: [565874, 5934140],
            extent: [454591, 5809000, 700000, 6075769], // extent aus altem portal erzeugt fehler im webatlas und suchdienst
            resolution: 152.87436231907702,
            options: [
                {
                    resolution: 152.87436231907702,
                    scale: "250000",
                    zoomLevel: 1
                },
                {
                    resolution: 76.43718115953851,
                    scale: "100000",
                    zoomLevel: 2
                },
                {
                    resolution: 38.21859057976939,
                    scale: "60000",
                    zoomLevel: 3
                },
                {
                    resolution: 19.109295289884642,
                    scale: "40000",
                    zoomLevel: 4
                },
                {
                    resolution: 9.554647644942321,
                    scale: "20000",
                    zoomLevel: 5
                },
                {
                    resolution: 4.7773238224711605,
                    scale: "10000",
                    zoomLevel: 6
                },
                {
                    resolution: 2.3886619112355802,
                    scale: "5000",
                    zoomLevel: 7
                },
                {
                    resolution: 1.1943309556178034,
                    scale: "2500",
                    zoomLevel: 8
                },
                {
                    resolution: 0.5971654778089017,
                    scale: "1000",
                    zoomLevel: 9
                }
            ]
        },
        layerConf: "../components/lgv-config/services-mrh.json",
        restConf: "../components/lgv-config/rest-services-internet.json",
        categoryConf: "../components/lgv-config/category.json",
        styleConf: "../components/lgv-config/style.json",
        menubar: true,
        scaleLine: true,
        isMenubarVisible: true,
        menu: {
            viewerName: "Geoportal GDI-MRH",
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
        startUpModul: "",
        searchBar: {
            placeholder: "Suchen nach Adresse, Thema",
            gazetteerURL: "/geofos/dog_hh/services/wfs?service=WFS&request=GetFeature&version=2.0.0",
            bkgSuggestURL: "/bkg_suggest",
            bkgSearchURL: "/bkg_geosearch",
            useBKGSearch: true
        },
        tools: {
            gfi: true,
            measure: true,
            print: true,
            coord: true,
            draw: true,
            orientation: false,
            active: "gfi"
        },
        print: {
            printID: "99997",
            title: "Geoportal der Metropolregion Hamburg",
            outputFilename: "Ausdruck Geoportal GDI-MRH",
            gfi: false
        },
        proxyURL: "/cgi-bin/proxy.cgi"
    };

    return config;
});
