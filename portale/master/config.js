define(function () {
    /**
    * @namespace config
    * @desc Beschreibung
    */
    var config = {
        /**
        * @memberof config
        * @type {String}
        * @desc Pfad zum img-Ordner für WFS-Styles
        */
        wfsImgPath: "../components/lgv-config/img/",
        /**
        * @memberof config
        * @type {Boolean}
        * @desc Wenn TRUE, wird in main.js models/ParametricURL.js geladen. Dieses Modul übernimmt spezielle Attribute eines parametrisierten Aufrufs und überschreibt damit Einstellungen der config.js
        */
        allowParametricURL: true,
        /**
        * @memberof config
        * @desc Die initiale Zentrums-Koordinate und die Resolution
        * @property {Array}  center - Die initiale Zentrumskoordinate.
        * @property {Number}  resolution - Die initale Resolution der Karte. Default ist 15.874991427504629, das entsprich einen Maßstab von 1:60000.
        * @property {Number}  scale - Der initiale Maßstab.
        * @property {Array}  extent - Der ol.view.extent der Karte
        */
        view: {
            center: [565874, 5934140],
            resolution: 15.874991427504629,
            scale: 60000, // für print.js benötigt
            extent: [454591, 5809000, 700000, 6075769]
        },
        /**
        * @memberof config
        * @type {String}
        * @desc zeigt einen Footer-Bereich an
        */
        footer: true,
        /**
        * @memberof config
        * @type {String}
        * @desc aktiviert das QuickHelp-Modul
        */
        quickHelp: true,

        /**
        * @memberof config
        * @type {String}
        * @desc Pfad zur DienstAPI.
        */
        layerConf: "../components/lgv-config/services-fhhnet.json",
        /**
        * @memberof config
        * @type {String}
        * @desc Pfad zur Style-Datei für die WFS-Dienste.
        */
        styleConf: "../components/lgv-config/style.json",
        /**
        * @memberof config
        * @type {String}
        * @desc Pfad zur Konfig-Datei für den automatisiert generiereten Layerbaum
        */
        categoryConf: "../components/lgv-config/category.json",
        /**
        * @memberof config
        * @type {String}
        * @desc Pfad zur Proxy-CGI
        */
        proxyURL: "/cgi-bin/proxy.cgi",
        /**
        * @memberof config
        * @type {Object[]}
        * @property {String}  id - ID aus layerConf. Werden kommaseparierte ID übergeben, können WMS gemeinsam abgefragt werden.
        * @property {Boolean}  visible - Initiale Sichtbarkeit des Layers.
        * @property {String}  style - Nur bei WFS-Layern. Weist dem Layer den Style aus styleConf zu.
        * @property {String}  styles - Nur bei WMS-Layern. Fragt dem WMS mit eingetragenem Styles-Eintrag ab.
        * @property {Number}  clusterDistance - Nur bei WFS-Layern. Werte > 0 nutzen Clustering.
        * @property {String}  searchField - Nur bei WFS-Layern. Wenn searchField auf Attributnamen gesetzt, werden die entsprecheden Values in der Searchbar gesucht.
        * @property {String}  styleField - Nur bei WFS-Layern. Wenn styleField auf Attributname gesetzt, wird der jeweilge Wert für Style benutzt. styleConf muss angepasst werden.
        * @property {String}  styleLabelField - Nur bei WFS-Layern. Wenn styleLabelField auf Attributname gesetzt, wird der jeweilge Wert für Label verwendet. Style muss entsprechend konfiguriert sein.
        * @property {String}  mouseHoverField - Nur bei WFS-Layern. Wenn mouseHoverField auf Attributnamen gesetzt, stellt ein MouseHover-Event den Value als Popup dar.
        * @property {Object[]}  filterOptions - Nur bei WFS-Layern. Array aus Filterdefinitionen. Jede Filterdefinition ist ein Objekt mit Angaben zum Filter.
        * @property {String}  filterOptions.fieldName - Name des Attributes, auf das gefiltert werden soll.
        * @property {String}  filterOptions.filterType - Name des zulässigen Filtertyps. Derzeit nur combo.
        * @property {String}  filterOptions.filterName - Name des Filters in der Oberfläche.
        * @property {String}  filterOptions.filterString - Einträge des Filters, auf die gefiltert werden kann.
        * @property {String}  attribution - Setzt die Attributierung des Layers auf diesen String.
        * @property {Object}  attribution - Setzt die Attributierung des Layers in Abhängigkeit eines Events. Eine Funktion muss den Value "eventValue" am Layer setzen, um ihn zu übernehmen.
        * @property {String}  attribution.eventname - Name des Events, das abgefeuert wird.
        * @property {String}  attribution.timeout - Dauer in Millisekunden für setInterval.
        * @property {String}  opacity - Wert für die voreingestellte Transparenz für den Layer.
        * @property {String}  minScale -
        * @property {String}  maxScale -
        * @property {Boolean}   routable - Wert, ob dieser Layer beim GFI als Routing Destination ausgewählt werden darf. Setzt menu.routing == true vorraus.
        * @desc Beschreibung.
        */
        layerIDs: [
            {id: "453", visible: true, legendUrl: "ignore"},
            {id: "452", visible: false},
            {id: "1748", visible: false},
            {id: "1562", visible: true},
            {id: "1561", visible: true},
            {id: "45", visible: false, style: "45", clusterDistance: 50, routable: true},
            {id:
             [
                 {
                     id: "946",
                     attribution:
                     {
                         eventname: "aktualisiereverkehrsnetz",
                         timeout: (10 * 60000)
                     }
                 },
                 {
                     id: "947"
                 }
             ],
             name: "aktuelle Meldungen der TBZ", visible: false
            },
            {id: "1711", visible: true, style: "1711", clusterDistance: 0, searchField: "name", mouseHoverField: "name", attribution: "<strong><a href='http://www.hh.de/' target='_blank'>Attributierung für Fachlayer</a></strong>",
             displayInTree: true,
             filterOptions: [
                 {
                     fieldName: "teilnahme_geburtsklinik",
                     filterType: "combo",
                     filterName: "Geburtsklinik",
                     filterString: ["*", "ja", "nein"]
                 },
                 {
                     fieldName: "teilnahme_notversorgung",
                     filterType: "combo",
                     filterName: "Not- und Unfallversorgung",
                     filterString: ["*", "ja", "eingeschränkt", "nein"]
                 }
             ],
             routable: true
            }
        ],
        /**
        * @memberof config
        * @type {Boolean}
        * @desc Wenn TRUE, wird in main.js views/AttributionView.js geladen. Dieses Modul regelt die Darstellung der Layerattributierung aus layerConf oder layerIDs{attribution}.
        */
        attributions: true,
        /**
        * @memberof config
        * @type {Boolean}
        * @desc Steuert, ob das Portal eine Menüleiste(Navigationsleiste) haben soll oder nicht.
        */
        menubar: true,
        /**
        * @memberof config
        * @type {Boolean}
        * @desc Wenn TRUE, wird in main.js views/ScaleLineView.js geladen. Zeigt eine ScaleLine in der Map unten links an oder nicht. Benutze <div id="scaleLine" und <div id="scaleLineInner"></div>
        */
        scaleLine: true,
        /**
        * @memberof config
        * @type {Boolean}
        * @desc Wenn TRUE, wird in main.js views/MouseHoverPopupView.js geladen. Dieses Modul steuert die Darstellung des MouseHovers entsprechend layerIDs{mouseHoverField}
        */
        mouseHover: true,
        /**
        * @memberof config
        * @type {Boolean}
        * @desc Steuert, ob die Menubar initial ausgeklappt ist oder nicht.
        */
        isMenubarVisible: true,
        /**
        * @memberof config
        * @desc Hier lassen sich die einzelnen Menüeinträge/Funktionen für die Menüleiste aktivieren/deaktivieren.
        * @property {Boolean}  searchBar - Die Suchfunktion.
        * @property {Boolean}  layerTree - Der Themenbaum
        * @property {Boolean}  helpButton - Der Hilfe-Button.
        * @property {Boolean}  contactButton - Der Kontakt-Button.
        * @property {Boolean}  tools - Die Werkzeuge
        * @property {Boolean}  treeFilter - Der Filter für die Straßenbäume.
        * @property {Boolean}  wfsFeatureFilter - Der WFS-Filter. Filterung entsprechend Eintrag in layerIDs{filterOptions}.
        * @property {Boolean}  legend - Die Legende
        * @property {Boolean}  routing - Wenn TRUE, wird in main.js views/RoutingView.js geladen. Möglichkeit der Routenberechnung.
        */
        menu: {
            viewerName: "GeoViewer",
            searchBar: true,
            layerTree: true,
            helpButton: false,
            contactButton: true,
            tools: true,
            treeFilter: false,
            wfsFeatureFilter: true,
            legend: true,
            routing: true
        },
        /**
        * @memberof config
        * @desc Konfiguration des beim Starten zu ladenden Moduls. Funktioniert derzeit mit wfsFeatureFilter und Routing. Wird auch im parametrisierten Aufruf erkannt.
        * @property {String}  Name des Moduls.
        */
        startUpModul: "",
        /**
        * @memberof config
        * @desc Konfiguration für die Suchfunktion. Workaround für IE9 implementiert.
        * @property {String}  placeholder - Der Text der initial in der Suchmaske steht.
        * @property {Function}  gazetteerURL - Die Gazetteer-URL.
        */
        searchBar: {
            placeholder: "Suche nach Adresse/Krankenhaus/B-Plan",
            gazetteerURL: function () {
                    return "/geofos/dog_hh/services/wfs?service=WFS&request=GetFeature&version=2.0.0";
            }
        },

        bPlan: {
            url: function () {
                return "/geofos/fachdaten_public/services/wfs_hh_bebauungsplaene";
            }
        },
                 /**
        * @memberof config
        * @desc Konfiguration für den Druckdienst.
        * @property {String}  url - Die Druckdienst-URL
        * @property {String}  title - Der Titel erscheint auf dem Ausdruck der Karte.
        * @property {Boolean}  gfi - Bisher nur teilweise umgesetzt. Nur möglich wenn die Anzahl der GFI-Attribute genau sechs ist(Straßenbaumkataster).
        */
        print: {
            url: function () {
                return "http://geofos.fhhnet.stadt.hamburg.de/mapfish_print_2.0/";
                },
            title: "Master",
            gfi: false
        },
        /**
        * @memberof config
        * @desc Die Funktionen die unter dem Menüpunkt "Werkzeuge" aktiviert/deaktiviert werden können.
        * @property {Boolean}  gfi - GetFeatureInfo-Abfrage.
        * @property {Boolean}  measure - Messen.
        * @property {Boolean}  draw - Zeichnen.
        * @property {Boolean}  print - Drucken.
        * @property {Boolean}  coord - Koordinaten-Abfrage.
        * @property {String}  active - Die Funktion die initial auf der Karte registriert ist. Mögliche Werte: "gfi", "coord" oder "measure".
        */
        tools: {
            gfi: true,
            measure: true,
            print: true,
            coord: true,
            draw: true,
            active: "gfi"
        },
        /**
        * @memberof config
        * @type {Boolean}
        * @desc Ermöglicht über einen Button auf der Karter den aktuellen Standpunkt bestimmen zu lassen.
        */
        orientation: true,
        /**
        * @memberof config
        * @type {Boolean}
        * @desc Vorraussetzung für POI(Points of interest) ist, dass orientation auf true gesetzt ist. POI zeigt alle in der Nähe befindlichen Objekte von eingeschalteten WFS Diensten an in den Abständen 500, 1000 und 2000 Metern.
        */
        poi: true
    };

    return config;
});
