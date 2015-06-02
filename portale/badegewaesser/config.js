define(function () {
    var config = {
        wfsImgPath: "../components/lgv-config/img/",
        allowParametricURL: true,
        view: {
            center: [565874, 5934140], // Rathausmarkt
            resolution: 15.874991427504629, // 1:60.000
            scale: 60000 // für print.js benötigt
        },
        layerConf: "../components/lgv-config/services-fhhnet.json",
        categoryConf: "../components/lgv-config/category.json",
        styleConf: "../components/lgv-config/style.json",
        print: {
            url: function () {
                return "http://wscd0096:8680/mapfish_print_2.0/";
            },
            title: "Planportal",
            gfi: false
        },
        proxyURL: "/cgi-bin/proxy.cgi",
        layerIDs:
        [
        {id: "453", visible: true},
        {id: "94", visible: false, name: "Luftbilder"},
        {id: "1728", visible: true, style: "1728", distance: "", clusterDistance: 0, searchField: "", mouseHoverField: "name", styleLabelField: "", styleField: "eg_einstufung", name: "Badegewässer"}
        ],
        menubar: true,
        mouseHover: true,
        scaleLine: true,
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
        startUpModul: "",
        searchBar: {
            placeholder: "Suche Adresse, Stadtteil",
            gazetteerURL: function () {
                return "/geofos/dog_hh/services/wfs?service=WFS&request=GetFeature&version=2.0.0";
            }
        },
        tools: {
            gfi: true,
            measure: true,
            print: true,
            coord: true,
            draw: false,
            active: "gfi"
        },
        orientation: true,
        poi: false
    };

    return config;
});
