>**[Back to the Masterportal documentation](doc.md)**.

>If this site isn´t displayed correctly please use this link: **[alternative config.json documentation](https://www.masterportal.org/files/masterportal/html-doku/doc/latest/config.json.de.html)**

[TOC]

***

# config.json

The *config.json* file contains all configuration of the portal interface. It controls which elements are placed where on the menu bar, how the map is to be centered initially, and which layers are to be loaded. See **[this file for an example](https://bitbucket.org/geowerkstatt-hamburg/masterportal/src/dev_vue/portal/basic/config.json)**.
The configuration is separated into two sections, **[Portalconfig](#markdown-header-Portalconfig)** and **[Themenconfig](#markdown-header-Themenconfig)**

**Example**

```json
{
   "Portalconfig": {},
   "Themenconfig": {}
}
```

***

## Portalconfig
The section *Portalconfig* controls the following properties:

1. Map view buttons and interactions (*controls*)
2. Informations on any layers (*getFeatureInfo*)
3. Menu entries in main menu and availability as well as order of modules (*mainMenu*)
4. Initial map view settings (*mapView*)
5. Footer configuration (*portalFooter*)
6. Menu entries in secondary menu and availability as well as order of modules (*secondaryMenu*)
7. Type of topic selection (*tree*)

The configuration options listed in the following table exist:

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|
|controls|no|**[controls](#markdown-header-portalconfigcontrols)**||Allows setting which interactions are active in the map.|false|
|getFeatureInfo|no|**[getFeatureInfo](#markdown-header-portalconfiggetFeatureInfo)**||Retrieves information about a queried feature by retrieving GetFeatureInfo requests or GetFeature requests or loaded vector data.|false|
|mainMenu|no|**[menu](#markdown-header-portalconfigmenu)**||Menu entries in main menu and their order are configured in this entry. The order of modules corresponds to the order in the object specifying them; see **[Modules](#markdown-header-portalconfigmenumodules)**.|false|
|mapView|no|**[mapView](#markdown-header-portalconfigmapview)**||Defines the initial map view and a background shown when no layer is selected.|false|
|portalFooter|no|**[footer](#markdown-header-footer)**||Possibility to configure the content of the portal footer.|false|
|secondaryMenu|no|**[menu](#markdown-header-portalconfigmenu)**||Menu entries in secondary menu and their order are configured in this entry. The order of modules corresponds to the order in the object specifying them; see **[Modules](#markdown-header-portalconfigmenumodules)**.|false|
|tree|no|**[tree](#markdown-header-portalconfigtree)**||Configuration of the topic selection tree.|false|

**Example**

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
Allows setting which interactions are active in the map.

Controls can be configured to be expandable so they will not initially show up in the sidebar but if you click the button with the three dots. You need to add the object "expandable" to the controls configuration.

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|

***

#### Portalconfig.controls.backForward
|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|

***

#### Portalconfig.controls.button3d
|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|

***

#### Portalconfig.controls.freeze
|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|

***

#### Portalconfig.controls.fullScreen
|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|

***

#### Portalconfig.controls.orientation
|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|

***

#### Portalconfig.controls.startModule
|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|

***

#### Portalconfig.controls.totalView
|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|

***

#### Portalconfig.controls.zoom
|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|

***

### Portalconfig.getFeatureInfo
Displays information to a clicked feature by firing a *GetFeatureInfo* or *GetFeature* request, respectively using the loaded data on vector layers.

On all GFI request types except directly fetching HTML, which is done by using `"text/html"` as `"infoFormat"` on a WMS, the "|" character is interpreted as linebreak. You may also use `"\r\n"` or `"\n"`.

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|

***

### Portalconfig.Menu
Here you can configure the menu items for the `mainMenu` (in the desktop view on the left) and `secondaryMenu` (in the desktop view on the right) and their arrangement. The order of the modules results from the order in the *Config.json*.

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|
|expanded|no|Boolean|false|Defines whether the respective menu is expanded or collapsed when the portal is started.|false|
|searchBar|no|**[searchBar](#markdown-header-portalconfigmenusearchbar)**|||false|
|sections|no|**[sections](#markdown-header-portalconfigmenusections)**[[]]|||false|
|title|no|**[title](#markdown-header-portalconfigmenutitle)**|||false|

***

#### Portalconfig.Menu.searchBar

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|

***

#### Portalconfig.Menu.sections

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|

***

##### Portalconfig.Menu.sections.addWMS

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|

***

##### Portalconfig.Menu.sections.baselayerSwitcher

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|

***

##### Portalconfig.Menu.sections.bufferAnalysis

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|

***

##### Portalconfig.Menu.sections.contact

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|

***

##### Portalconfig.Menu.sections.coordToolkit

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|

***

##### Portalconfig.Menu.sections.draw

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|

***

##### Portalconfig.Menu.sections.featureLister

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|

***

##### Portalconfig.Menu.sections.fileImport

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|

***

##### Portalconfig.Menu.sections.filter

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|

***

##### Portalconfig.Menu.sections.layerClusterToggler

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|

***

##### Portalconfig.Menu.sections.layerSlider

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|

***

##### Portalconfig.Menu.sections.legend

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|

***

##### Portalconfig.Menu.sections.measure

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|

***

##### Portalconfig.Menu.sections.news

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|

***

##### Portalconfig.Menu.sections.openConfig

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|

***

##### Portalconfig.Menu.sections.print

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|

***

##### Portalconfig.Menu.sections.routing

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|

***

##### Portalconfig.Menu.sections.scaleSwitcher

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|

***

##### Portalconfig.Menu.sections.selectFeatures

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|

***

##### Portalconfig.Menu.sections.shadow

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|

***

##### Portalconfig.Menu.sections.shareView

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|

***

##### Portalconfig.Menu.sections.styleVT

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|

***

##### Portalconfig.Menu.sections.wfsSearch

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|

***

##### Portalconfig.Menu.sections.wfst

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|

***

#### Portalconfig.Menu.title

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|

***

### Portalconfig.mapView
Defines the initial map view and a background shown when no layer is selected.

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|

***

### Portalconfig.portalFooter
Possibility to configure the content of the portal footer.

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|

***

### Portalconfig.tree
Configuration of the topic selection tree.

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|

***

## Themenconfig
The `Themenconfig` entry defines the contents and their order in the topic selection. The following properties can be configured:

1. Layers containing background maps (*Baselayer*)
2. Layers containing subject data (*Fachdaten*)

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|
|Baselayer|no|**[Baselayer](#markdown-header-themenconfigbaselayer)**||Layers containing background maps.|false|
|Fachdaten|no|**[Fachdaten](#markdown-header-themenconfigfachdaten)**||Layers containing subject data.|false|

**Example**

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
Here you define layers to be displayed as background maps.

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|
|elements|neinno|**[elements](#markdown-header-themenconfigelements)**[]||Definition of the layers to be displayed as background maps in the topic tree.|false|

**Example**

```json
{
    "Themenconfig": {
        "Baselayer": {}
    }
}
```

***

### Themenconfig.Fachdaten
Layers or folders with layers to be displayed as subject data are defined here.

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|
|elements|no|**[elements](#markdown-header-themenconfigelements)**[]||Definition of the layers or folders to be displayed in the topic tree as subject data.|false|

**Example**

```json
{
    "Themenconfig": {
        "Fachdaten": {}
    }
}
```

***

### Themenconfig.elements
|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|

**Example Baselayer**

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

**Example Fachdaten**

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
