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
5. Konfiguration der Fußzeile (*portalFooter*)
6. Einträge im Secondarymenu sowie Vorhandenheit jeweiliger Module und deren Reihenfolge (*secondaryMenu*)
7. Konfiguration der Themenauswahl (*tree*)

Es existieren die im Folgenden aufgelisteten Konfigurationen:

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|
|controls|nein|**[controls](#markdown-header-portalconfigcontrols)**||Mit den Controls kann festgelegt werden, welche Interaktionen in der Karte möglich sein sollen.|false|
|getFeatureInfo|nein|**[getFeatureInfo](#markdown-header-portalconfiggetFeatureInfo)**||Zeigt Informationen zu einem abgefragten Feature ab, indem GetFeatureInfo-Requests oder GetFeature-Requests oder geladene Vektordaten abgefragt werden.|false|
|mainMenu|nein|**[menu](#markdown-header-portalconfigmenu)**||Hier können die Menüeinträge im Mainmenu und deren Anordnung konfiguriert werden. Die Reihenfolge der Module ist identisch mit der Reihenfolge in der config.json (siehe **[Modules](#markdown-header-portalconfigmenumodules)**).|false|
|mapView|nein|**[mapView](#markdown-header-portalconfigmapview)**||Mit verschiedenen Parametern wird die Startansicht der Karte konfiguriert und der Hintergrund festgelegt, der erscheint wenn keine Karte geladen ist.|false|
|portalFooter|no|**[footer](#markdown-header-footer)**||Möglichkeit den Inhalt der Fußzeile des Portals zu konfigurieren.|false|
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
        "portalFooter": {},
        "Secondarymenu": {},
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

***

#### Portalconfig.controls.backForward
|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|

***

#### Portalconfig.controls.button3d
|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|

***

#### Portalconfig.controls.freeze
|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|

***

#### Portalconfig.controls.fullScreen
|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|

***

#### Portalconfig.controls.orientation
|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|

***

#### Portalconfig.controls.startModule
|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|

***

#### Portalconfig.controls.totalView
|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|

***

#### Portalconfig.controls.zoom
|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|

***

### Portalconfig.getFeatureInfo
Zeigt Informationen zu einem abgefragten Feature ab, indem GetFeatureInfo-Requests oder GetFeature-Requests oder geladene Vektordaten abgefragt werden.

Bei allen GFI-Abfragen, außer dem direkten Beziehen von HTML, welches durch das Konfigurieren von `"text/html"` als `"infoFormat"` an einem WMS geschieht, wird das Zeichen "|" als Zeilenumbruch interpretiert. Es ist ebenso möglich `"\r\n"` oder `"\n"` zu verwenden.

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|

***

### Portalconfig.Menu
Hier können die Menüeinträge jeweils für das Mainmenu (in der Desktopansicht links) und Secondarymenu (in der Desktopansicht rechts) und deren Anordnung konfiguriert werden. Die Reihenfolge der Module ergibt sich aus der Reihenfolge in der *Config.json*.

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|
|expanded|nein|Boolean|false|Definiert ob das jeweilige Menü beim Starten des Portals aus- oder eingeklappt ist.|false|
|searchBar|nein|**[searchBar](#markdown-header-portalconfigmenusearchbar)**|||false|
|sections|nein|**[sections](#markdown-header-portalconfigmenusections)**[[]]|||false|
|title|nein|**[title](#markdown-header-portalconfigmenutitle)**|||false|

***

#### Portalconfig.Menu.searchBar

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|

***

#### Portalconfig.Menu.sections

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|

***

##### Portalconfig.Menu.sections.addWMS

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|

***

##### Portalconfig.Menu.sections.baselayerSwitcher

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|

***

##### Portalconfig.Menu.sections.bufferAnalysis

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|

***

##### Portalconfig.Menu.sections.contact

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|

***

##### Portalconfig.Menu.sections.coordToolkit

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|

***

##### Portalconfig.Menu.sections.draw

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|

***

##### Portalconfig.Menu.sections.featureLister

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|

***

##### Portalconfig.Menu.sections.fileImport

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|

***

##### Portalconfig.Menu.sections.filter

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|

***

##### Portalconfig.Menu.sections.layerClusterToggler

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|

***

##### Portalconfig.Menu.sections.layerSlider

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|

***

##### Portalconfig.Menu.sections.legend

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|

***

##### Portalconfig.Menu.sections.measure

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|

***

##### Portalconfig.Menu.sections.news

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|

***

##### Portalconfig.Menu.sections.openConfig

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|

***

##### Portalconfig.Menu.sections.print

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|

***

##### Portalconfig.Menu.sections.routing

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|

***

##### Portalconfig.Menu.sections.scaleSwitcher

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|

***

##### Portalconfig.Menu.sections.selectFeatures

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|

***

##### Portalconfig.Menu.sections.shadow

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|

***

##### Portalconfig.Menu.sections.shareView

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|

***

##### Portalconfig.Menu.sections.styleVT

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|

***

##### Portalconfig.Menu.sections.wfsSearch

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|

***

##### Portalconfig.Menu.sections.wfst

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|

***

#### Portalconfig.Menu.title

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|

***

### Portalconfig.mapView
Mit verschiedenen Parametern wird die Startansicht der Karte konfiguriert und der Hintergrund festgelegt, der erscheint wenn keine Karte geladen ist.

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|

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
|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|

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

***
