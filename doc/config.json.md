>Zurück zur [Dokumentation Masterportal](doc.md).

[TOC]

# config.json #
Die *config.json* enthält die gesamte Konfiguration der Portal-Oberfläche. In ihr wird geregelt welche Elemente wo in der Menüleiste sind, worauf die Karte zentriert werden soll und welche Layer geladen werden sollen. Hier geht es zu einem [Beispiel](https://bitbucket.org/lgv-g12/lgv/src/stable/portal/master/config.json).
## Portalconfig ##
In der *Portalconfig* kann die Oberfläche des Portals konfiguriert werden:

1.	der Titel mit Logo, falls erforderlich
2.	welche/r Suchdienst/e angesprochen werden soll/en
3.	welche Themenbaumart genutzt werden soll (einfach/light oder mit Unterordnern/custom)
4.	welche Werkzeuge geladen werden sollen
5.	welche Interaktionen mit der Karte möglich sein sollen (zoomen, Menüzeile ein/ausblenden, Standortbestimmung des Nutzers,  Vollbildmodus, etc.)
6.	welche Layer genutzt werden und ggf. in welchen Ordnern, sie in der Themenauswahl erscheinen sollen.

Es existieren die im Folgenden aufgelisteten Konfigurationen. Auch hier werden die Konfigurationen des Typs object verlinkt und später eingehend erläutert.

|Name|Verpflichtend|Typ|Default|Beschreibung|Beispiel|
|----|-------------|---|-------|------------|--------|
|Baumtyp|ja|String||Legt fest, welche Themenbaumart genutzt werden soll. Es existieren die Möglichkeiten *light* (einfache Auflistung), *default* (FHH-Atlas), *custom* (benutzerdefinierte Layerliste anhand json).|`"light"`|
|[controls](#markdown-header-portalconfigcontrols)|nein|Object||Mit den Controls kann festgelegt werden, welche Interaktionen in der Karte möglich sein sollen.||
|LogoLink|nein|String||Die Verlinkung zum Internetauftritt.|`"http://geoinfo.hamburg.de"`|
|LogoToolTip|nein|String||Der Text des angezeigten Tooltips|`"Landesbetrieb Geoinformation und Vermessung"`|
|[mapView](#markdown-header-portalconfigmapview)|nein|Object||Gibt den Hintergrund an, wenn keine Karte geladen ist.||
|[menu](#markdown-header-portalconfigmenu)|nein|Object||Hier können die Menüeinträge und deren Anordnung konfiguriert werden. Die Reihenfolge der Werkzeuge ergibt sich aus der Reihenfolge in der config.json (siehe [Tools](#markdown-header-portalconfigmenutools)).|  
|PortalLogo|nein|String||Der Pfad zum Logo das in der Menüleiste angezeigt wird.|`"../img/hh-logo.png"`|
|PortalTitle|nein|String||Der Titel, der in der Menüleiste angezeigt wird.|`"Master"`|
|scaleLine|nein|Boolean||true = die Maßstabsleiste wird unten rechts dargestellt, wenn kein footer vorhanden ist. Wenn ein footer vorhanden ist, wird die links angezeigt.|`true`|
|[searchBar](#markdown-header-portalconfigsearchbar)|nein|Object||Über die Suchleiste können verschiedene Suchen gleichzeitig angefragt werden||
|[simpleLister](#markdown-header-portalconfigsimplelister)|nein|Object||Der SimpleLister zeigt alle Features eines angegebenen Layers im Kartenausschnitt an.||
|[mapMarkerModul](#markdown-header-portalconfigmapmarkermodul)|nein|Object||Gibt an, ob der auf der Karte verwendete Marker-Pin verschiebbar sein soll, oder nicht.||

******

### Portalconfig.controls ###

|Name|Verpflichtend|Typ|Default|Beschreibung|
|----|-------------|---|-------|------------|
|attributions|nein|Boolean|false|Zeigt das vorhandene Attributions an.|
|fullScreen|nein|Boolean|false|Ermöglicht dem User die Darstellung im Vollbildmodus (ohne Tabs und Adressleiste) per Klick auf den Button. Ein erneuter Klick auf den Button wechselt wieder in den normalen Modus.|
|mousePosition|nein|Boolean|false|Die Koordination des Mauszeigers werden angeziegt.|
|orientation|nein|String|"none"|Orientation ist eine Funktion zur Standortbestimmung des Nutzers. Mögliche Werte sind none (Die Standortbestimmung ist deaktiviert.), *once* (Es wird einmalig beim Laden der Standort bestimmt und einmalig auf den Standort gezoomt.), *always* (Die Karte bleibt immer auf den Nutzerstandort gezoomt.)|
|poi|nein|Boolean|false|Zeigt eine Liste von Features in der Umgebung an. Funktioniert nur wenn die Standortbestimmung (orientation) aktiviert ist. |
|toggleMenu|nein|Boolean|false|Legt fest ob die Menüleiste ein- und ausgeblendet werden kann.|
|zoom|nein|Boolean|false|Legt fest, ob die Zoombuttons angezeigt werden sollen. |
|[mmlNewIssueButton](#markdown-header-portalconfig-mmlnewissuebutton)|nein|Object||Konfiguriert den Button zum Aufruf des MML-Assistenten |

**Beispiel controls:**


```
#!json

"controls": {
        "toggleMenu": true,
        "zoom": true,
        "orientation": "once",
        "poi": true,
        "fullScreen": true,
        "mousePosition": true
      }

```


******
### Portalconfig.mapView ###

|Name|Verpflichtend|Typ|Default|Beschreibung|
|----|-------------|---|-------|------------|
|backgroundImage|nein|String||Gibt den Hintergrund an, wenn keine Karte geladen ist.|
|startCenter|nein|Array|[565874, 5934140]|Die initiale Zentrumskoordinate.|

**Beispiel mapView:**


```
#!json
"mapView": {
        "backgroundImage": "/../../components/lgv-config/img/backgroundCanvas.jpeg",
        "startCenter": [561210, 5932600]
    }
```

******

### Portalconfig.menu ###
Hier können die Menüeinträge und deren Anordnung konfiguriert werden. Die Reihenfolge der Werkzeuge ergibt sich aus der Reihenfolge in der *Config.json*.

Auch diese Konfigurationen sind vom Typ *object*. Sie sind ebenfalls verlinkt und werden im Anschluss an diese Auflistung näher beschrieben.

|Name|Verpflichtend|Typ|Default|Beschreibung|
|----|-------------|---|-------|------------|
|[contact](#markdown-header-portalconfigmenucontact)|nein|Object||Das Modul *contact* gibt dem Anwender des Portals die Möglichkeit, eine Mail mit seiner Fehlermeldung/Rückmeldung/Anmerkung etc. an den Betreiber des Portals zu versenden.|
|[legend](#markdown-header-portalconfigmenulegend)|nein|Object||Die *Legende* kann wie jedes andere Werkzeug/Tool sowohl einzeln direkt unter *Menu*, als auch unter *Tools* konfiguriert werden.|
|[tools](#markdown-header-portalconfigmenutools)|nein|Object||Im Objekt *tools* werden die Werkzeuge, deren Reihenfolge und das Erscheinungsbild in der Menüleiste konfiguriert.|
|[tree](#markdown-header-portalconfigmenutree)|nein|Object||Unter *tree* wird der Themenbaum konfiguriert.|
|hide|nein|Boolean|false|Gibt an ob das Menu gezeichnet werden soll.

******

### Portalconfig.simpleLister ###
Listet die Features und deren Attribute eines angegebenen Layers auf, die sich im Kartenausschnitt befinden.

|Name|Verpflichtend|Typ|Default|Beschreibung|
|----|-------------|---|-------|------------|
|layerName|ja|String||Name des Layers, dessen Features angezeigt werden sollen.|
|errortxt|nein|String|"Keine Features im Kartenausschnitt"|Fehlermeldung die angezeigt werden soll, wenn sich keine Features im Kartenausschnitt befinden.|

******


### Portalconfig.mapMarkerModul ###
Gibt an ob der in der Karte verwendete Marker verschiebbar sein soll.

|Name|Verpflichtend|Typ|Default|Beschreibung|
|----|-------------|---|-------|------------|
|marker|nein|String||Bei "dragMarker" wird der Marker auf der Karte verschiebbar, bei allen anderen Eingaben wird ein Marker verwendet, der nicht verschiebbar ist.|
|visible|nein|Boolean|true|Gibt an ob der Marker beim initialen Laden der Karte sichtbar ist oder nicht.|

******

#### Portalconfig.menu.contact ####
Das Modul *contact* gibt dem Anwender des Portals die Möglichkeit, eine Mail mit seiner Fehlermeldung/Rückmeldung/Anmerkung etc. an den Betreiber des Portals zu versenden. 

Folgende Parameter stehen für die Konfiguration zur Verfügung:

|Name|Verpflichtend|Typ|Default|Beschreibung|
|----|-------------|---|-------|------------|
|[bcc](#markdown-header-portalconfigmenucontactbcc)|nein|Array [Object]|[]|Wie cc, nur sind diese Mailadressen nicht sichtbar für andere. Wird immer mit **email** und **name** erwartet.|
|[cc](#markdown-header-portalconfigmenucontactcc)|nein|Array [Object]|[]|Möglichkeit weitere Mailadressen zu konfigurieren, an die diese Mail versendet werden soll. Wird immer mit **email** und **name** erwartet.|
|ccToUser|nein|Boolean||Wenn hier true konfiguriert ist, wird eine Bestätigung mit Ticketnummer an die ins Formular eingetragene eMail-Adresse geschickt .|
|[from](#markdown-header-portalconfigmenucontactfrom)|nein|Array [Object]|[{"email": "lgvgeoportal-hilfe@gv.hamburg.de", "name": "LGVGeoportalHilfe"}]|Array für die Absender der Mail.|
|glyphicon|nein|String||Das Glyphicon (Bootstrap Class) als Logo.|
|includeSystemInfo||Boolean||Hier wird ausgewählt, ob vom User die Systeminfo in der Mail mit versandt werden soll.|
|name|nein|String||Name des Moduls in der Oberfläche.|
|serviceID||String||ID zum finden des EmailServices aus der [rest-services.json](rest-services.json.md).|
|subject|nein|String|"Supportanfrage zum Portal " + *portalTitle*|Hier kann ein String mit übergeben werden, der oben in der Betreffzeile der Mail auftaucht. Eine TicketId wird dem Betreff in jedem Fall vorangestellt.|
|textPlaceholder||String||Platzhalter für das Textfeld in dem der Anwender sein Anliegen eintragen kann.|
|[to](#markdown-header-portalconfigmenucontactfrom)|nein|Array [Object]|[{"email": "lgvgeoportal-hilfe@gv.hamburg.de", "name": "LGVGeoportalHilfe"}]|Array der Empfänger. Wird immer mit **email** und **name** erwartet.|

##### Portalconfig.menu.contact.bcc #####

|Name|Verpflichtend|Typ|Default|Beschreibung|
|----|-------------|---|-------|------------|
|email|nein|String||eMail-Adresse(n) Empfänger|
|name|nein|String||Name(n) Empfänger|

##### Portalconfig.menu.contact.cc #####

|Name|Verpflichtend|Typ|Default|Beschreibung|
|----|-------------|---|-------|------------|
|email|nein|String||eMail-Adresse(n) Empfänger|
|name|nein|String||Name(n) Empfänger|


##### Portalconfig.menu.contact.from #####

|Name|Verpflichtend|Typ|Default|Beschreibung|
|----|-------------|---|-------|------------|
|email|nein|String|"lgvgeoportal-hilfe@gv.hamburg.de"|eMail-Adresse Absender|
|name|nein|String|"LGVGeoportalHilfe"|Name Absender|

##### Portalconfig.menu.contact.to #####

|Name|Verpflichtend|Typ|Default|Beschreibung|
|----|-------------|---|-------|------------|
|email|nein|String|"lgvgeoportal-hilfe@gv.hamburg.de"|eMail-Adresse(n) Empfänger|
|name|nein|String|"LGVGeoportalHilfe"|Name(n) Empfänger|


**Beispiel contact:**

 
```
#!json

"contact": {
            "name": "Kontakt",
            "glyphicon": "glyphicon-envelope",
            "serviceID": "80001",
            "from": [
              {
                "email": "lgvgeoportal-hilfe@gv.hamburg.de",
                "name": "LGVGeoportalHilfe"
              }
            ],
            "to": [
              {
                "email": "lgvgeoportal-hilfe@gv.hamburg.de",
                "name": "LGVGeoportalHilfe"
               }
             ],
            "ccToUser": true,
            "textPlaceholder": "Bitte formulieren Sie Ihre Anfrage.",
            "includeSystemInfo": true
        }
      }

```

******
******

#### Portalconfig.menu.legend ####

|Name|Verpflichtend|Typ|Default|Beschreibung|
|----|-------------|---|-------|------------|
|glyphicon|nein|String||Das Glyphicon (Bootstrap Class) als Logo.|
|name|nein|String||Name des Reiters unter dem die Legende in der Menüleiste erscheint.|

**Beispiel legend:**


```
#!json

"legend": {
        "name": "Legende",
        "glyphicon": "glyphicon-book"
      }

```


******
******

#### Portalconfig.menu.tools ####
Im Objekt *tools* werden die Werkzeuge, deren Reihenfolge und das Erscheinungsbild in der Menüleiste konfiguriert.

|Name|Verpflichtend|Typ|Default|Beschreibung|
|----|-------------|---|-------|------------|
|[children](#markdown-header-portalconfigmenutoolschildren)|nein|Object||Objekte, die die Tools konfigurieren.|
|glyphicon|nein|String||Das Glyphicon (Bootstrap Class) als Logo.|
|name|nein|String||Name des Reiters unter dem der Baum in der Menüleiste erscheint.|

******

##### Portalconfig.menu.tools.children #####
Unter dem Objekt *children* werden die Werkzeuge und Funktionalitäten definiert welche im Portal verfügbar sein sollen. Folgende Werkzeuge stehen zur Verfügung:

|Name|Verpflichtend|Typ|Default|Beschreibung|
|----|-------------|---|-------|------------|
|[animation](#markdown-header-portalconfigmenutoolschildrenanimation)|nein|Object||Pendler Animation|
|[coord](#markdown-header-portalconfigmenutoolschildrencoord)|nein|Object||Koordinatenanzeige|
|[draw](#markdown-header-portalconfigmenutoolschildrendraw)|nein|Object||Zeichnen / Schreiben|
|[extendedFilter](#markdown-header-portalconfigmenutoolschildrenextendedfilter)|nein|Object||Erweiterter Filter|
|[featureLister](#markdown-header-portalconfigmenutoolschildrenfeaturelister)|nein|Object||WFS-Liste|
|[gfi](#markdown-header-portalconfigmenutoolschildrengfi)|nein|Object||Informationen abfragen|
|[kmlimport](#markdown-header-portalconfigmenutoolschildrenkmlimport)|nein|Object||KML Import|
|[measure](#markdown-header-portalconfigmenutoolschildrenmeasure)|nein|Object||Strecke / Fläche messen|
|[parcelSearch](#markdown-header-portalconfigmenutoolschildrenparcelsearch)|nein|Object||Flurstückssuche|
|[print](#markdown-header-portalconfigmenutoolschildrenprint)|nein|Object||Karte drucken|
|[routing](#markdown-header-portalconfigmenutoolschildrenrouting)|nein|Object||Routenplaner|
|[searchByCoord](#markdown-header-portalconfigmenutoolschildrencoord)|nein|Object||Koordinatensuche|
|[wfsFeatureFilter](#markdown-header-portalconfigmenutoolschildrenwfsfeaturefilter)|nein|Object||WFS Filter|

Werden mehrere Werkzeuge verwendet, so werden die Objekte mit Komma getrennt. Die Reihenfolge der Werkzeuge in der Konfiguration gibt die Reihenfolge der Werkzeuge im Portal wieder.

Die Werkzeuge können auch direkt in die Menüleiste eingebunden werden. Dazu muss lediglich das Objekt, welches ein Werkzeug definiert, unter *menu* eingetragen werden.   
Im folgenden Beispiel würde das Werkzeug *Strecke / Fläche messen* in der Menüleiste untergebracht, wohingegen das Werkzeug *Flurstückssuche* unter dem Reiter *Werkzeuge* positioniert würde. Dadurch ist es möglich, für das Portal wichtige, Funktionen sehr dominant zu positionieren.

**Beispiel eines Werkzeuges, das in der Menüleiste ganz oben angebracht ist:**

```
#!json

"menu" : {
	"tree" : {
		"name" : "Themen",
		"glyphicon" : "glyphicon-list",
		"isInitOpen" : true
	},
	"measure" : {
		"name" : "Strecke / Fläche messen",
		"glyphicon" : "glyphicon-resize-full",
		"onlyDesktop" : true
	},
	"tools" : {
		"name" : "Werkzeuge",
		"glyphicon" : "glyphicon-wrench",
		"children" : {
			"parcelSearch" : {
				"name" : "Flurstückssuche",
				"glyphicon" : "glyphicon-search",
				"serviceId" : "6",
				"StoredQueryID" : "Flurstueck",
				"configJSON":"/../../components/lgv-config/gemarkungen_hh.json",
				"parcelDenominator" : false
			},
			{...}
		}
	}
```



******
******

Darüber hinaus gibt es für die Werkzeuge weitere Konfigurationsmöglichkeiten, die im Folgenden erläutert werden.

###### Portalconfig.menu.tools.children.animation ######

|Name|Verpflichtend|Typ|Default|Beschreibung|
|----|-------------|---|-------|------------|
|glyphicon|nein|String||Das Glyphicon (Bootstrap Class) als Logo.|
|name|nein|String||Name des Werkzeuges im Menüeintrag.|
|onlyDesktop|nein|Boolean|false|Werkzeug wird nur in der Desktop-Variante des Portals angezeigt.|

******
******

###### Portalconfig.menu.tools.children.coord ######

|Name|Verpflichtend|Typ|Default|Beschreibung|
|----|-------------|---|-------|------------|
|glyphicon|nein|String||Das Glyphicon (Bootstrap Class) als Logo.|
|name|nein|String||Name des Werkzeuges im Menüeintrag.|
|onlyDesktop|nein|Boolean|false|Werkzeug wird nur in der Desktop-Variante des Portals angezeigt.|

******
******

###### Portalconfig.menu.tools.children.draw ######

|Name|Verpflichtend|Typ|Default|Beschreibung|
|----|-------------|---|-------|------------|
|glyphicon|nein|String||Das Glyphicon (Bootstrap Class) als Logo.|
|name|nein|String||Name des Werkzeuges im Menüeintrag.|
|onlyDesktop|nein|Boolean|false|Werkzeug wird nur in der Desktop-Variante des Portals angezeigt.|

******
******

###### Portalconfig.menu.tools.children.extendedFilter ######
Der *erweiterte Filter* ist ein Filter, der in der Lage ist, sämtliche in der Karte verfügbaren WFS nach allen möglichen Attributen und -werten zu filtern.
Dazu muss für jeden WFS-Layer in der Layer-Konfiguration dem Werkzeug erlaubt werden, den Layer auch zu verwenden. Dies geschieht über folgenden Parameter:

|Name|Verpflichtend|Typ|Default|Beschreibung|
|----|-------------|---|-------|------------|
|glyphicon|nein|String||Das Glyphicon (Bootstrap Class) als Logo.|
|name|nein|String||Name des Werkzeuges im Menüeintrag.|
|onlyDesktop|nein|Boolean|false|Werkzeug wird nur in der Desktop-Variante des Portals angezeigt.|


******
******

###### Portalconfig.menu.tools.children.featureLister ######
|Name|Verpflichtend|Typ|Default|Beschreibung|
|----|-------------|---|-------|------------|
|glyphicon|nein|String||Das Glyphicon (Bootstrap Class) als Logo.|
|lister|nein|Number|20|Gibt an wie viele Features mit jedem Klick geladen werden sollen.|
|name|nein|String||Name des Werkzeuges im Menüeintrag.|
|onlyDesktop|nein|Boolean|false|Werkzeug wird nur in der Desktop-Variante des Portals angezeigt.|


******
******

###### Portalconfig.menu.tools.children.gfi ######

|Name|Verpflichtend|Typ|Default|Beschreibung|
|----|-------------|---|-------|------------|
|glyphicon|nein|String||Das Glyphicon (Bootstrap Class) als Logo.|
|isActive|nein|Boolean|false|Werkzeug wird initial (beim Laden des Portals) aktiviert.|
|name|nein|String||Name des Werkzeuges im Menüeintrag.|
|onlyDesktop|nein|Boolean|false|Werkzeug wird nur in der Desktop-Variante des Portals angezeigt.|


******
******

###### Portalconfig.menu.tools.children.kmlimport ######

|Name|Verpflichtend|Typ|Default|Beschreibung|
|----|-------------|---|-------|------------|
|glyphicon|nein|String||Das Glyphicon (Bootstrap Class) als Logo.|
|name|nein|String||Name des Werkzeuges im Menüeintrag.|
|onlyDesktop|nein|Boolean|false|Werkzeug wird nur in der Desktop-Variante des Portals angezeigt.|

******
******

###### Portalconfig.menu.tools.children.measure ######

|Name|Verpflichtend|Typ|Default|Beschreibung|
|----|-------------|---|-------|------------|
|glyphicon|nein|String||Das Glyphicon (Bootstrap Class) als Logo.|
|name|nein|String||Name des Werkzeuges im Menüeintrag.|
|onlyDesktop|nein|Boolean|false|Werkzeug wird nur in der Desktop-Variante des Portals angezeigt.|

******
******



###### Portalconfig.menu.tools.children.parcelSearch ######
Flurstücksuche

|Name|Verpflichtend|Typ|Default|Beschreibung|
|----|-------------|---|-------|------------|
|configJSON|nein|String||Pfad zur *gemarkungen_xx.json* (weitere Infos finden Sie im Anschluss an diese Tabelle).|
|glyphicon|nein|String||Das Glyphicon (Bootstrap Class) als Logo.|
|name|nein|String||Name des Werkzeuges im Menüeintrag.|
|onlyDesktop|nein|Boolean|false|Werkzeug wird nur in der Desktop-Variante des Portals angezeigt.|
|parcelDenominator|nein|Boolean|false|Gibt an ob auch Flure mit an die *StoredQuery* übergeben werden.|
|serviceId|nein|String||ID, des Gazeteer-WFS. Wird in der [rest-services.json](rest-services.json.md) aufgelöst.|
|StoredQueryID|nein|String||Name der *StoredQuery*, die angesprochen werden soll.|

******
******


__Gemarkungen_xx.json__
Die *gemarkungen_xx.json* wird benötigt, um anhand des Gemarkungsnamens die ID der Gemarkung aufzulösen. 
Wird das Array für die Flure nicht gefüllt (Spezialfall für HH), so muss für das Werkzeug der Parameter *parcelDenominator* auf *false* gesetzt werden.
Wird *parcelDenominator* auf *true* gesetzt, so verlangt das Werkzeug auch „flur“-Einträge in der *gemarkung_xx.json*. In der Werkzeugoberfläche kann man nun die Flurstückssuche weiter auf die Flure einschränken.  
**ACHTUNG:** Dieses Tool und Teile der Konfiguration sind abhängig von den nutzerseitig angelegten Web-Diensten und Datenbankfunktionen.

**Beispiel einer *gemarkungs_xx.json* ohne „flur“:**


```
#!json

{
    "Allermöhe": { "id": "0601", "flur": []},
    "Alsterdorf": { "id": "0424", "flur": []},
    "Alt-Rahlstedt": { "id": "0544", "flur": []},
…
}


```

**Beispiel einer *gemarkungs_xx.json* mit „flur“:**


```
#!json

{
    "Allermöhe": { "id": "0601", "flur": [„Flur1“,“Flur2“]},
    "Alsterdorf": { "id": "0424", "flur": [„011“,“012“,“013“]},
    "Alt-Rahlstedt": { "id": "0544", "flur": [„025“,“026“,…]},
…
}

```

******
******

###### Portalconfig.menu.tools.children.print ######

|Name|Verpflichtend|Typ|Default|Beschreibung|
|----|-------------|---|-------|------------|
|glyphicon|nein|String||Das Glyphicon (Bootstrap Class) als Logo.|
|name|nein|String||Name des Werkzeuges im Menüeintrag.|
|onlyDesktop|nein|Boolean|false|Werkzeug wird nur in der Desktop-Variante des Portals angezeigt.|

******
******


###### Portalconfig.menu.tools.children.routing ######
Der Routenplaner ermöglicht ein Routing innerhalb des Portals. Folgende Parameter müssen am Werkzeug vorhanden sein:

|Name|Verpflichtend|Typ|Default|Beschreibung|
|----|-------------|---|-------|------------|
|autostart|nein|Boolean|false|Gibt an, ob das Routingmodul beim initialen Laden des Portals geöffnet ist.|
|bkgGeosearchID|nein|String||ID des GeoSuchdienstes des BKG. Anhand der vom Nutzer angeklickten finalen Adresse wandelt dieser Dienst den Namen in eine Koordinate um und gibt diese zurück. Die Koordinate wird benötigt, um den Routingdienst mit Daten zu füllen. Wird in der [rest-services.json](rest-services.json.md) aufgelöst.|
|bkgSuggestID|nein|String||ID des Vorschlagsdienstes des BKG. Der Dienst gibt eine Trefferliste möglicher Adressen zurück, die auf den Eingabestring des Nutzers passen. Werden als Dropdown-Menü dargestellt. Wird in der [rest-services.json](rest-services.json.md) aufgelöst.|
|glyphicon|nein|String||Das Glyphicon (Bootstrap Class) als Logo.|
|name|nein|String||Name des Werkzeuges im Menüeintrag.|
|onlyDesktop|nein|Boolean|false|Werkzeug wird nur in der Desktop-Variante des Portals angezeigt.|
|viomRoutingID|nein|String||ID des Routing-Dienstes. Der Dienst berechnet aufgrund von Start- und Ziel-Koordinate die schnellste Route. Wird in der [rest-services.json](rest-services.json.md) aufgelöst.|


******
******


###### Portalconfig.menu.tools.children.searchByCoord ######

|Name|Verpflichtend|Typ|Default|Beschreibung|
|----|-------------|---|-------|------------|
|glyphicon|nein|String||Das Glyphicon (Bootstrap Class) als Logo.|
|isActive|nein|Boolean|false|Werkzeug wird initial (beim Laden des Portals) aktiviert.|
|name|nein|String||Name des Werkzeuges im Menüeintrag.|
|onlyDesktop|nein|Boolean|false|Werkzeug wird nur in der Desktop-Variante des Portals angezeigt.|


******
******

###### Portalconfig.menu.tools.children.wfsFeatureFilter ######
Der WFS-Featurefilter ermöglicht das Filtern innerhalb eines Layers. Dabei kann nur nach den Attributen und -werten gefiltert werden, die in der WFS-Layer-Konfiguration in den [filterOptions](#markdown-header-filteroptions) definiert werden. 

|Name|Verpflichtend|Typ|Default|Beschreibung|
|----|-------------|---|-------|------------|
|glyphicon|nein|String||Das Glyphicon (Bootstrap Class) als Logo.|
|name|nein|String||Name des Werkzeuges im Menüeintrag.|
|onlyDesktop|nein|Boolean|false|Werkzeug wird nur in der Desktop-Variante des Portals angezeigt.|

**Beispiel tools:**


```
#!json

 "tools": {
        "name": "Werkzeuge",
        "glyphicon": "glyphicon-wrench",
        "children": {
          "parcelSearch": {
            "name": "Flurstückssuche",
            "glyphicon": "glyphicon-search",
            "serviceId": "6",
            "StoredQueryID": "Flurstueck",
            "configJSON": "/../../components/lgv-config/gemarkungen_hh.json",
            "parcelDenominator": false
          },
          "measure": {
            "name": "Strecke / Fläche messen",
            "glyphicon": "glyphicon-resize-full",
            "onlyDesktop": true
          },
          "coord": {
            "name": "Koordinaten abfragen",
            "glyphicon": "glyphicon-screenshot"
          },
          "gfi": {
            "name": "Informationen abfragen",
            "glyphicon": "glyphicon-info-sign",
            "isActive": true
          },
          "print": {
            "name": "Karte drucken",
            "glyphicon": "glyphicon-print"
          },
          "searchByCoord": {
            "name": "Koordinatensuche",
            "glyphicon": "glyphicon-record"
          },
          "kmlimport": {
            "name": "KML Import",
            "glyphicon": "glyphicon-import"
          },
          "wfsFeatureFilter": {
            "name": "Filter",
            "glyphicon": "glyphicon-filter"
          },
          "extendedFilter": {
            "name": "Erweiterter Filter",
            "glyphicon": "glyphicon-filter"
          },
          "routing": {
            "name": "Routenplaner",
            "glyphicon": "glyphicon-road",
            "viomRoutingID": "7",
            "bkgSuggestID": "4",
            "bkgGeosearchID": "5"
          },
          "draw": {
            "name": "Zeichnen / Schreiben",
            "glyphicon": "glyphicon-pencil"
          },
          "featureLister": {
              "name": "Liste",
              "glyphicon": "glyphicon-menu-hamburger",
              "lister": 10
          },
          "animation": {
            "name": "Pendler Animation",
            "glyphicon": "glyphicon-play-circle"
          }
        }
      }
```


******
******


#### Portalconfig.menu.tree ####
Unter *tree* wird der Themenbaum konfiguriert. 

|Name|Verpflichtend|Typ|Default|Beschreibung|
|----|-------------|---|-------|------------|
|glyphicon|nein|String||Das Glyphicon (Bootstrap Class) als Logo.|
|isInitOpen|nein|Boolean|false|Gibt an ob der Themenbaum beim initialen Laden des Portals geöffnet ist oder nicht.|
|name|nein|String||Name des Reiters unter dem der Baum in der Menüleiste erscheint.|

**Beispiel einer *tree*-Konfiguration:**


```
#!json

"tree": {
        "name": "Themen",
        "glyphicon": "glyphicon-list",
        "isInitOpen": true
      }

```

******
******




### Portalconfig.searchBar ###
Über die Suchleiste können verschiedene Suchen gleichzeitig angefragt werden. Auch diese Konfigurationen sind vom Typ *object*. Sie sind ebenfalls verlinkt und werden im Anschluss an diese Auflistung näher beschrieben.

|Name|Verpflichtend|Typ|Default|Beschreibung|
|----|-------------|---|-------|------------|
|[bkg](#markdown-header-portalconfigsearchbarbkg)|nein|Object||Ein deutschlandweites Ortsverzeichnis.|
|[gazetteer](#markdown-header-portalconfigsearchbargazetteer)|nein|Object||Das Ortsverzeichnis von Hamburg.|
|minChars||Number||Mindestanzahl an Zeichen im Suchstring, bevor die Suche initiiert wird.|
|placeholder|nein|String|"Suche"|Gibt an welche Themen gesucht werden können.|
|[specialWFS](#markdown-header-portalconfigsearchbarspecialwfs)|nein|Object||Durchsuchen von speziell definierten WFS-Layern.|
|[tree](#markdown-header-portalconfigsearchbartree)|nein|Object||Themensuche. Durchsucht den Themenbaum des Portals.|
|[visibleWFS](#markdown-header-portalconfigsearchbarvisiblewfs)|nein|Object||Durchsuchen von sichtbar geschalteten WFS-Layern.|
|zoomLevel||Number||Zoomstufe, in der das gesuchte Objekt angezeigt wird.|
|renderToDOM|nein|String||HTML ID an deren Objekt sich die Suchleiste rendern soll. Bei  "#searchbarInMap" wird die Suchleiste auf der Karte gezeichnet.|

******

#### Portalconfig.searchBar.bkg ####
Der Suchdienst des BKG ([Bundesamt für Kartographie und Geodäsie](https://www.bkg.bund.de/DE/Home/home.html)) wird angefragt.

|Name|Verpflichtend|Typ|Default|Beschreibung|
|----|-------------|---|-------|------------|
|epsg|nein|String|EPSG:25832|EPSG-Code des verwendeten Koordinatensystems.|
|extent|nein|Array[]|[454591, 5809000, 700000, 6075769]|Koordinatenbasierte Ausdehnung in der gesucht wird.|
|filter|nein|String|filter=(typ:*)|Filterstring|
|geosearchServiceId|ja|String||Gibt die ID für die URL in der [rest-services.json](rest-services.json.md) vor|
|minChars|nein|Number|3|Mindestanzahl an Zeichen im Suchstring, bevor die Suche initiiert wird.|
|score|nein|Number|0.6|Score-Wert, der die Qualität der Ergebnisse auswertet.|
|suggestCount|nein|Number|20|Anzahl der über *suggest* angefragten Vorschläge.|
|suggestServiceId|ja|String||Gibt die ID für die URL in der [rest-services.json](rest-services.json.md) vor.|

**Beispiel bkg:**


```
#!json

"bkg": {
            "minChars": 3,
            "suggestServiceId": "4",
            "geosearchServiceId": "5",
            "extent": [454591, 5809000, 700000, 6075769],
            "suggestCount": 10,
            "epsg": "EPSG:25832",
            "filter": "filter=(typ:*)",
            "score": 0.6
        }

```

******

#### Portalconfig.searchBar.gazetteer ####
Der Gazetteer-Dienst des LGV wird angefragt.

|Name|Verpflichtend|Typ|Default|Beschreibung|
|----|-------------|---|-------|------------|
|minChars|nein|Number|3|Mindestanzahl an Zeichen im Suchstring, bevor Suche initiiert wird.|
|searchDistricts|nein|Boolean|false|Soll nach Stadtteilen gesucht werden?|
|searchHouseNumbers|nein|Boolean|false|Sollen auch Hausnummern gesucht werden oder nur Straßen?|
|searchParcels|nein|Boolean|false|Soll nach Flurstücken gesucht werden?|
|searchStreetKey|nein|Boolean|false|Soll nach Strassenschlüsseln gesucht werden?|
|searchStreets|nein|Boolean|false|Soll nach Straßennamen gesucht werden? Voraussetzung für *searchHouseNumbers*.|
|serviceID|ja|String||Gibt die ID für die URL in der [rest-services.json](rest-services.json.md) vor.|
|url||String||URL des WFS-Dienstes|

**Beispiel gazetteer:**


```
#!json

"gazetteer": {
            "minChars": 3,
            "serviceId": "6",
            "searchStreets": true,
            "searchHouseNumbers": true,
            "searchDistricts": true,
            "searchParcels": true,
            "searchStreetKey": true
        }

```

******

#### Portalconfig.searchBar.specialWFS ####
Die definierten WFS-Dienste werden angefragt.

|Name|Verpflichtend|Typ|Default|Beschreibung|
|----|-------------|---|-------|------------|
|[definitions](#markdown-header-portalconfigsearchbarspecialwfsdefinitions)|ja|Array[Object]||Ein Array von Dienst-Objekten die angefragt werden (**url**: URL des WFS-Dienstes, **data**: String des WFS-Requests, **name**: Name der speziellen Filterfunktion (bplan, olympia, paralympia)). Bei mehreren Diensten, kommasepariert.|
|minChars|nein|Number|3|Mindestanzahl an Zeichen im Suchstring, bevor die Suche initiiert wird.|


##### Portalconfig.searchBar.specialWFS.definitions #####

|Name|Verpflichtend|Typ|Default|Beschreibung|
|----|-------------|---|-------|------------|
|data|ja|String||String des WFS-Requests|
|name|ja|String||Name der speziellen Filterfunktion (bplan, Olympia, paralympia)|
|url|ja|String||URL des WFS-Dienstes|

**Beispiel specialWFS:**


```
#!json

  "specialWFS": { 
            "minChar": 3,
            "definitions": [
                {
                    "url": "/geodienste_hamburg_de/HH_WFS_Bebauungsplaene",
                    "data": "service=WFS&request=GetFeature&version=2.0.0&typeNames=prosin_festgestellt&propertyName                    =planrecht",
                    "name": "bplan"
                },
                {
                    "url": "/geodienste_hamburg_de/HH_WFS_Bebauungsplaene",
                    "data": "service=WFS&request=GetFeature&version=2.0.0&typeNames=prosin_imverfahren&propertyName=                    plan",
                    "name": "bplan"
                }
            ]
        }
```

*****

#### Portalconfig.searchBar.tree ####
Alle Layer, die im Themenbaum des Portals sind, werden durchsucht.

|Name|Verpflichtend|Typ|Default|Beschreibung|
|----|-------------|---|-------|------------|
|minChars|nein|Number|3|Mindestanzahl an Zeichen im Suchstring, bevor die Suche initiiert wird.|

**Beispiel tree:**


```
#!json

 "tree": {
           "minChars": 3
         }
```


******

#### Portalconfig.searchBar.visibleWFS ####
Die Namen aller sichtbaren WFS-Dienste werden durchsucht.

|Name|Verpflichtend|Typ|Default|Beschreibung|
|----|-------------|---|-------|------------|
|minChars|nein|Number|3|Mindestanzahl an Zeichen im Suchstring, bevor die Suche initiiert wird.|

**Beispiel visibleWFS:**


```
#!json

"visibleWFS": {
           "minChars": 3
       }
```



******
******
******

## Themenconfig ##
Layer die in der [services.json](services.json.md) beschrieben sind, können über die *Themenconfig* in das Portal über ihre ID eingebunden und zusätzlich konfiguriert werden. Die Konfiguration spiegelt die Themenbaumstruktur im Portal wieder. Sie ist unterteilt in Hintergrundkarten und Fachdaten.


```
#!json

"Themenconfig":
  {
    "Hintergrundkarten": {},
    "Fachdaten": {}
  }

```

Der Abschnitt Hintergrundkarten hat als einziges Attribut Layer. Es ist ein Array bestehend aus Objekten, welche jeweils einen Layer in der Karte beschreiben. In Portalen mit dem Baumtyp *light*, werden die unter Hintergrundkarten beschriebenen Layer entsprechend der Konfigurationsreihenfolge von unten nach oben im Themenbaum einsortiert. Bei Portalen vom Baumtyp *custom* werden die Layer im Menüpunkt Themen/Hintergrundkarten, ebenfalls von unten nach oben, einsortiert.

******

### Layerkonfiguration Hintergrundkarten ###

|Name|Verpflichtend|Typ|Default|Beschreibung|
|----|-------------|---|-------|------------|
|id|ja|Array [String] oder String||ID aus [services.json](services.json.md).|
|name|nein|String|Name aus der [services.json](services.json.md)|Layername|
|transparency|nein|Number|0|Layertransparenz|
|visibility|nein|Boolean|false|Initiale Sichtbarkeit des Layers.|

**Beispiel Hintergrundkarten:**


```
#!json

"Hintergrundkarten":
    {
      "Layer": [
        {
          "id": "453",
          "transparency": "80"
        },
        {
          "id": "452"
        },
        {
          "id": ["713", "714", "715", "716"],
          "name": "Geobasiskarten (schwarz-weiß)",
          "visibility": true
        }
      ]
    }

```

Wenn es sich um Portale vom Baumtyp *custom* handelt, gibt es die zusätzliche Möglichkeit, Layer unterhalb von Fachdaten  in Ordner zusammenzufassen. Ordner können wiederum auch Ordner enthalten, so kann eine beliebig tiefe Verschachtelung entstehen. 

******

### Ordnerkonfiguration Fachdaten ###

|Name|Verpflichtend|Typ|Default|Beschreibung|
|----|-------------|---|-------|------------|
|Layer|nein|Array||Layerobjekte|
|Ordner|nein|Array||Ordnerobjekte|
|Titel|nein|String||Ordnername|

**Beispiel Ordnerkonfiguration Fachdaten:**


```
#!json

 "Fachdaten":
        {
          "Ordner": [
            {
              "Titel": "Lage und Gebietszugehörigkeit",
              "Ordner": [
                {
                  "Titel": "Überschwemmungsgebiete",
                  "Ordner": [
                    {
                      "Titel": "Überschwemmungsgebiete",
                      "Layer": [
                        {
                          "id": "1103",
                          "visibility": false
                        },
                        {
                          "id": "1104",
                          "visibility": false
                        }
                      ]
                    }
                  ],
                  "Layer": [
                    {
                      "id": "684",
                      "visibility": false
                    },              
                  ]
                }
              ],
 "Layer": [
                {
                  "id": "2427",
                  "visibility": false
                },
                {
                  "id": "2426",
                  "visibility": false
                },
                {
                  "id": "936",
                  "visibility": false,
                  "name": "Hafengebiet (§ 2 HafenEG)",
                  "metaName": "Hafengebiet (§ 2 HafenEG)"
                }
              ]
            }
         ]
       }


```

******

### Layerkonfiguration Fachdaten ###
Die folgenden Konfigurationsoptionen gelten sowohl für WMS-Layer als auch für WFS-FeatureTypes.

|Name|Verpflichtend|Typ|Default|Beschreibung|
|----|-------------|---|-------|------------|
|displayInTree|nein|Boolean|true|Soll der Layer im Themenbaum angezeigt werden?|
|gfiTheme|nein|String|Wert aus der [services.json](services.json.md) sonst *"default"*|Style für das GFI-Popover *(„default“* / *„table“*).|
|id|ja|Array [String] oder String||ID aus [services.json](services.json.md).| 
|layerAttribution|nein|HTML-String|Wert aus der [services.json](services.json.md)|Zusatzinformationen zum Layer, die in der Karte angezeigt werden sollen. Voraussetzung Control [attributions](#markdown-header-portalconfigcontrols) ist aktiviert.|
|legendURL|nein|Array[String] oder String|Wert aus der [services.json](services.json.md)|URL zur Legende|
|maxScale|nein|String|Wert aus der [services.json](services.json.md)|Höchste Maßstabszahl, bei der ein Layer angezeigt wird.|
|minScale|nein|String|Wert aus der [services.json](services.json.md)|Niedrigste Maßstabszahl, bei der ein Layer angezeigt wird.|
|name|nein|Array[String] oder String|Wert aus der [services.json](services.json.md)|Layername|
|transparency|nein|Number|0|Layertransparenz|
|visibility|nein|Boolean|false|Initiale Sichtbarkeit des Layers.|

**Folgende Layerkonfigurationen gelten nur für WMS:**

|Name|Verpflichtend|Typ|Default|Beschreibung|
|----|-------------|---|-------|------------|
|attributesToStyle|nein|Array[String]||Attribute über die gestlyt werden soll.|
|featureCount|nein|Number|1|Anzahl der Features beim GFI-Request.|
|geomType|nein|String||Geometrietyp des Layers, bisher nur Polygon.|
|infoFormat|nein|String|Wert aus der [services.json](services.json.md) sonst *„text/xml“*|Format für die GFI-Abfrage.|
|styleable|nein|Boolean||True -> Layer kann im Client anders gestylt werden. Zusätzlich müssen *geomType* und *attributesToStyle* gesetzt werden.|
|styles|nein|Array [String]||Nur bei WMS-Layern. Fragt dem WMS mit eingetragenem Styles-Eintrag ab.|

**Folgende Layerkonfigurationen gelten nur für WFS:**

|Name|Verpflichtend|Typ|Default|Beschreibung|
|----|-------------|---|-------|------------|
|clusterDistance|nein|Number||Werte > 0 nutzen Clustering. Radius in Px auf der Karte, in welchem alle Features zu einem einzigen Feature aggregiert werden.|
|extendedFilter|nein|Boolean||Um sämtliche verfügbare WFS zu filtern, muss für jeden WFS-Layer in der Layer-Konfiguration dem Werkzeug extendedFilter erlaubt werden, den Layer auch zu verwenden. Siehe [Portalconfig.menu.tools.children.extendedFilter](#markdown-header-PortalconfigmenutoolschildrenextendedFilter)|
|[filterOptions](#markdown-header-filteroptions)|nein|Object||Filtereinstellungen für diesen Layer, wird vom Tool  [wfsFeatureFilter](#markdown-header-portalconfigmenutoolschildrenwfsfeaturefilter) ausgewertet|
|mouseHoverField|nein|Array [String] oder String||Attributename, der beim MouseHover-Event als Tooltip angzeigt wird. Voraussetzung Control „Mousehover“ ist aktiviert (siehe [config.js](config.js.md)).|
|routable|nein|Boolean||true -> wenn dieser Layer beim der GFI-Abfrage als Routing Destination ausgewählt werden darf. Voraussetzung Routing ist konfiguriert.|
|searchField|nein|String||Attributname, über den die Suche die Featuers des Layers finden kann.|
|styleField|nein|String||Zusätzliches Feld für die Style-Zuweisung aus der [style.json](style.json.md).|
|styleId|ja|String||Weist dem Layer den Style aus der [style.json](style.json.md) zu.|
|styleLabelField|nein|String||Zusätzliches Feld für die Style-Zuweisung aus der [style.json](style.json.md).|


#### filterOptions ####
|Name|Verpflichtend|Typ|Default|Beschreibung|
|----|-------------|---|-------|------------|
|fieldName|ja|String||Attributname des WFS.|
|filterName|ja|String||Name des Filters im Werkzeug|
|filterString|ja|String||Mögliche Filterwerte, welche der Nutzer als Dropdown-Menü erhält.|
|filterType|ja|String||Name des zulässigen Filtertyps. Derzeit nur combo.|

**Beispiel Fachdaten:** 


```
#!json

“Layer”: [
   {
          "id": "2407",
          "visibility": false,
          "infoFormat": "text/html"
      },
    {
          "id": "1711",
          "styleId": "1711",
          "visibility": false,
          "layerAttribution": "<span>Attributierung für Fachlayer</span>",
          "mouseHoverField": ["name", "strasse"],
          "searchField": "name",
          "extendedFilter": true,
          "filterOptions": [
            {
              "fieldName": "teilnahme_geburtsklinik",
              "filterType": "combo",
              "filterName": "Geburtsklinik",
              "filterString": ["*", "Ja", "Nein"]
            },
            {
              "fieldName": "teilnahme_notversorgung",
              "filterType": "combo",
              "filterName": "Not- und Unfallversorgung",
              "filterString": ["*", "Ja", "Eingeschränkt", "Nein"]
            }
          ]
    }
]
```

>Zurück zur [Dokumentation Masterportal](doc.md).