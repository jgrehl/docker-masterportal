>**[Zurück zur Dokumentation Masterportal](doc.md)**.

>Wenn diese Seite nicht korrekt dargestellt wird, nutzen Sie bitte diesen Link: **[Alternative Config.json Dokumentation](https://www.masterportal.org/files/masterportal/html-doku/doc/latest/config.json.de.html)**

[TOC]

***

# config.json

Die *config.json* enthält die gesamte Konfiguration der Portal-Oberfläche. In ihr wird geregelt welche Elemente sich wo in der Menüleiste befinden, worauf die Karte zentriert werden soll und welche Layer geladen werden sollen. Hier geht es zu einem **[Beispiel](https://bitbucket.org/geowerkstatt-hamburg/masterportal/src/dev_vue/portal/basic/config.json)**.
Die config.json besteht aus der **[Portalconfig](#markdown-header-Portalconfig)** und der **[Themenconfig](#markdown-header-Themenconfig)**

**Beispiel**

```json
{
   "Portalconfig": {},
   "Themenconfig": {}
}
```

***

## Portalconfig
Im Abschnitt *Portalconfig* können folgende Eigenschaften konfiguriert werden:

1. Schaltflächen auf der Kartenansicht sowie mögliche Interaktionen (*controls*)
2. Informationen zu beliebigen Layern (*getFeatureInfo*)
3. Einträge im Mainmenu sowie Vorhandenheit jeweiliger Module und deren Reihenfolge (*mainMenu*)
4. Starteinstellungen der Kartenansicht (*mapView*)
5. Anzeige eines Tooltips von Features (*mouseHover*)
6. Konfiguration der Fußzeile (*portalFooter*)
7. Einträge im Secondarymenu sowie Vorhandenheit jeweiliger Module und deren Reihenfolge (*secondaryMenu*)
8. Konfiguration der Themenauswahl (*tree*)

Es existieren die im Folgenden aufgelisteten Konfigurationen:

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|
|controls|nein|**[controls](#markdown-header-portalconfigcontrols)**||Mit den Controls kann festgelegt werden, welche Interaktionen in der Karte möglich sein sollen.|false|
|getFeatureInfo|nein|**[getFeatureInfo](#markdown-header-portalconfiggetFeatureInfo)**||Mit der GetFeatureInfo(gfi) lassen sich Informationen zu beliebigen Layern anzeigen. Dabei werden bei einem WMS die Daten über die GetFeatureInfo geladen. Bei Vektordaten (WFS, Sensor, GeoJSON usw.) werden die angezeigten Attribute aus den Daten selbst verwendet.|false|
|mainMenu|nein|**[menu](#markdown-header-portalconfigmenu)**||Hier können die Menüeinträge im Mainmenu und deren Anordnung konfiguriert werden. Die Reihenfolge der Module ist identisch mit der Reihenfolge in der config.json (siehe **[Modules](#markdown-header-portalconfigmenumodules)**).|false|
|mapView|nein|**[mapView](#markdown-header-portalconfigmapview)**||Mit verschiedenen Parametern wird die Startansicht der Karte konfiguriert und der Hintergrund festgelegt, der erscheint wenn keine Karte geladen ist.|false|
|mouseHover|nein|**[mouseHover](#markdown-header-portalconfigmousehover)**||Aktiviert die MouseHover-Funktion für Vektorlayer, z.B. WFS oder GeoJSON. Für die Konfiguration pro Layer siehe **[Vector](#markdown-header-themenconfiglayervector)**.|false|
|portalFooter|nein|**[footer](#markdown-header-footer)**||Möglichkeit den Inhalt der Fußzeile des Portals zu konfigurieren.|false|
|secondaryMenu|nein|**[menu](#markdown-header-portalconfigmenu)**||Hier können die Menüeinträge im Secondarymenu und deren Anordnung konfiguriert werden. Die Reihenfolge der Module ist identisch mit der Reihenfolge in der config.json (siehe **[Modules](#markdown-header-portalconfigmenumodules)**).|false|
|tree|nein|**[tree](#markdown-header-portalconfigtree)**||Möglichkeit um Einstellungen für den Themenbaum vorzunehmen.|false|

**Beispiel**

```json
{
    "Portalconfig": {
        "controls": {},
        "getFeatureInfo": {},
        "mainMenu": {},
        "mapView": {},
        "mouseHover": {},
        "portalFooter": {},
        "secondaryMenu": {},
        "tree": {}
    }
}
```

***

### Portalconfig.controls
Mit den Controls kann festgelegt werden, welche Interaktionen in der Karte möglich sein sollen.

Controls können in der config.json in die Ebene "expandable" verschachtelt werden und sind somit nicht mehr in der Leiste an der Seite, sondern über den Button mit den drei Punkten aufklappbar.

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|
|backForward|nein|**[backForward](#markdown-header-portalconfigcontrolsbackforward)**|false|Zeigt Buttons zur Steuerung der letzten und nächsten Kartenansichten an.|false|
|expandable|nein|**[expandable](#markdown-header-portalconfigcontrols)**||Mit expandable werden Controls hinter einem Button mit drei Punkten versteckt und lassen sich bei Bedarf aufklappen.|false|
|freeze|nein|Boolean/**[freeze](#markdown-header-portalconfigcontrolsfreeze)**|false|Legt fest, ob ein "Ansicht sperren" Button angezeigt werden soll.|false|
|fullScreen|nein|Boolean/**[fullScreen](#markdown-header-portalconfigcontrolsfullscreen)**|false|Ermöglicht dem User die Darstellung im Vollbildmodus (ohne Tabs und Adressleiste) per Klick auf den Button. Ein erneuter Klick auf den Button wechselt wieder in den normalen Modus.|false|
|rotation|nein|**[rotation](#markdown-header-portalconfigcontrolsrotation)**|false|Control, das die aktuelle Rotation der Karte anzeigt. Per Klick kann die Maprotation wieder auf Norden gesetzt werden. Siehe auch unter `mapInteractions` in **[config.js.md](config.js.md)**.|false|
|startModule|nein|**[startModule](#markdown-header-portalconfigcontrolsstartModule)**|false|Zeigt Buttons für die konfigurierten Module an. Über diese lassen sich die jeweiligen Module öffnen und schließen.|false|
|tiltView|nein|Boolean/**[tiltView](#markdown-header-portalconfigcontrolstiltView)**|false|Zeigt zwei Buttons an, mit denen sich die Kamera in der 3D-Szene hoch- bzw. runterkippen lässt.|false|
|totalView|nein|Boolean/**[totalView](#markdown-header-portalconfigcontrolstotalView)**|false|Zeigt einen Button an, mit dem die Startansicht mit den initialen Einstellungen wiederhergestellt werden kann.|false|
|zoom|nein|Boolean/**[zoom](#markdown-header-portalconfigcontrolszoom)**|false|Legt fest, ob die Zoombuttons angezeigt werden sollen.|false|

**Beispiel**

```json
"controls": {
      "backForward": true,
      "fullScreen": true,
      "expandable": {
        "button3d": true
      }
    }
```

***

#### Portalconfig.controls.backForward
Das Attribut backForward kann vom Typ Boolean oder Object sein. Wenn es vom Typ Boolean ist, zeigt es die Buttons zur Steuerung der letzten und nächsten Kartenansichten mit den Defaulteinsellungen an. Ist es vom Typ Object, so gelten folgende Attribute

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|
|iconForward|nein|String|"skip-end-fill"|Über den Parameter iconForward kann ein anderes Icon für das Vorschalten der Kartenansicht verwendet werden.|false|
|iconBack|nein|String|"skip-start-fill"|Über den Parameter iconBack kann ein anderes Icon für das Zurückschalten der Kartenansicht verwendet werden.|false|

**Beispiel backForward als Object:**
```json
"backForward" : {
    "iconForward": "bi-skip-forward-fill",
    "iconBack": "bi-skip-backward-fill"
}
```

**Beispiel backForward als Boolean:**
```json
"backForward": true
```

***

#### Portalconfig.controls.button3d
|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|

***

#### Portalconfig.controls.freeze
Bildschirm wird gesperrt, sodass keine Aktionen mehr in der karte ausgeführt werden können. Legt fest, ob ein "Ansicht sperren" Button angezeigt werden soll.

Das Attribut freeze kann vom Typ Boolean oder Object sein. Wenn es vom Typ Boolean ist, zeigt es die Buttons an, die in den Defaulteinstellungen gesetzt sind. Ist es vom Typ Object, so gelten folgende Attribute:

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|
|icon|nein|String|"bi-lock"|Über den Parameter icon kann ein anderes Icon für das Control Freeze verwendet werden.|false|
|supportedDevices|nein|String|["Desktop"]|Geräte auf denen das Modul verwendbar ist und im Menü angezeigt wird.|false|
|supportedMapModes|nein|String|["2D", "3D"]|Karten modi in denen das Modul verwendbar ist und im Menü angezeigt wird.|false|

***

#### Portalconfig.controls.fullScreen
Ermöglicht dem User die Darstellung im Vollbildmodus (ohne Tabs und Adressleiste) per Klick auf den Button. Ein erneuter Klick auf den Button wechselt wieder in den normalen Modus.

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|
|iconArrow|nein|String|"arrows-fullscreen"|Über den Parameter iconArrow kann ein anderes Icon für den Button zum Einschalten des Vollbildmodus verwendet werden.|false|
|iconExit|nein|String|"fullscreen-exit"|Über den Parameter iconExit kann ein anderes Icon für den Button zum beenden des Vollbildmodus verwendet werden.|false|
|supportedDevices|nein|String|["Desktop"]|Geräte auf denen das Modul verwendbar ist und im Menü angezeigt wird.|false|
|supportedMapModes|nein|String|["2D", "3D"]|Karten modi in denen das Modul verwendbar ist und im Menü angezeigt wird.|false|

**Beispiel fullScreen als Object**

```json
"fullScreen" : {
    "iconArrow": "arrows-fullscreen",
    "iconExit": "fullscreen-exit"
},
```

**Beispiel fullScreen als Boolean**

```json
"fullScreen": true
```

***

#### Portalconfig.controls.orientation
|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|

***
#### Portalconfig.controls.rotation
Das Attribut rotation kann vom Typ Boolean oder Object sein. Wenn es vom Typ Boolean ist und auf true gesetzt ist, zeigt es das Rotation-Control nur an, wenn die Maprotation ungleich Norden/0 ist. Ist es vom Typ Object, so gelten folgende Attribute:

|Name|Verpflichtend|Typ|Default|Beschreibung|
|----|-------------|---|-------|------------|
|showAlways|nein|Boolean|false|Ist das Attribut auf true gesetzt, wird das Control permanent angezeigt. Per default wird es nur angezeigt, wenn die Maprotation ungleich 0/Norden ist.|

**Beispiel rotation als Object:**
```json
"rotation": {
    "showAlways": true
}
```

**Beispiel rotation als Boolean:**
```json
"rotation": true
```

***

#### Portalconfig.controls.startModule
Das Attribut startModule muss vom Typ Object sein. Es wird für jedes konfigurierte Modul ein Button angezeigt, über den sich das jeweilige Modul öffen und schließen lässt.

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|
|mainMenu|nein|**[mainMenu](#markdown-header-portalconfigcontrolsstartmodulemainMenu)**[]||Hier werden die Module zu denen jeweils ein Button angezeigt werden soll konfiguriert. Diese werden beim öffnen in dem `mainMenu` dargestellt.|false|
|secondaryMenu|nein|**[secondaryMenu](#markdown-header-portalconfigcontrolsstartmodulesecondaryMenu)**[]||Hier werden die Module zu denen jeweils ein Button angezeigt werden soll konfiguriert. Diese werden beim öffnen in dem `secondaryMenu` dargestellt.|false|
|supportedDevices|nein|String|["Desktop", "Mobile", "Table"]|Geräte auf denen das Modul verwendbar ist und im Menü angezeigt wird.|false|
|supportedMapModes|nein|String|["2D", "3D"]|Karten modi in denen das Modul verwendbar ist und im Menü angezeigt wird.|false|

**Beispiel**

```json
"startModule": {
    "mainMenu": [
        {
            "type": "scaleSwitcher"
        }
    ],
    "secondaryMenu": [
        {
            "type": "myModule"
        }
    ]
}
```

***

##### Portalconfig.controls.startModule.mainMenu
Hier werden die Module zu denen jeweils ein Button angezeigt werden soll konfiguriert. Diese werden beim Öffnen in dem `mainMenu` dargestellt.

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|
|type|nein|String||Type des Modules, das als Control dargestellt und bei Click im MainMenü geöffnet werden soll.|false|

**Beispiel**

```json
"mainMenu": [
    {
        "type": "scaleSwitcher"
    }
]
```

***

##### Portalconfig.controls.startModule.secondaryMenu
Hier werden die Module zu denen jeweils ein Button angezeigt werden soll konfiguriert. Diese werden beim Öffnen in dem `secondaryMenu` dargestellt.

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|
|type|nein|String||Type des Modules, das als Control dargestellt und bei Click im SecondaryMenü geöffnet werden soll.|false|#

**Beispiel**

```json
"secondaryMenu": [
    {
        "type": "scaleSwitcher"
    }
]
```

***

#### Portalconfig.controls.tiltView
Zeigt zwei Buttons an, mit denen sich die Kamera in der 3D-Szene hoch- bzw. runterkippen lässt.

Das Attribut tiltView kann vom Typ Boolean oder Object sein. Wenn es vom Typ Boolean ist, zeigt es die Buttons an, die in den Defaulteinstellungen gesetzt sind. Ist es vom Typ Object, so gelten folgende Attribute:

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|
|tiltDownIcon|nein|String|"bi-caret-down-square"|Über den Parameter tiltDownIcon kann ein anderes Icon für das runterkippen der Kamera verwendet werden.|false|
|tiltUpIcon|nein|String|"bi-caret-up-square"|Über den Parameter tiltUpIcon kann ein anderes Icon für das hochkippen der Kamera verwendet werden.|false|
|supportedDevices|nein|String|["Desktop"]|Geräte auf denen das Modul verwendbar ist und im Menü angezeigt wird.|false|
|supportedMapModes|nein|String|["3D"]|Karten modi in denen das Modul verwendbar ist und im Menü angezeigt wird.|false|

**Beispiel tiltView als Object**

```json
"tiltView" : {
    "tiltDownIcon": "bi-caret-down-square",
    "tiltUpIcon": "bi-caret-up-square",
},
```

**Beispiel tiltView als Boolean**

```json
"tiltView": true
```

***

#### Portalconfig.controls.totalView
Zeigt einen Button an, mit dem die Strtansicht mit den initialen Einstellungen wiederhergestellt werden kann.

Das Attribut totalView kann vom Typ Boolean oder Object sein. Wenn es vom Typ Boolean ist, zeigt es den Button an, der in den Defaulteinstellungen gesetzt ist. Ist es vom Typ Object, so gelten folgende Attribute:

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|
|icon|nein|String|"bi-skip-backward-fill"|Über den Parameter icon kann ein anderes Icon für das Zurückschalten zur Startansicht verwendet werden.|false|
|supportedDevices|nein|String|["Desktop"]|Geräte auf denen das Modul verwendbar ist und im Menü angezeigt wird.|false|
|supportedMapModes|nein|String|["2D", "3D"]|Karten modi in denen das Modul verwendbar ist und im Menü angezeigt wird.|false|

**Beispiel totalView als Object**

```json
"totalView" : {
    "icon": "bi-skip-forward-fill"
},
```

**Beispiel totalView als Boolean**

```json
"totalView": true
```

***

#### Portalconfig.controls.zoom
Legt fest, ob die Zoombuttons angezeigt werden sollen.

Das Attribut zoom kann vom Typ Boolean oder Object sein. Wenn es vom Typ Boolean ist, zeigt es die Buttons an, die in den Defaulteinstellungen gesetzt sind. Ist es vom Typ Object, so gelten folgende Attribute:

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|
|iconIn|nein|String|"bi-plus-lg"|Über den Parameter icon kann ein anderes Icon für hereinzoomen verwendet werden.|false|
|iconOut|nein|String|"bi-dash-lg"|Über den Parameter icon kann ein anderes Icon für herauszoomen verwendet werden.|false|
|supportedDevices|nein|String|["Desktop"]|Geräte auf denen das Modul verwendbar ist und im Menü angezeigt wird.|false|
|supportedMapModes|nein|String|["2D", "3D"]|Karten modi in denen das Modul verwendbar ist und im Menü angezeigt wird.|false|

**Beispiel zoom als Object**

```json
"zom" : {
    "iconIn": "bi-plus-lg",
    "iconOut": "bi-dash-lg"
},
```

**Beispiel zoom als Boolean**

```json
"zoom": true
```

***

### Portalconfig.getFeatureInfo
Zeigt Informationen zu einem abgefragten Feature ab, indem GetFeatureInfo-Requests oder GetFeature-Requests oder geladene Vektordaten abgefragt werden.

Bei allen GFI-Abfragen, außer dem direkten Beziehen von HTML, welches durch das Konfigurieren von `"text/html"` als `"infoFormat"` an einem WMS geschieht, wird das Zeichen "|" als Zeilenumbruch interpretiert. Es ist ebenso möglich `"\r\n"` oder `"\n"` zu verwenden.

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|
|centerMapToClickPoint|nein|Boolean|false|Wenn der Parameter auf true gesetzt wird, verschiebt sich die Karte beim Klick auf ein Feature so, dass das Feature im Mittelpunkt der sichtbaren Karte liegt.|false|
|coloredHighlighting3D|nein|**[coloredHighlighting3D](#markdown-header-portalconfiggetfeatureinfocoloredhighlighting3d)**||Regeldefinitionen zum Überschreiben des Highlightings von angeklickten 3D tiles.|false|
|hideMapMarkerOnVectorHighlight|nein|Boolean|false|Wenn Wert auf true gesetzt ist, wird der MapMarker beim VectorHighlighting nicht mit angezeigt. Gilt nur für das DetachedTemplate.|false|
|highlightVectorRules|nein|**[highlightVectorRules](#markdown-header-portalconfiggetfeatureinfohighlightvectorrules)**||Regeldefinitionen zum Überschreiben des Stylings von abgefragten Vektordaten.|false|
|icon|nein|String|"bi-info-circle-fill"|CSS Klasse des Icons, das vor dem GFI im Menu angezeigt wird.|false|
|menuSide|nein|String|"secondaryMenu"|Gibt an in welchem Menü die Informationen angezeigt werden sollen.|false|
|name|nein|String|"common:modules.getFeatureInfo.name"|Name des Modules im Menü.|false|

**Beispiel einer GetFeatureInfo Konfiguration**

```json
"getFeatureInfo": {
    "name":"Informationen abfragen",
    "icon":"bi-info-circle-fill",
    "coloredHighlighting3D": {
        "enabled": true,
        "color": "GREEN"
    },
    "highlightVectorRules": {
        "fill": {
            "color": [215, 102, 41, 0.9]
        },
        "image": {
            "scale": 1.5
        },
        "stroke": {
            "width": 4
        },
        "text": {
            "scale": 2
        }
    },
    "hideMapMarkerOnVectorHighlight": true
}
```

**Beispiel einer GetFeatureInfo Konfiguration zur Informationsabfrage von Features**

```json
"getFeatureInfo":{
    "name":"Informationen abfragen"
}
```

***

#### Portalconfig.getFeatureInfo.coloredHighlighting3D
Highlight Einstellungen von 3D Tiles.
Falls z. B. ein Gebäude per Linksklick selektiert wurde, wird es in der definierten Farbe gehighlighted.
Für mehr Informationen über die Farbmöglichkeiten: **[Color-documentation](https://cesium.com/learn/cesiumjs/ref-doc/Color.html)**

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|
|color|nein|String/String[]|"RED"|Color kann als Array oder Cesium.Color definiert werden(z. B. "GREEN" für Cesium.Color.GREEN)|false|
|enabled|nein|Boolean|true|False falls coloredHighlighting3D disabled ist.|false|

**Beispiel Array**

```json
"coloredHighlighting3D": {
    "enabled": true,
    "color": [0, 255, 0, 255]
}
```

**Beispiel Cesium.Color**

```json
"coloredHighlighting3D": {
    "enabled": true,
    "color": "GREEN"
}
```

***

#### Portalconfig.getFeatureInfo.highlightVectorRules
Liste der Einstellungen zum Überschreiben von Vektorstyles bei GetFeatureInfo Abfragen.

Hinweis: Das Highlighting funktioniert nur, wenn der Layer in der config.json über eine gültige StyleId verfügt!

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|
|fill|nein|**[fill](#markdown-header-portalconfiggetfeatureinfohighlightvectorrulesfill)**||Mögliche Einstellung: `color`|false|
|image|nein|**[image](#markdown-header-portalconfiggetfeatureinfohighlightvectorrulesimage)**||Mögliche Einstellung: `scale`|false|
|stroke|nein|**[stroke](#markdown-header-portalconfiggetfeatureinfohighlightvectorrulesstroke)**||Mögliche Einstellung: `width`|false|
|text|nein|**[text](#markdown-header-portalconfiggetfeatureinfohighlightvectorrulestext)**||Mögliche Einstellung: `scale`|false|

***

##### Portalconfig.getFeatureInfo.highlightVectorRules.fill
|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|
|color|nein|Float[]|[255, 255, 255, 0.5]|Mögliche Einstellung: color (RGBA)|false|

**Beispiel**

```json
"fill": {
    "color": [215, 102, 41, 0.9]
}
```

***

##### Portalconfig.getFeatureInfo.highlightVectorRules.image
|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|
|scale|nein|Float|1|Mögliche Einstellung: scale|false|

**Beispiel**

```json
"image": {
    "scale": 1.5
}
```

***

##### Portalconfig.getFeatureInfo.highlightVectorRules.stroke
|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|
|color|nein|Float[]|[255, 255, 255, 0.5]|Mögliche Einstellung: color (RGBA)|false|
|width|nein|Integer|1|Mögliche Einstellung: width|false|

**Beispiel**

```json
"stroke": {
    "width": 4,
    "color": [215, 102, 41, 0.9]
}
```

***

##### Portalconfig.getFeatureInfo.highlightVectorRules.text
|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|
|scale|nein|Float|1|Mögliche Einstellung: scale|false|

**Beispiel**

```json
"text": {
    "scale": 2
}
```

***

### Portalconfig.Menu
Hier können die Menüeinträge jeweils für das MainMenu (in der Desktopansicht links) und SecondaryMenu (in der Desktopansicht rechts) und deren Anordnung konfiguriert werden. Die Reihenfolge der Module ergibt sich aus der Reihenfolge in der *Config.json*.

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|
|expanded|nein|Boolean|false|Definiert ob das jeweilige Menü beim Starten des Portals aus- oder eingeklappt ist.|false|
|showDescription|nein|Boolean||Definiert ob eine Beschreibung zu den Modulen im jeweiligen Menü angezeigt werden soll.|false|
|searchBar|nein|**[searchBar](#markdown-header-portalconfigmenusearchbar)**||Über das Eingabefeld Suche können verschiedene Suchen gleichzeitig angefragt werden.|false|
|sections|nein|**[sections](#markdown-header-portalconfigmenusections)**[]||Unterteilung von Modulen im Menü.|false|
|title|nein|**[title](#markdown-header-portalconfigmenutitle)**||Der Titel und weitere Parameter die im Hauptmenü angezeigt werden können.|false|

***

#### Portalconfig.menu.searchBar
Konfiguration der Suchleiste. Es lassen sich verschiedene Suchdienste konfigurieren.

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|
|minCharacters|nein|Integer|3|Minimale Anzahl an Buchstaben, ab der die Suche startet.|false|
|placeholder|nein|String|"common:modules.searchBar.placeholder.address"|Placeholder für das Suchfeld.|false|
|searchInterfaces|nein|**[searchInterfaces](#markdown-header-portalconfigmenusearchbarsearchInterfaces)**[]||Schnittstellen zu Suchdiensten.|false|
|timeout|nein|Integer|5000|Timeout in Millisekunden für die Dienste Anfrage.|false|
|zoomLevel|nein|Integer|7|ZoomLevel, auf das die Searchbar maximal hineinzoomt.|false|

**Beispiel**

```json
{
    "searchBar" {
        "minCharacters": 3,
        "placeholder": "common:modules.searchBar.placeholder.address",
        "searchInterfaces": [
            {
                "type": "gazetteer",
                "serviceId": "6",
                "searchAddress": true,
                "searchStreets": true,
                "searchHouseNumbers": true,
                "searchDistricts": true,
                "searchParcels": true,
                "searchStreetKey": true
            }
        ],
        "timeout": 5000,
        "zoomLevel": 7
    }
}
```

***

##### Portalconfig.menu.searchBar.searchInterfaces
Definitionen der Suchschnittstellen.

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|
|gazetteer|nein|**[gazetteer](#markdown-header-portalconfigmenusearchbarsearchInterfacesgazetteer)**||Konfiguration des Gazetteer Suchdienstes.|false|

**Beispiel**

```json
"searchInterfaces": [
    {
        "type": "gazetteer",
        "serviceId": "6",
        "searchAddress": true,
        "searchStreets": true,
        "searchHouseNumbers": true,
        "searchDistricts": true,
        "searchParcels": true,
        "searchStreetKey": true
    }
]
```

***

###### Portalconfig.menu.searchBar.searchInterfaces.gazetteer
Konfiguration des Gazetteer Suchdienstes

**ACHTUNG: Backend notwendig!**
**Es wird eine Stored Query eines WFS mit vorgegebenen Parametern abgefragt.**

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|
|resultEvents|nein|**[resultEvents](#markdown-header-portalconfigmenusearchbarsearchInterfacesresultEvents)**|{"onClick": ["setMarker", "zoomToResult"], "onHover": ["setMarker"]}|Aktionen, die ausgeführt werden, wenn eine Interaktion, z. B. ein Hover oder ein Klick, mit einem Element der Ergebnisliste erfolgt. Folgende events sind möglich: "setMarker", "zoomToResult".|false|
|searchAddress|nein|Boolean||Gibt an, ob nach Adressen gesucht werden soll.|false|
|searchDistricts|nein|Boolean||Gibt an, ob nach Bezirken gesucht werden soll.|false|
|searchHouseNumbers|nein|Boolean||Gibt an, ob nach Straßen und Hausnummern gesucht werden soll. |false|
|searchParcels|nein|Boolean||Gibt an, ob nach Flurstücken gesucht werden soll.|false|
|searchStreetKey|nein|Boolean||Gibt an, ob nach Straßenschlüsseln gesucht werden soll.|false|
|searchStreets|nein|Boolean||Gibt an, ob nach Straßen gesucht werden soll. Vorraussetzung für **searchHouseNumbers**.|false|
|serviceId|ja|String||Id des Suchdienstes. Wird aufgelöst in der **[rest-services.json](rest-services.json.de.md)**.|false|
|showGeographicIdentifier|nein|Boolean|false|Gibt an ob das Attribut `geographicIdentifier` zur Anzeige des Suchergebnisses verwendet werden soll.|false|

**Beispiel**

```json
{
    "type": "gazetteer",
    "serviceId": "6",
    "searchAddress": true,
    "searchStreets": true,
    "searchHouseNumbers": true,
    "searchDistricts": true,
    "searchParcels": true,
    "searchStreetKey": true
}
```

***

##### Portalconfig.menu.searchBar.searchInterfaces.resultEvents
Aktionen, die ausgeführt werden, wenn eine Interaktion, z. B. ein Hover oder ein Klick, mit einem Element der Ergebnisliste erfolgt.

Folgende Events existieren. Welche Events konfiguriert werden können ist den Beschreibungen der jeweiligen Suchschnittstelle zu entnehmen:

- activateLayerInTopicTree: Aktiviert den gefunden layer im Themenbaum und in der Karte.
- addLayerToTopicTree: Fügt den gefundenen Layer zum Themenbaum und der Karte hinzu.
- highligtFeature: Hebt das Scuhergebniss auf der Karte hervor.
- openGetFeatureInfo: Öffnet die GetFeatureInfo zum Suchtreffer im Menü.
- setMarker: Es wird ein Marker in der Karte platziert.
- zoomToResult: Es wird zum Suchtreffer gezoomt.

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|
|onClick|nein|String[]||Aktionen die auf bei einem Klick auf Ein Suchergebniss ausgeführt werden.|false|
|onHover|nein|String[]||Aktionen die auf bei einem Hover auf Ein Suchergebniss ausgeführt werden.|false|

**Beispiel**

```json
"resultEvents": {
    "onClick": ["setMarker", "zoomToResult"],
    "onHover": ["setMarker"]
}
```

***

#### Portalconfig.menu.sections
Module lassen sich in Abschnitte (Sections) unterteilen. Im Menü werden Abschnitte mit einem horizontalen Strich unterteilt.

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|
|coordToolkit|nein|**[coordToolkit](#markdown-header-portalconfigmenusectionsmodulescoordtoolkit)**||Koordinatenabfrage: Werkzeug um Koordinaten und Höhe per Maus-Klick abzufragen: Bei Klick in die Karte werden die Koordinaten in der Anzeige eingefroren und können auch direkt in die Zwischenablage kopiert werden. Koordinatensuche: Über eine Eingabemaske können das Koordinatensystem und die Koordinaten eingegeben werden. Das Werkzeug zoomt dann auf die entsprechende Koordinate und setzt einen Marker darauf. Die Koordinatensysteme werden aus der config.js bezogen.|false|
|fileImport|nein|**[fileImport](#markdown-header-portalconfigmenusectionsmodulesfileImport)**||Import von Dateien des Typs *.kml, *.geojson und *. gpx. Über dieses Modul können solche Dateien importiert werden.|false|
|layerClusterToggler|nein|**[layerClusterToggler](#markdown-header-portalconfigmenusectionsmoduleslayerClusterToggler)**||Mit diesem Modul lassen sich Layer in Clustern gleichzeitig aktivieren/laden und deaktivieren.|false|
|layerSlider|nein|**[layerSlider](#markdown-header-portalconfigmenusectionsmoduleslayerslider)**||Mit dem Layerslider lassen sich beliebige Dienste in einer Reihenfolge abspielen. Zum Beispiel geeignet für Luftbilder aus verschiedenen Jahrgängen.|false|
|openConfig|nein|**[openConfig](#markdown-header-portalconfigmenusectionsopenConfig)**||Mit diesem Modul lässt sich eine Konfigurationsdatei (config.json) zur Laufzeit neu laden. Die Module und Karte werden an die neue Konfiguration angepasst.|false|
|print|nein|**[print](#markdown-header-portalconfigmenusectionsprint)**||Druckmodul mit dem die Karte als PDF exportiert werden kann.|false|
|scaleSwitcher|nein|**[scaleSwitcher](#markdown-header-portalconfigmenusectionsmodulescaleSwitcher)**||Modul zum Ändern des aktuellen Maßstabs der Karte.|false|
|selectFeatures|nein|**[selectFeatures](#markdown-header-portalconfigmenusectionsmodulesselectFeatures)**||Ermöglicht Auswahl von Features durch Ziehen einer Box und Einsehen derer GFI-Attribute.|false|
|shadow|nein|**[shadow](#markdown-header-portalconfigmenusectionsmodulesshadow)**||Konfigurationsobjekt für die Schattenzeit im 3D-Modus.|false|
|styleVT|nein|**[styleVT](#markdown-header-portalconfigmenusectionsmodulesstyleVT)**||Style-Auswahl zu VT-Diensten. Ermöglicht das Umschalten des Stylings eines Vector Tile Layers, wenn in der services.json mehrere Styles für ihn eingetragen sind.|false|

***

#### Portalconfig.menu.sections.modules

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|
|description|nein|String||Beschreibung zu einem Modul, die im Menü angezeigt wird.|false|
|icon|nein|String||Icon das im Menü vor dem Modul gezeigt wird. Zur Auswahl siehe **[Bootstrap Icons](https://icons.getbootstrap.com/)**|false|
|name|nein|String||Name des Modules im Menü|false|
|showDescription|nein|String||Gibt an ob die Beschreibung zum Modul im Menü angezeigt werden soll.|false|
|supportedDevices|nein|String||Geräte auf denen das Modul verwendbar ist und im Menü angezeigt wird.|false|
|supportedMapModes|nein|String||Karten modi in denen das Modul verwendbar ist und im Menü angezeigt wird.|false|
|type|nein|String||Der type des Moduls. Definiert welches Modul konfiguriert ist.|false|

***

##### Portalconfig.menu.sections.modules.addWMS

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|

***

##### Portalconfig.menu.sections.modules.baselayerSwitcher

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|

***

##### Portalconfig.menu.sections.modules.bufferAnalysis

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|

***

##### Portalconfig.menu.sections.modules.contact

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|

***

##### Portalconfig.menu.sections.modules.coordToolkit
Koordinaten-Werkzeug: um zusätzlich zu den 2 dimensionalen Koordinaten die Höhe über NHN anzuzeigen muß eine 'heightLayerId' eines WMS-Dienstes angegeben werden, der die Höhe liefert. Es wird das Format XML erwartet und das Attribut für die Höhen wird unter dem Wert des Parameters 'heightElementName' erwartet.

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|
|type|nein|String|"coordToolkit"|Der type des Moduls. Definiert welches Modul konfiguriert ist.|false|
|heightLayerId|nein|String||Koordinatenabfrage: Id des WMS-Layers der die Höhe im XML-Format liefert. Wenn nicht definiert, dann wird keine Höhe angezeigt.|false|
|heightElementName|nein|String||Koordinatenabfrage: Der Element-Name unter dem die Höhe in dem XML gesucht wird|false|
|heightValueWater|nein|String||Koordinatenabfrage: Der Wert im unter "heightElementName" definierten Element, der für eine nicht gemessene Höhe im Wasser-Bereich vom WMS geliefert wird, es wird der internationalisierte Text "Gewässerfläche, keine Höhen vorhanden" unter dem Schlüssel "common:modules.coordToolkit.noHeightWater" in der Oberfläche angezeigt. Wenn dieses Attribut nicht angegeben wird, dann wird der Text, den das WMS liefert angezeigt.|false|
|heightValueBuilding|nein|String||Koordinatenabfrage: Der Wert im unter "heightElementName" definierten Element, der für eine nicht gemessene Höhe im Gebäude-Bereich vom WMS geliefert wird, es wird der internationalisierte Text "Gebäudefläche, keine Höhen vorhanden" unter dem Schlüssel "common:modules.coordToolkit.noHeightBuilding" in der Oberfläche angezeigt. Wenn dieses Attribut nicht angegeben wird, dann wird der Text, den das WMS liefert angezeigt.|false|
|zoomLevel|nein|Number|7|Koordinatensuche: Gibt an, auf welches ZoomLevel gezoomt werden soll.|false|
|showCopyButtons|nein|Boolean|true|Schalter um die Buttons zum Kopieren der Koordinaten anzuzeigen oder auszublenden.|false|
|delimiter|nein|String|"Pipe-Symbol"|Trenner der Koordinaten beim Kopieren des Koordinatenpaares|false|
|heightLayerInfo|nein|String|null|Hier kann eine Erläuterung für die Höhe hinterlegt werden.|false|
|coordInfo|nein|[CoordInfo](#markdown-header-portalconfigmenusectionsmodulescoordtoolkitcoordInfo)|null|Hier kann ein Objekt mit Erläuterungen für die Koordinatenreferenzsysteme hinterlegt werden.|false|

**Beispiel**
```
#!json
{
    "type": "coordToolkit",
    "heightLayerId": "19173",
    "heightElementName": "value_0",
    "heightValueWater": "-20",
    "heightValueBuilding": "200",
    "zoomLevel": 5,
    "heightLayerInfo": "Grundlage der Höheninformation ist das \"Digitalge Höhenmodell Hamburg DGM 1\".",
    "showDescription": true,
    "description": "Bestimme Koordinaten aus der Karte oder suche nach Koordinaten.",
    "coordInfo": {
        "title": "Koordinatenreferenzsystem für 2D-Lageangaben, Erläuterungen",
        "explanations": [
        "ETRS89_UTM32, EPSG 4647 (zE-N): Bezugssystem ETRS89, Abbildungsvorschrift UTM, Zone 32",
        "EPSG 25832: Erklärung..."
        ]
    }
}
```

***

###### Portalconfig.menu.sections.modules.coordToolkit.coordInfo

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|
|title|nein|string||Überschrift für die Erläuterungen zu den Koordinatenreferenzsystemen.|false|
|explanations|nein|**[explanations](#markdown-header-portalconfigmenusectionsmodulescoordtoolkitcoordinfoexplanations)**[]||Array mit Erklärungen, aus denen eine Liste erstellt wird.|false|

###### Portalconfig.menu.tool.coordToolkit.coordInfo.explanations
Kann ein Array von Erläuterungen zu den Koordinatenreferenzsystemen enthalten aus denen eine Liste erstellt wird.

##### Portalconfig.menu.sections.modules.draw

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|

***

##### Portalconfig.menu.sections.modules.featureLister

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|

***

##### Portalconfig.menu.sections.modules.fileImport
Über dieses Modul können Dateien der Formate "*.kml", "*.geojson" und "*.gpx" importiert werden.

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|
|enableZoomToExtend|nein|Boolean|false|Legt fest, ob der Dateiname als Knopf angezeigt wird, welcher die Möglichkeit bietet, in die importierten Features hineinzuzoomen.|false|
|icon|nein|String|"bi-box-arrow-in-down"|Icon das im Menü vor dem Modul gezeigt wird. Zur Auswahl siehe **[Bootstrap Icons](https://icons.getbootstrap.com/)**|false|
|name|nein|String|"common:modules.fileImport.name"|Name des Modules im Menü|false|
|type|nein|String|"fileImport"|Der type des Moduls. Definiert welches Modul konfiguriert ist.|false|

**Beispiel**

```json
{
    "type": "fileImport",
    "enableZoomToExtend": true
}
```

***

##### Portalconfig.menu.sections.modules.filter

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|

***

##### Portalconfig.menu.sections.modules.layerClusterToggler
Mit diesem Modul lassen sich Layer in Clustern gleichzeitig aktivieren/laden und deaktivieren.

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|
|icon|nein|String|"bi-list"|Icon das im Menü vor dem Modul gezeigt wird. Zur Auswahl siehe **[Bootstrap Icons](https://icons.getbootstrap.com/)**|false|
|layerIdList|ja|String[]|[]|Auflistung der layerIds, der Layer die gemeinsam an- bzw. ausgeschaltet werden sollen.|false|
|name|nein|String|"common:modules.layerClusterToggler.name"|Name des Modules im Menü.|false|
|type|nein|String|"layerClusterToggler"|Der type des Moduls. Definiert welches Modul konfiguriert ist.|false|

**Beispiel**

```json
{
    "icon": "bi-list",
    "layerIdList": [
        "8712",,
        "8713.1",
        "8713.2",
        "8713.3"
    ],
    "name": "common:modules.layerClusterToggler.name",
    "type": "layerClusterToggler"
}
```

***

##### Portalconfig.menu.sections.modules.layerSlider
Der Layerslider ist ein Modul um verschiedene Layer in der Anwendung hintereinander an bzw. auszuschalten. Dadurch kann z.B. eine Zeitreihe verschiedener Zustände animiert werden.

Der Slider kann in der Oberfläche zwischen zwei Modi wechseln. Entweder als `"player"` mit Start/Pause/Stop-Buttons oder als `"handle"` mit einem Hebel. Bei "handle" wird die Transparenz der Layer zusätzlich mit angepasst.

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|
|icon|nein|String|"bi-collection-play"|Icon das im Menü vor dem Modul gezeigt wird. Zur Auswahl siehe **[Bootstrap Icons](https://icons.getbootstrap.com/)**|false|
|layerIds|ja|**[layerId](#markdown-header-portalconfigmenusectionsmoduleslayersliderlayerid)**[]|[]|Array von Objekten aus denen die Layerinformationen herangezogen werden.|false|
|name|nein|String|"common:modules.layerSlider.name"|Name des Modules im Menü|false|
|timeInterval|nein|Integer|2000|Zeitintervall in ms bis der nächste Layer angeschaltet wird.|false|
|title|nein|String|"common:modules.layerSlider.title"|Titel der im Modul vorkommt.|false|
|type|nein|String|"layerSlider"|Der type des Moduls. Definiert welches Modul konfiguriert ist.|false|

**Beispiel**

```json
"layerSlider": {
    "icon": "bi-hourglass-split",
    "layerIds": [
        {
            "title": "Dienst 1",
            "layerId": "123"
        },
        {
            "title": "Dienst 2",
            "layerId": "456"
        },
        {
            "title": "Dienst 3",
            "layerId": "789"
        }
    ],
    "name": "Zeitreihe",
    "timeInterval": 2000,
    "title": "Simulation von Beispiel-WMS"
}
```

***

###### Portalconfig.menu.sections.modules.layerSlider.layerIds
Definiert einen Layer für den Layerslider.

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|
|layerId|ja|String||Id des Layers, der im Portal angezeigt werden soll. ACHTUNG: Diese LayerId muss auch in der Themenconfig konfiguriert sein!|false|
|title|ja|String||Name des Layers, wie er im Portal angezeigt werden soll.|false|

**Beispiel**

```json
{
    "layerId": "123",
    "title": "Dienst 1"
}
```

***

##### Portalconfig.menu.sections.modules.legend

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|

***

##### Portalconfig.menu.sections.modules.measure

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|

***

##### Portalconfig.menu.sections.modules.news

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|

***

##### Portalconfig.menu.sections.modules.openConfig
Mit diesem Modul lässt sich eine Konfigurationsdatei (config.json) zur Laufzeit neu laden. Die Module und Karte werden an die neue Konfiguration angepasst.

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|
|icon|nein|String|"bi-upload"|Icon das im Menü vor dem Modul gezeigt wird. Zur Auswahl siehe **[Bootstrap Icons](https://icons.getbootstrap.com/)**|false|
|name|nein|String|"common:modules.openConfig.name"|Name des Modules im Menü|false|
|type|nein|String|"openConfig"|Der type des Moduls. Definiert welches Modul konfiguriert ist.|false|

**Beispiel**

```json
{
    "icon": "bi-upload",
    "name": "common:modules.openConfig.name",
    "type": "openConfig"
}
```

***

##### Portalconfig.menu.sections.modules.print
Druckmodul. Konfigurierbar für 2 Druckdienste: den High Resolution PlotService oder MapfishPrint 3.

**ACHTUNG: Backend notwendig!**

**Es wird mit einem [Mapfish-Print3](https://mapfish.github.io/mapfish-print-doc) oder einem HighResolutionPlotService im Backend kommuniziert.**

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|
|capabilitiesFilter|nein|**[capabilitiesFilter](#markdown-header-portalconfigmenusectionsmodulesprintcapabilitiesfilter)**||Filterung der Capabilities vom Druckdienst. Mögliche Parameter sind layouts und outputFormats.|false|
|currentLayoutName|nein|String|"A4 Hochformat"|Legt fest, welches Layout als Standardwert beim Öffnen des Druckwerkzeuges ausgewählt sein soll. Zum Beispiel "A4 Hochformat". Wenn das angegebene Layout nicht vorhanden ist oder keins angegeben wurde, dann wird das erste Layout der Capabilities verwendet.|false|
|defaultCapabilitiesFilter|nein|**[capabilitiesFilter](#markdown-header-portalconfigmenusectionsmodulesprintcapabilitiesfilter)**||Ist für ein Attribut kein Filter in capabilitiesFilter gesetzt, wird der Wert aus diesem Objekt genommen.|false|
|dpiForPdf|nein|Number|200|Auflösung der Karte im PDF.|false|
|filename|nein|String|"report"|Dateiname des Druckergebnisses.|false|
|icon|nein|String|"bi-printer"|Icon das im Menü vor dem Modul gezeigt wird. Zur Auswahl siehe **[Bootstrap Icons](https://icons.getbootstrap.com/)**|false|
|isLegendSelected|nein|Boolean|false|Gibt an, ob die Checkbox, zum Legende mitdrucken, aktiviert sein soll. Wird nur angezeigt wenn der Druckdienst (Mapfish Print 3) das Drucken der Legende unterstützt.|false|
|name|nein|String|"common:modules.print.name"|Name des Modules im Menü|false|
|overviewmapLayerId|nein|String||Über den Parameter layerId kann ein anderer Layer für die Overviewmap verwendet werden. Wird keine Id angegeben, wird der erste Layer der ausgewählten Hintergundkarten verwendet.|false|
|printAppCapabilities|nein|String|"capabilities.json"|Pfad unter welcher die Konfiguration des Druckdienstes zu finden ist.|false|
|printAppId|nein|String|"master"|Id der print app des Druckdienstes. Dies gibt dem Druckdienst vor welche/s Template/s er zu verwenden hat.|false|
|printMapMarker|nein|Boolean|false|Wenn dieses Feld auf true gesetzt ist, werden im Bildausschnitt sichtbare MapMarker mitgedruckt. Diese überdecken ggf. interessante Druckinformationen.|false|
|printService|nein|String|"mapfish"|Flag welcher Druckdienst verwendet werden soll. Bei "plotservice" wird der High Resolution PlotService verwendet, wenn der Parameter nicht gesetzt wird, wird Mapfish 3 verwendet.|false|
|printServiceId|ja|String||Id des Druckdienstes der verwendet werden soll. Wird in der rest-services.json abgelegt.|false|
|title|nein|String|"PrintResult"|Titel des Dokuments. Erscheint als Kopfzeile.|false|
|type|nein|String|"print"|Der type des Moduls. Definiert welches Modul konfiguriert ist.|false|

**Beispiel Konfiguration mit High Resolution PlotService**

```json
"print": {
    "name": "common:modules.print.name",
    "icon": "bi-printer",
    "type": "print",
    "printServiceId": "123456",
    "filename": "Ausdruck",
    "title": "Mein Titel",
    "printService": "plotservice",
    "printAppCapabilities": "info.json",
    "layoutOrder": [
        "Default A4 hoch",
        "Default A4 quer",
        "Default A3 hoch",
        "Default A3 quer",
    ]
}
```

**Beispiel Konfiguration mit MapfishPrint3**

```json
"print": {
    "name": "Karte drucken",
    "icon": "bi-printer",
    "type": "print",
    "printServiceId": "mapfish_printservice_id",
    "printAppId": "mrh",
    "filename": "Ausdruck",
    "title": "Mein Titel"
}
```

***

###### Portalconfig.menu.sections.modules.print.capabilitiesFilter
Liste von Layouts und Formaten, welche die Antwort vom Druckdienst in der jeweiligen Kategorie filtert.

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|
|layouts|nein|String[]||Liste von Layouts, welche in der Oberfläche angezeigt werden sollen.|false|
|outputFormats|nein|String[]||Liste von Formaten, welche in der Oberfläche angezeigt werden sollen.|false|

**Beispiel capabilitiesFilter:**

```json
"capabilitiesFilter": {
    "layouts": ["A4 Hochformat", "A3 Hochformat"],
    "outputFormats": ["PDF"]
}
```

***

##### Portalconfig.menu.sections.modules.routing

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|

***

##### Portalconfig.menu.sections.modules.scaleSwitcher
Modul, mit dem der aktuelle Maßstab der Karte geändert werden kann.

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|
|icon|nein|String|"bi-arrows-angle-contract"|Icon das im Menü vor dem Modul gezeigt wird. Zur Auswahl siehe **[Bootstrap Icons](https://icons.getbootstrap.com/)**|false|
|name|nein|String|"common:modules.scaleSwitcher.name"|Name des Modules im Menü|false|
|type|nein|String|"scaleSwitcher"|Der type des Moduls. Definiert welches Modul konfiguriert ist.|false|

**Beispiel**

```json
{
    "icon": "bi-arrows-angle-contract",
    "name": "common:modules.scaleSwitcher.name",
    "type": "scaleSwitcher"
}
```

***

##### Portalconfig.menu.sections.modules.selectFeatures
Erlaub das auswählen von Vektor Features, indem der Nutzer auf der Karte eine Auswahlbox aufziehen kann. Features innerhalb dieser Auwahl werden mit GFI Informationen angezeigt und es ist möglich, auf ein Feature zu zoomen. Zur Nutzung werden vektorbasierte WFS(❗) Dienste benötigt.

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|
|highlightVectorRulesPointLine|nein|**[highlightVectorRulesPointLine](#markdown-header-portalconfigmenusectionsmodulesselectfeatureshighlightvectorrulespointline)**||Angabe der Linienfarbe und -breite für Linien Features und der Füllfarbe und Skalierung für Punkte. Sowie optional eine Zoomstufe.|false|
|highlightVectorRulesPolygon|nein|**[highlightVectorRulesPolygon](#markdown-header-portalconfigmenusectionsmodulesselectfeatureshighlightvectorrulespolygon)**||Angabe der Füllfarbe, Kantenfarbe und -breite für das Hervorheben von Polygon Features. Sowie optional eine Zoomstufe.|false|
|icon|nein|String|"bi-hand-index"|Icon das im Menü vor dem Modul gezeigt wird. Zur Auswahl siehe **[Bootstrap Icons](https://icons.getbootstrap.com/)**|false|
|name|nein|String|"common:modules.selectFeatures.name"|Name des Modules im Menü|false|
|type|nein|String|"selectFeatures"|Der type des Moduls. Definiert welches Modul konfiguriert ist.|false|

**Beispiel**

```json
{
    "type": "selectFeatures",
    "highlightVectorRulesPolygon": {
        "fill": {
            "color": [255, 0, 255, 0.9]
        },
        "stroke": {
            "width": 4,
            "color": [0, 0, 204, 0.9]
        },
        "zoomLevel": 5
    },
    "highlightVectorRulesPointLine": {
        "fill": {
            "color": [255, 0, 255, 0.9]
        },
        "stroke": {
            "width": 8,
            "color": [255, 0, 255, 0.9]
        },
        "image": {
            "scale": 2
        },
        "zoomLevel": 5
    }
}
```

***

###### Portalconfig.menu.sections.modules.selectFeatures.highlightVectorRulesPointLine
Angabe der Linienfarbe und -breite für Linien Features und der Füllfarbe und Skalierung für Punkte. Sowie optional eine Zoomstufe.

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|
|fill|nein|**[fill](#markdown-header-portalconfigmenutoolselectfeatureshighlightvectorrulespointlinefill)**||Mögliche Einstellung: color|false|
|stroke|nein|**[stroke](#markdown-header-portalconfigmenutoolselectfeatureshighlightvectorrulespointlinestroke)**||Mögliche Einstellung: width|false|
|image|nein|**[image](#markdown-header-portalconfigmenutoolselectfeatureshighlightvectorrulespointlineimage)**||Mögliche Einstellung: scale|false|
|zoomLevel|nein|Integer|7|Zoomstufe, mögliche Einstellung: 0-9|false|

***

####### Portalconfig.menu.sections.modules.selectFeatures.highlightVectorRulesPointLine.fill
|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|
|color|nein|Float[]|[255, 255, 255, 0.5]|Mögliche Einstellung: color (RGBA)|false|

**Beispiel**

```json
"fill": {
    "color": [215, 102, 41, 0.9]
}
```

***

####### Portalconfig.menu.sections.modules.selectFeatures.highlightVectorRulesPointLine.stroke
|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|
|color|nein|Float[]|[255, 255, 255, 0.5]|Mögliche Einstellung: color (RGBA)|false|
|width|nein|Integer|1|Mögliche Einstellung: width|false|

**Beispiel**

```json
"stroke": {
    "width": 4 ,
    "color": [255, 0, 255, 0.9]
}
```

***

####### Portalconfig.menu.sections.modules.selectFeatures.highlightVectorRulesPointLine.image
|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|
|scale|nein|Integer|1.5|Mögliche Einstellung: scale|false|

**Beispiel**

```json
"image": {
    "scale": 2
    }
```

***

###### Portalconfig.menu.sections.modules.selectFeatures.highlightVectorRulesPolygon
Angabe der Füllfarbe, Kantenfarbe und -breite für das Hervorheben von Polygon Features. Sowie optional eine Zoomstufe.

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|
|fill|nein|**[fill](#markdown-header-portalconfigmenusectionsmodulesselectfeatureshighlightvectorrulespolygonfill)**||Mögliche Einstellung: color|false|
|stroke|nein|**[stroke](#markdown-header-portalconfigmenusectionsmoduleselectfeatureshighlightvectorrulespolygonstroke)**||Mögliche Einstellung: width|false|
|zoomLevel|nein|Integer|7|Zoomstufe, mögliche Einstellung: 0-9|false|

***

####### Portalconfig.menu.sections.modules.selectFeatures.highlightVectorRulesPolygon.fill
|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|
|color|nein|Float[]|[255, 255, 255, 0.5]|Mögliche Einstellung: color (RGBA)|false|

**Beispiel**

```json
"fill": {
    "color": [215, 102, 41, 0.9]
}
```

***

####### Portalconfig.menu.sections.modules.selectFeatures.highlightVectorRulesPolygon.stroke
|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|
|color|nein|Float[]|[255, 255, 255, 0.5]|Mögliche Einstellung: color (RGBA)|false|
|width|nein|Integer|1|Mögliche Einstellung: width|false|

**Beispiel**

```json
"stroke": {
    "width": 4 ,
    "color": [255, 0, 255, 0.9]
}
```

***

##### Portalconfig.menu.sections.modules.shadow
Das ShadowTool bietet eine Oberfläche zur Definition einer Zeitangabe. Über Slider und Datepicker können Zeitangaben angegeben werden. Die ausgewählte Zeitangabe dient dem Rendern der Schatten aller 3D-Objekte im 3D-Modus, indem der Sonnenstand simuliert wird. Durch Ziehen des Sliders oder Auswahl eines neuen Datums wird unmittelbar ein neuer Sonnenstand simuliert. Per default startet das Tool mit der aktuellen Zeitangabe, die über Parameter überschrieben werden kann.

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|
|icon|nein|String|"bi-lamp-fill"|Icon das im Menü vor dem Modul gezeigt wird. Zur Auswahl siehe **[Bootstrap Icons](https://icons.getbootstrap.com/)**|false|
|isShadowEnabled|nein|Boolean|false|Default Shadow-Wert. True um unmittelbar Shadow einzuschalten. False zum manuellen Bestätigen.|false|
|name|nein|String|"common:modules.shadow.name"|Name des Modules im Menü|false|
|shadowTime|nein|**[shadowTime](#markdown-header-portalconfigmenusectionsmodulesshadowshadowtime)**||Default-Zeitangabe, mit der das Shadowmodule startet. Erkennt "month", "day", "hour", "minute"|false|
|type|nein|String|"shadow"|Der type des Moduls. Definiert welches Modul konfiguriert ist.|false|

**Beispiel**

```json
{
    "isShadowEnabled": true,
    "shadowTime": {
        "month": "6",
        "day": "20",
        "hour": "13",
        "minute": "0"
    },
    "type": "shadow"
}
```

***

###### Portalconfig.menu.sections.modules.shadow.shadowTime
|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|
|month|nein|String||Monat|false|
|day|nein|String||Tag|false|
|hour|nein|String||Stunde|false|
|minute|nein|String||Minute|false|

**Beispiel**

```json
{
    "month": "6",
    "day": "20",
    "hour": "13",
    "minute": "0"
}
```

***

##### Portalconfig.menu.sections.modules.shareView

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|

***

##### Portalconfig.menu.sections.modules.styleVT
Das Modul ermöglicht das Umschalten des Stylings von Vector Tile Layers(❗), sofern in der services.json mehrere Styles für die entsprechende Layer eingetragen sind.

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|
|icon|nein|String|"bi-paint-bucket"|Icon das im Menü vor dem Modul gezeigt wird. Zur Auswahl siehe **[Bootstrap Icons](https://icons.getbootstrap.com/)**|false|
|name|nein|String|"common:modules.styleVT.name"|Name des Modules im Menü|false|
|type|nein|String|"styleVT"|Der type des Moduls. Definiert welches Modul konfiguriert ist.|false|

**Beispiel**

```json
{
    "icon": "bi-paint-bucket",
    "name": "common:modules.styleVT.name",
    "type": "styleVT"
}
```

***

##### Portalconfig.menu.sections.modules.wfsSearch

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|

***

##### Portalconfig.menu.sections.modules.wfst

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|

***

#### Portalconfig.menu.title
Im Menü kann der Portalname und ein Bild angezeigt werden.

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|
|link|nein|String||URL der externen Seite, auf die verlinkt wird.|false|
|logo|nein|String||URL zur externen Bilddatei. Wird kein logo gesetzt, so wird nur der Titel ohne Bild dargestellt.|false|
|text|nein|String||Name des Portals.|false|
|toolTip|nein|String||Tooltip, der beim Hovern über das Portallogo angezeigt wird.|false|

**Beispiel portalTitle**

```json
"title": {
    "text": "Master",
    "logo": "https://geodienste.hamburg.de/lgv-config/img/hh-logo.png",
    "link": "https://geoinfo.hamburg.de",
    "toolTip": "Landesbetrieb Geoinformation und Vermessung"
}
```

***

### Portalconfig.mapView
Mit verschiedenen Parametern wird die Startansicht der Karte konfiguriert und der Hintergrund festgelegt, der erscheint wenn keine Karte geladen ist.

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|

***

### Portalconfig.mouseHover
Aktiviert die MouseHover-Funktion für Vektorlayer, z.B. WFS oder GeoJSON. Für die Konfiguration pro Layer siehe **[Vector](#markdown-header-themenconfiglayervector)**.

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|
|infoText|nein|String|"common:modules.mouseHover.infoText"| Text der angezeigt wird, wenn die Feature die Anzahl von `numFeaturesToShow` übersteigen.|false|
|numFeaturesToShow|nein|Integer|2|Maximale Menge an Elementinformationen pro Tooltip; bei Überschreitung informiert ein Informationstext den Benutzer über den abgeschnittenen Inhalt.|false|

**Beispiel**

```json
"mouseHover": {
    "numFeaturesToShow": 1,
    "infoText": "Beispieltext"
}
```

***

### Portalconfig.portalFooter
Möglichkeit den Inhalt der Fußzeile des Portals zu konfigurieren.

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|

***

### Portalconfig.tree
Möglichkeit um Einstellungen für den Themenbaum vorzunehmen.

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|
|addLayerButton|nein|Boolean|false|Wenn true, dann wird ein Button zum Hinzufügen von Layern dargestellt. Im Themenbaum werden initial nur sichtbare Layer und Layer mit der property `showInLayerTree = true` dargestellt. Wenn false, dann werden alle konfigurierten Layer im Themenbaum angezeigt. Bei dem tree.type `auto` wird immer ein Hinzufügen-Button angezeigt.|false|
|categories|nein|**[categories](#markdown-header-portalconfigtreecategories)**||Konfiguration der Kategorien aus den Metadaten. Nur für den tree.type `auto`.|false|
|highlightedFeatures|nein|**[highlightedFeatures](#markdown-header-portalconfigtreehighlightedfeatures)**||Konfiguration zusätzlich zum Highlighting von Features.|false|
|layerIDsToIgnore|nein|String[]||Liste von `services.json`-Layer-Ids, die nicht im Baum und in der Karte angezeigt werden sollen. Nur für den tree.type `auto`.|false|
|layerIDsToStyle|nein|**[layerIDsToStyle](#markdown-header-portalconfigtreelayeridstostyle)**[]||Spezielle Implementierung für einen HVV-Dienst (Hamburger Verkehrsbetriebe). Enthält Objekte zur Abfrage verschiedener Stile einer Layer-ID. Nur für den tree.type `auto`.|true|
|layerPills|nein|**[layerPills](#markdown-header-portalconfigtreelayerpills)**||Konfiguration der LayerPills.|false|
|metaIDsToIgnore|nein|String[]||Alle in der `services.json` gefundenen Layer, die diesen Meta-IDs entsprechen, werden nicht im Baum und in der Karte angezeigt. Nur für den tree.type `auto`.|false|
|metaIDsToMerge|nein|String[]||Alle in der `services.json` gefundenen Layer, die diesen Meta-IDs entsprechen, werden zu einer einzigen Layer im Baum zusammengeführt. Nur für den tree.type `auto`.|true|
|type|nein|enum["auto"]||Der Themenbaum ist in der gleichen Struktur aufgebaut wie die **[Themenconfig](#markdown-header-themenconfig)**. Wenn der Typ `auto` konfiguriert ist, werden alle Ebenen aus der [services.json](services.json.md) im Baum angeboten, strukturiert durch ihre Metadaten (Geo-Online).|false|
|validLayerTypesAutoTree|nein|enum|["WMS", "SENSORTHINGS", "TERRAIN3D", "TILESET3D", "OBLIQUE"]|Layer Typen die bei dem tree.type `auto` verwendet werden sollen.|false|

**Beispiel type auto**

```json
{
    "tree": {
        "type": "auto",
        "validLayerTypesAutoTree": ["WMS", "WFS"],
        "layerIDsToIgnore": ["1912", "1913"],
        "metaIDsToIgnore": [
            "09DE39AB-A965-45F4-B8F9-0C339A45B154"
        ],
        "metaIDsToMerge": [
            "FE4DAF57-2AF6-434D-85E3-220A20B8C0F1"
        ],
        "layerIDsToStyle": [
        {
            "id": "1935",
            "styles": ["geofox_Faehre", "geofox-bahn", "geofox-bus", "geofox_BusName"],
            "name": ["Fährverbindungen", "Bahnlinien", "Buslinien", "Busliniennummern"],
            "legendURL": ["http://geoportal.metropolregion.hamburg.de/legende_mrh/hvv-faehre.png", "http://geoportal.metropolregion.hamburg.de/legende_mrh/hvv-bahn.png", "http://geoportal.metropolregion.hamburg.de/legende_mrh/hvv-bus.png", "http://87.106.16.168/legende_mrh/hvv-bus.png"]
        },
        "categories": [
        {
          "key": "kategorie_opendata",
          "name": "common:modules.layerTree.categoryOpendata",
          "active": true
        },
        {
          "key": "kategorie_inspire",
          "name": "common:modules.layerTree.categoryInspire"
        },
        {
          "key": "kategorie_organisation",
          "name": "common:modules.layerTree.categoryOrganisation"
        }
      ]
    }
}
```

**Beispiel kein type**

```json
{
    "tree": {
        "addLayerButton": true,
        "highlightedFeatures": {
            "active": false
        },
    }
}
```

***

#### Portalconfig.tree.categories
Konfiguration der Kategorien aus den Metadaten. Nur für den tree.type `auto`.

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|
|key|ja|String||Schlüssel der jeweiligen Kategorie in den Metadaten.|false|
|name|ja|String||Name der Kategorie.|false|
|active|nein|Boolean||Gibt an, ob diese Kategorie initial aktiv ist. Bei keiner Angabe, ist die 1. Kategorie initial aktiv.|false|

**Beispiel**

```json
 "categories": [
        {
          "key": "kategorie_opendata",
          "name": "common:modules.layerTree.categoryOpendata",
          "active": true
        },
        {
          "key": "kategorie_inspire",
          "name": "common:modules.layerTree.categoryInspire"
        },
        {
          "key": "kategorie_organisation",
          "name": "common:modules.layerTree.categoryOrganisation"
        }
      ]
```

***

#### Portalconfig.tree.highlightedFeatures
Konfiguration zusätzlich zum Highlighting von Features. Wenn mit dem Modul "Liste" oder "Features auswählen" mit "Auf dieses Feature zoomen" oder per Url-Parameter Features hervorgehoben werden, dann ist ein Layer mit diesen Features im Menü-Baum auswählbar.

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|
|active|nein|Boolean|false|Gibt an, ob dieses Feature aktiv ist.|false|
|layerName|nein|String|"common:tree.selectedFeatures"|Name der erzeugten Layer mit den hervorgehobenen Features. Der Name enthält zusätzlich den Namen des Moduls mit dem gearbeitet wurde.|true|

**Beispiel**

```json
"highlightedFeatures": {
    "active": false,
    "layerName": "Ausgewählte Features"
},
```

***

#### Portalconfig.tree.layerIDsToStyle
Kombiniert den style von mehreren Layern, Namen  und Legenden.

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|
|id|nein|String||a `services.json` layer's id|false|
|styles|nein|String/String[]||Zu verwendender Stil als String; wenn mehrere Stile verwendet werden sollen, werden sie in einem Array aufgeführt.|false|
|name|nein|String/String[]||Zu verwendender Name als String; wenn mehrere Namen verwendet werden sollen, werden sie in einem Array aufgelistet.|false|
|legendUrl|nein|String/String[]||URL des Legendenbildes als String ; wenn mehrere Legendenbilder verwendet werden sollen, werden ihre URLs in einem Array aufgelistet.|false|

**Beispiel:**

```json
{
    "layerIDsToStyle": [
        {
            "id": "1935",
            "styles": ["geofox_Faehre", "geofox-bahn", "geofox-bus", "geofox_BusName"],
            "name": ["Fährverbindungen", "Bahnlinien", "Buslinien", "Busliniennummern"],
            "legendURL": ["http://geoportal.metropolregion.hamburg.de/legende_mrh/hvv-faehre.png", "http://geoportal.metropolregion.hamburg.de/legende_mrh/hvv-bahn.png", "http://geoportal.metropolregion.hamburg.de/legende_mrh/hvv-bus.png", "http://87.106.16.168/legende_mrh/hvv-bus.png"]
        }
    ]
}
```

***

#### Portalconfig.tree.layerPills
Konfiguration der LayerPills.

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|
|active|nein|Boolean|false|Gibt an, ob dieses Feature aktiv ist.|false|
|mobileOnly|nein|Boolean|false|Gibt an, ob dieses Feature nur auf kleinen Bildschirmen aktiv ist.|false|

**Beispiel**

```json
"layerPills": {
    "active": true,
    "mobileOnly": true
    }
```

***

## Themenconfig
Die Themenconfig definiert, welche Inhalte an welcher Stelle im Themenbaum angezeigt werden. Es können folgende Eigenschaften konfiguriert werden:

1. Layer die Hintergrundkarten beinhalten (*Baselayer*)
2. Layer die Fachdaten beinhalten (*Fachdaten*)

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|
|Baselayer|nein|**[Baselayer](#markdown-header-themenconfigbaselayer)**||Layer die Hintergrundkarten beinhalten.|false|
|Fachdaten|nein|**[Fachdaten](#markdown-header-themenconfigfachdaten)**||Layer die Fachdaten beinhalten.|false|

**Beispiel**

```json
{
    "Themenconfig": {
        "Baselayer": {},
        "Fachdaten": {}
    }
}
```

***

### Themenconfig.Baselayer
Hier werden Layer definiert, die als Hintergrundkarten angezeigt werden sollen.

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|
|elements|nein|**[elements](#markdown-header-themenconfigelements)**[]||Definition der Layer die im Themenbaum als Hintergrudnkarten angezeigt werden sollen.|false|

**Beispiel**

```json
{
    "Themenconfig": {
        "Baselayer": {}
    }
}
```

***

### Themenconfig.Fachdaten
Hier werden Layer oder Ordner mit Layern definiert, die als Fachdaten angezeigt werden sollen.

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|
|elements|nein|**[elements](#markdown-header-themenconfigelements)**[]||Definition der Layer oder Ordner die im Themenbaum als Fachdaten angezeigt werden sollen.|false|

**Beispiel**

```json
{
    "Themenconfig": {
        "Fachdaten": {}
    }
}
```

***

### Themenconfig.elements
Hier werden Layer oder Ordner definiert. Ordner können **[elements](#markdown-header-themenconfigelements)** mit Ordner oder Layern enthalten.

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|
|name|nein|String|""|Name des Layers oder Ordners.|false|
|type|nein|String|"layer"|Typ des Elements: "layer" für Layer oder "folder" für Ordner|false|
|elements|nein|**[elements](#markdown-header-themenconfigelements)**[]||Nächste Ebene mit Layern oder Ordnern unter dem type `folder`.|false|

**Beispiel Baselayer**

```json
{
    "Themenconfig": {
        "Baselayer": {
            "elements": [
                {
                    "id": "123"
                }
            ]
        }
    }
}
```

**Beispiel Fachdaten**

```json
{
    "Themenconfig": {
        "Fachdaten": {
            "elements": [
                {
                    "id": "123",
                    "type": "layer"
                }
            ]
        }
    }
}
```

**Beispiel mit Ordnern, die Layer enthalten**
```json
{
"elements": [
        {
        "name": "Ordner Ebene 1",
        "type": "folder",
        "elements": [
                {
                "name": "Ordner Ebene 2",
                "type": "folder",
                "elements": [
                        {
                            "id": "2431"
                        },
                        {
                            "id": "2430"
                        },
                        {
                            "id": "2429"
                        },
                        {
                            "name": "Ordner Ebene 3",
                            "type": "folder",
                            "elements": [
                                {
                                    "id": "1103"
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
}
```
***
### Themenconfig.elements.layers
Hier werden Layer verschiedenen Typs konfiguriert. Layer können auf viele verschiedene Arten konfiguriert werden. Ein Großteil der Attribute ist in der **[services.json](services.json.de.md)** definiert, kann jedoch hier am Layer überschrieben werden. 
Neben diesen Attributen gibt es auch Typ-spezifische Attribute für die verschiedenen Layer Typen.

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|
|id|ja|String/String[]||Id des Layers. In der **[services.json](services.json.de.md)** werden die ids aufgelöst und die notwendigen Informationen herangezogen. ACHTUNG: Hierbei ist wichtig, dass die angegebenen ids dieselbe URL ansprechen, also den selben Dienst benutzen. Bei Konfiguration eines Arrays von Ids ist die Angabe der minScale und maxScale in der services.json für jeden Layer notwendig.|false|
|name|nein|String||Name des Layers.|false|
|type|nein|String|"layer"|Typ des Elements Layer: "layer"|false|
|transparency|nein|Integer|0|Transparenz des Layers.|false|
|visibility|nein|Boolean|false|Sichtbarkeit des Layers. Wenn true, dann wird der Layer initial im Themenbaum angezeigt.|false|
|styleId|ja|String||Id die den Style definiert. Id wird in der **[style.json](style.json.md)** aufgelöst.|false|
|autoRefresh|nein|Integer||Automatischer Reload des Layers. Angabe in ms. Minimum ist 500.|false|
|urlIsVisible|nein|Boolean|true|Anzeige, ob die URL in der Layerinformation angezeigt werden soll.|false|
|renderer|nein|String|"default"|Render-Pipeline für die Darstellung ("default" oder "webgl")(nur für Vektordaten "GeoJSON", "WFS", "OAF")"webgl" ist derzeit als experimentell einzustufen.|false|
|isPointLayer|nein|Boolean|false|Anzeige, ob der (Vektor)-Layer nur aus Punkt-Features besteht (nur relevant für WebGL Rendering))|false|
|showInLayerTree|nein|Boolean|false|Wenn true, dann wird der Layer initial im Themenbaum angezeigt. Wenn portalConfig.tree.addLayerButton nicht konfiguriert ist, dann hat dieses Attribut keinen Effekt.|false|

**Beispiel**
```json
{
"elements": [
          {
          "id": "2",
          "name": "Beispiel Layer",
          "typ": "WMS",
          "visibility": false,
          "styleId": "3"
        }
    ]
}
```
**Beispiel mit einem Array von Ids**
```json
{
"elements": [
        {
            "id": ["123", "456", "789"],
            "name": "Mein Testlayer"
        }
    ]
}
```
***
#### Themenconfig.elements.layers.Vector
Hier werden Vector typische Attribute aufgelistet. Vector Layer sind vpm Typ **[WFS](#markdown-header-themenconfigelementslayerswfs)**, GeoJSON (nur in EPSG:4326), **[SensorLayer](sensorThings.de.md)**, und Vector Tile Layer.

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|--------|----|-------|-----------|------|
|searchField|nein|String||Attributname nach dem die Searchbar diesen Layer durchsucht.|false|
|mouseHoverField|nein|String/String[]||Attributname oder Array von Attributnamen, die angezeigt werden sollen, sobald der User mit der Maus über ein Feature hovert.|false|
|||||||

**Beispiel**
```json
{
"elements": [
          {
          "id": "22078",
          "name": "Bewohnerparkgebiete Hamburg",
          "typ": "WFS",
          "visibility": false,
          "styleId": "22078",
          "styleField": "bewirtschaftungsart",
          "searchField": "bwp_name",
          "mouseHoverField": [
            "bwp_name",
            "bewirtschaftungsart"
          ]
        }
    ]
}
```
***
##### Themenconfig.elements.layers.Vector.WFS
Attribute für die WFS Suche bei highlightFeaturesByAttribute. Für die Aufrufparameter siehe **[urlParameter](urlParameter.md)**.
```
Beispiel-Aufrufe:
?api/highlightFeaturesByAttribute=1&wfsId=1&attributeName=DK5&attributeValue=valueToSearchFor&attributeQuery=isequal
?api/highlightFeaturesByAttribute=123&wfsId=1711&attributeName=name&attributeValue=Helios%20ENDO-Klinik%20Hamburg&attributeQuery=IsLike
?api/highlightFeaturesByAttribute=123&wfsId=2003&attributeName=gebietsname&attributeValue=NSG%20Zollenspieker&attributeQuery=isequal
?api/highlightFeaturesByAttribute=123&wfsId=2928&attributeName=biotop_nr&attributeValue=279&attributeQuery=isLike
```

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|--------|----|-------|-----------|------|
|featurePrefix|ja|String||Suchprefix für den typename bei der WFS Suche - z.Bsp. app:.|true|
|wildCard|ja|String||Das zu verwendende Zeichen für das Jokerzeichen - z.Bsp. %|true|
|singleChar|ja|String||Das Zeichen für den singleChar WFS parameter - z.Bsp. #|true|
|escapeChar|ja|String||Das Zeichen für den escapeChar WFS parameter - z.Bsp. \||true|
|valueDelimiter|nein|String||Das Trennzeichen für die Werte in attributeValue bei der isIn Suche, Default=Semikolon|true|

**Example**

```json
{
    "id": "1",
    "visibility": false,
    "name": "Tierarten invasiv",
    "featurePrefix": "app:",
    "wildCard": "%",
    "singleChar": "#",
    "escapeChar": "!"
}
```

***