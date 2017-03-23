>Zurück zur [Dokumentation Masterportal](doc.md).

[TOC]

# config.js #
Die *config.js* enthält die Konfigurationsoptionen für das Masterportal, die sich nicht auf die Portal-Oberfläche oder die dargestellten Layer beziehen, z.B. Pfade zu weiteren Konfigurationsdateien. Die *config.js* liegt im Regelfall neben der index.html und neben der *config.json*.
Im Folgenden werden die einzelnen Konfigurationsoptionen beschrieben. Darüber hinaus gibt es für die Konfigurationen vom Typ *object* weitere Optionen, diese Konfigurationen sind verlinkt und werden im Anschluss an die folgende Tabelle jeweils genauer erläutert. Hier geht es zu einem [Beispiel](https://bitbucket.org/lgv-g12/lgv/src/stable/portal/master/config.js).

|Name|Verpflichtend|Typ|Default|Beschreibung|Beispiel|
|----|-------------|---|-------|------------|--------|
|[animation](#markdown-header-animation)|nein|Object||Modul, das einen WFS-Dienst animiert darstellt.||
|[clickCounter](#markdown-header-clickcounter)|nein|Object||Konfigurationsobjekt des ClickCounterModuls. Dieses lädt für jeden registrierten Klick ein iFrame.||
|csw|nein|String|"1"|Referenz auf eine CS-W Schnittstelle, die für die Layerinformation genutzt wird. ID wird über [rest-services.json](rest-services.json.md) aufgelöst.|`"1"`|
|customModules|nein|Array[String]||Pfad zu portalspezifischen Modulen. Der Pfad ist relativ zu *js/main.js*.| `["../portal/master/verkehrsfunctions"]`|
|[footer](#markdown-header-footer)|nein|Object||Zeigt einen Footer-Bereich an und konfiguriert diesen.||
|gfiWindow|nein|String|"detached"|Darstellungsart der Attributinformationen für alle Layertypen. **attached**: das Fenster mit Attributinformationen wird am Klickpunkt geöffnet. **detached**: das Fenster mit Attributinformationen wird oben rechts auf der Karte geöffnet. Der Klickpunkt wird zusätzlich mit einem Marker gekennzeichnet.|`"attached"`|
|ignoredKeys|nein|Array[String]||Liste der ignorierten Attributnamen bei der Anzeige von Attributinformationen aller Layertypen.|`["BOUNDEDBY", "SHAPE", "SHAPE_LENGTH", "SHAPE_AREA", "OBJECTID", "GLOBALID", "GEOMETRY", "SHP", "SHP_AREA", "SHP_LENGTH","GEOM"]`|
|isMenubarVisible|nein|Boolean|true|Steuert, ob die Menubar sichtbar ist. Kann auch über [URL-Parameter](URL-Parameter.md) gesteuert werden.|`true`|
|layerConf|ja|String||Pfad zur [services.json](services.json.md), die alle verfügbaren WMS-Layer bzw. WFS-FeatureTypes enthält. Der Pfad ist relativ zu *js/main.js*.|`"../components/lgv-config/services-fhhnet-ALL.json"`|
|mouseHover|nein|Boolean|false|Steuert, ob MouseHover für Vektorlayer (WFS) aktiviert ist. Weitere Konfigurationsmöglichkeiten pro Layer in [config.json](config.json.md) (*Themenconfig.Fachdaten.Layer*).|`true`|
|namedProjections|ja|Array[String]||Festlegung der nutzbaren Koordinatensysteme ([siehe Syntax](http://proj4js.org/#named-projections)).|`[["EPSG:25832", "+proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"]]`|
|[print](#markdown-header-print)|ja|Object||Konfiguration für den Druckdienst. Erwartet wird eine Instanz von [MapFish-Print 2](http://www.mapfish.org/doc/print/). Nur verpflichtend, wenn *config.json.portalconfig.tools.print* konfiguriert ist ([config.json](config.json.md)).||
|proxyUrl|ja|String||Absoluter Server-Pfad zu einem Proxy-Skript, dass mit *"?url="* aufgerufen wird. Notwendig, wenn der Druck-Dienst konfiguriert ist (siehe [print](#markdown-header-print)).|`"/cgi-bin/proxy.cgi"`|
|quickHelp|nein|Boolean|false|Aktiviert das QuickHelp-Modul. Dieses zeigt kontextsensitive Hilfe für die verfügbaren Funktionen an (bisher verfügbar für: Themenbaum und Suche).|`true`|
|restConf|ja|String||Pfad zur [rest-services.json](rest-services.json.md), die weitere, verfügbare Dienste enthält (z.B. Druckdienst, WPS, CSW). Der Pfad ist relativ zu js/main.js.|`"../components/lgv-config/rest-services-fhhnet.json"`|
|scaleLine|nein|Boolean|false|Steuert, ob eine Maßstabsleiste unten auf der Karte angezeigt wird. Ist der *Footer* aktiv, wird die Leiste unten rechts, sonst unten links angezeigt.|`true`|
|simpleMap|nein|Boolean|false|Fügt dem *„Auswahl speichern“-Dialog* eine SimpleMap-URL hinzu (ohne Menüleiste, Layerbau, Map Controls). Nicht für Portale mit Baumtyp: *„light“*.|`false`|
|styleConf|ja|String||Pfad zur [style.json](style.json.md), die Styles für Vektorlayer (WFS) enthält. Der Pfad ist relativ zu *js/main.js*.|`"../components/lgv-config/style.json"`|
|view|ja|Object||Konfigurations-Einstellungen für die mapView. Leeres Objekt wird benötigt.|`{}`|
|wfsImgPath|nein|String||Pfad zum Ordner mit Bildern, die für WFS-Styles benutzt werden. Der Pfad ist relativ zu *js/main.js*.|`"../components/lgv-config/img/"`|
|wpsID|nein|String|""|Referenz auf eine WPS-Schnittstelle, die in verschiedenen Modulen genutzt wird. ID wird über [rest-services.json](rest-services.json.md) aufgelöst.|`""`|
|[zoomToFeature](#markdown-header-zoomtofeature)|nein|Object||Optionale Konfigurations-Einstellungen für den URL-Parameter *featureid*. Siehe [URL-Parameter](URL-Parameter.md).||

******
##MML
|Name|Verpflichtend|Typ|Default|Beschreibung|Beispiel|
|----|-------------|---|-------|------------|--------|
|isMml|nein|boolean|-|Wenn dieser Parameter gesetzt und true ist, werden MML-spezifische Funktionen aktiviert|isMml=true|
******
## animation

|Name|Verpflichtend|Typ|Default|Beschreibung|
|----|-------------|---|-------|------------|
|attrAnzahl|nein|String|"anzahl_einpendler"|Aus diesem Attribut des featureTypes wird die Anzahl der Pendler ausgelesen.|
|attrKreis|nein|String|"wohnort_kreis"|Aus diesem Attribut werden die zur Auswahl stehenden Kreise ausgelesen.|
|colors|nein|Array[String]|["rgba(255,0,0,0.5)", "rgba(0,0,255,0.5)"]|Angabe der verschiedenen Farben, die für die Animation verschiedener Kreise genutzt werden sollen in [rgba()-Notation](https://www.w3.org/TR/css3-color/#rgba-color) ([siehe auch hier](https://developer.mozilla.org/de/docs/Web/CSS/Farben#rgba)). Anzahl der Farben muss mit "num_kreise_to_style" übereinstimmen.|
|featureType|nein|String|"mrh_einpendler_gemeinde"|FeatureType, der animiert werden soll.|
|maxPx|nein|Number|20|Größe des größten Punkts in px.|
|minPx|nein|Number|1|Größe des kleinsten Punkts in px.|
|num_kreise_to_style|nein|Number|2|Anzahl, der mit verschiedenen Farben darzustellenden Kreise. Muss mit der Anzahl der Farben in "colors" übereinstimmen.|
|[params](#markdown-header-animationparams)|nein|Object||Hier gibt es verschiedene Konfigurationsmöglichkeiten.|
|steps|nein|Number|50|Anzahl der Schritte, die pro Animation durchlaufen werden.|
|url|nein|String|"http://geodienste.hamburg.de/Test_MRH_WFS_Pendlerverflechtung"|Die URL des zu animierenden Dienstes.|
|zoomlevel|nein|Number|1|Zoomlevel, auf das nach Auswahl eines Kreises gezoomt wird.|

### animation.params ###
|Name|Verpflichtend|Typ|Default|Beschreibung|
|----|-------------|---|-------|------------|
|REQUEST|nein|String|"GetFeature"|WFS-Request|
|SERVICE|nein|String|"WFS"|Service-Typ|
|TYPENAME|nein|String|"app:mrh_kreise"|FeatureType des WFS|
|VERSION|nein|String|"1.1.0"|Version des Dienstes|
|maxFeatures|nein|String|"10000"|maximale Anzahl an zu ladenden Features|

**Beispiel animation:**

```
#!json


animation: {
            steps: 30,
            url: "http://geodienste.hamburg.de/Test_MRH_WFS_Pendlerverflechtung",
            params: {
                REQUEST: "GetFeature",
                SERVICE: "WFS",
                TYPENAME: "app:mrh_kreise",
                VERSION: "1.1.0",
                maxFeatures: "10000"
            },
            featureType: "mrh_einpendler_gemeinde",
            attrAnzahl: "anzahl_einpendler",
            attrKreis: "wohnort_kreis",
            minPx: 5,
            maxPx: 30,
            num_kreise_to_style: 4,
            zoomlevel: 1,
            colors: ["rgba(255,0,0,0.5)", "rgba(0,255,0,0.5)", "rgba(0,0,255,0.5)", "rgba(0,255,255,0.5)"]
        }
```

******

## clickCounter ##
|Name|Verpflichtend|Typ|Default|Beschreibung|
|----|-------------|---|-------|------------|
|desktop|nein|String||URL des iFrames bei Desktopausspielung.|
|mobile|nein|String||URL des iFrames bei mobiler Ausspielung.|

**Beispiel:**


```
#!json

clickCounter:
{
desktop: "http://static.hamburg.de/countframes/verkehrskarte_count.html",
mobil: "http://static.hamburg.de/countframes/verkehrskarte-mobil_count.html"
}

```

*********

## footer ##
|Name|Verpflichtend|Typ|Default|Beschreibung|
|----|-------------|---|-------|------------|
|[urls](#markdown-header-footerurls)|nein|Array[Object]||Array von URL-Konfigurationsobjekten. Auch hier existieren wiederum mehrere Konfigurationsmöglichkeiten, welche in der folgenden Tabelle aufgezeigt werden.|
|visibility|nein|Boolean|false|Schaltet den Footer sichtbar.|

******
### footer.urls ###
|Name|Verpflichtend|Typ|Default|Beschreibung|
|----|-------------|---|-------|------------|
|alias|nein|String|"Landesbetrieb Geoniformation und Vermessung"|Bezeichnung des Links bei Desktop-Ausspielung.|
|alias_mobil|nein|String|"LGV"|Bezeichnung bei mobiler Ausspielung.|
|bezeichnung|nein|String|"Kartographie und Gestaltung: "|Bezeichnung vor dem Link.|
|url|nein|String|„http://www.geoinfo.hamburg.de/“|Die aufzurufende URL.|


**Beispiel:**

```
#!json

footer: {
            visibility: true,
            urls: [
                {
                    "bezeichnung": "Kartographie und Gestaltung: ",
                    "url": "http://www.geoinfo.hamburg.de/",
                    "alias": "Landesbetrieb Geoniformation und Vermessung",
                    "alias_mobil": "LGV"
                },
                {
                    "bezeichnung": "",
                    "url": "http://geofos.fhhnet.stadt.hamburg.de/sdp-daten-download/index.php",
                    "alias": "SDP Download",
                    "alias_mobil": "SDP"
                },
                {
                    "bezeichnung": "",
                    "url": "http://www.hamburg.de/bsu/timonline",
                    "alias": "Kartenunstimmigkeit"
                }
            ]
        }
```

********

## print ##
|Name|Verpflichtend|Typ|Default|Beschreibung|
|----|-------------|---|-------|------------|
|gfi|nein|Boolean||Gibt an, ob nur die Karte oder auch geöffnete GFI-Informationen ausgedruckt werden sollen.|
|printID|ja|String||ID des Druckdienstes in der restConf. Siehe [rest-services.json](rest-services.json.md).|
|title|ja|String||Der Titel erscheint auf dem Ausdruck der Karte.|

**Beispiel:**


```
#!json

print: {
            printID: "99999",
            title: "Master",
            gfi: true
        }
```


******


## zoomToFeature ##
|Name|Verpflichtend|Typ|Default|Beschreibung|
|----|-------------|---|-------|------------|
|imglink|ja|String||Link für den Marker.|
|layerid|ja|String||ID des Layers an den die Marker gekoppelt werden.|
|typename|ja|String||Typename des WFS. Entspricht Tabelle. Wird für den WFS-Filter-Request benötigt.|
|url|ja|String||Die URL zum WFS.|
|valuereference|ja|String||Valuereference. Entspricht Spalte. Wird für den WFS-Filter-Request benötigt.|
|version|ja|String||Die Version des WFS.|

**Beispiel:**

```
#!json

zoomtofeature: {
            url: "http://geodienste.hamburg.de/HH_WFS_Eventlotse",
            version: "2.0.0",
            typename: "app:hamburgconvention",
            valuereference: "app:flaechenid",
            imglink: "../img/location_eventlotse.svg",
            layerid: "4426"
        }

```

>Zurück zur [Dokumentation Masterportal](doc.md).
