define(function () {
    var config = {
        tree: {
            type: "light",
            layer: [
                {id: "453", visible: true, legendUrl: "ignore"},
                {id: "452", visible: false},
                {id: "2413,2415", visible: false, name:'Tag-Schutzzone 1 mit Isolinien LAeq in dB(A)'},
            {id: "2412,2415", visible: false, name:'Tag-Schutzzone 2 mit Isolinien LAeq in dB(A)'},
            {id: "2414,2416", visible: false, name:'Nacht-Schutzzonen mit Isolinien LAeq in dB(A)'}
            ]
        },

        view: {
            center: [565686, 5942986], //Flughafen
            resolution: 15.874991427504629, //1.60.00
            scale: 60000, // für print.js benötigt
            extent: [454591, 5809000, 700000, 6075769]
        },
        controls: {
            zoom: true,
            toggleMenu: true,
            orientation: "once",
            poi: true
        },
        footer: true,
        quickHelp: true,
        layerConf: "../components/lgv-config/services-fhhnet.json",
        restConf: "../components/lgv-config/rest-services-fhhnet.json",
        styleConf: "../components/lgv-config/style.json",
        categoryConf: "../components/lgv-config/category.json",
        proxyURL: "/cgi-bin/proxy.cgi",


        attributions: true,
        menubar: true,
        scaleLine: true,
        mouseHover: true,
        isMenubarVisible: true,
         menuItems: {
            tree: {
                title: "Themen",
                glyphicon: "glyphicon-list"
            },
            tools: {
                title: "Werkzeuge",
                glyphicon: "glyphicon-wrench"
            },
            legend: {
                title: "Legende",
                glyphicon: "glyphicon-book"
            },
            contact: {
                title: "Kontakt",
                glyphicon: "glyphicon-envelope",
                email: "LGVGeoPortal-Hilfe@gv.hamburg.de"
            }
        },
       
        startUpModul: "",
        searchBar: {
            minChars: 3,
            gazetteer: {
                minChars: 3,
                 url: "/geodienste_hamburg_de/HH_WFS_DOG?service=WFS&request=GetFeature&version=2.0.0",
                searchStreets: true,
                searchHouseNumbers: true,
                searchDistricts: true,
                searchParcels: true
         
            },
            placeholder: "Suche nach Adresse, Stadtteil",
            geoLocateHit: true
        },
        print: {
            printID: "99999",
            title: "Lärmschutzbereiche Flughafen Hamburg",
            gfi: false
        },
         tools: {
            print: {
                title: "Karte drucken",
                glyphicon: "glyphicon-print"
            },
            coord: {
                title: "Koordinate abfragen",
                glyphicon: "glyphicon-screenshot"
            },
            measure: {
                title: "Strecke / Fläche messen",
                glyphicon: "glyphicon-resize-full"
            }
        },
        
    };

    return config;
});
