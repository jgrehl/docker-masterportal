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
|expandable|no|**[expandable](#markdown-header-portalconfigcontrols)**||With expandable, controls are hidden behind a button with three dots and can be expanded when needed.|false|
|totalView|no|Boolean/**[totalView](#markdown-header-portalconfigcontrolstotalView)**|false|Offers a button to return to the initial view.|false|
|zoom|no|Boolean/**[zoom](#markdown-header-portalconfigcontrolszoom)**|false|Defines whether zoom buttons should be displayed.|false|

**Example**

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
Offers a button to return to the initial view.

The attribute totalView may be of type boolean or object. If of type boolean, it shows a button using the default configuration that allows the user to switch back to the initial view. When of type object, the following attributes may be set:

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|
|icon|no|String|"bi-skip-backward-fill"|Using the icon parameter, a different icon can be used to switch back to the home screen.|false|
|supportedDevices|no|String|["Desktop"]|Devices on which the module can be used and is displayed in the menu.|false|
|supportedMapModes|no|String|["2D", "3D"]|Map modes in which the module can be used and is displayed in the menu.|false|

**Example totalView as Object**

```json
"totalView" : {
    "icon": "bi-skip-forward-fill"
},
```

**Example totalView as Boolean**

```json
"totalView": true
```

***

#### Portalconfig.controls.zoom
Defines whether zoom buttons should be displayed.

The attribute zoom may be of type boolean or object. If of type boolean, it shows two buttons using the default configuration that allows the user to zoom in the map. When of type object, the following attributes may be set:

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|
|iconIn|no|String|"bi-plus-lg"|Using the icon parameter, another icon can be used for zooming in.|false|
|iconOut|no|String|"bi-dash-lg"|Using the icon parameter, another icon can be used for zooming out.|false|
|supportedDevices|no|String|["Desktop", "Mobile"]|Devices on which the module can be used and is displayed in the menu.|false|
|supportedMapModes|no|String|["2D", "3D"]|Map modes in which the module can be used and is displayed in the menu.|false|

**Example zoom as Object**

```json
"zom" : {
    "iconIn": "bi-plus-lg",
    "iconOut": "bi-dash-lg"
},
```

**Example zoom as Boolean**

```json
"zoom": true
```

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

#### Portalconfig.menu.searchBar
Configuration of the search bar. Different search services can be configured.

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|
|minCharacters|no|Integer|3|Minimum amount of characters before sending a request to an external service.|false|
|placeholder|no|String|"common:modules.searchBar.placeholder.address"|Input text field placeholder shown when no input has been given yet.|false|
|searchInterfaces|no|**[searchInterfaces](#markdown-header-portalconfigmenusearchbarsearchInterfaces)**[]||Interfaces to search services.|false|
|timeout|no|Integer|5000|Service request timeout in milliseconds.|false|
|zoomLevel|no|Integer|7|ZoomLevel to which the searchbar zooms in at maximum.|false|

**Example**

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
Definitions of the search interfaces.

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|
|gazetteer|no|**[gazetteer](#markdown-header-portalconfigmenusearchbarsearchInterfacesgazetteer)**||Configuration of the Gazetteer search service.|false|

**Example**

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
Gazetteer search service configuration.

**This requires a backend!**
**A WFS's Stored Query is requested with predefined parameters.**

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|
|resultEvents|no|**[resultEvents](#markdown-header-portalconfigmenusearchbarsearchInterfacesresultEvents)**|{onClick: ["setMarker", "zoomToResult"], onHover: ["setMarker"]}|Actions that are executed when an interaction, such as hover or click, is performed with a result list item.|false|
|searchAddress|no|Boolean|false|Defines whether address search is active. For backward compatibility, if "searchAddress" is not configured, the "searchAddress" attribute is set to "true" when "searchStreets" and "searchHouseNumbers" are set to "true".|false|
|searchDistricts|no|Boolean|false|Defines whether district search is active.|false|
|searchHouseNumbers|no|Boolean|false|Defines whether house numbers should be searched for. Requires `searchStreets` to be set to `true`, too.|false|
|searchParcels|no|Boolean|false|Defines whether parcels search is active.|false|
|searchStreetKey|no|Boolean|false|Defines whether streets should be searched for by key.|false|
|searchStreet|no|Boolean|false|Defines whether street search is active. Precondition to set `searchHouseNumbers` to `true`.|false|
|serviceId|yes|String||Search service id. Resolved using the **[rest-services.json](rest-services.json.md)** file.|false|
|showGeographicIdentifier|no|Boolean|false|Specifies whether the attribute `geographicIdentifier` should be used to display the search result.|false|

**Example**

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
},
```

***

##### Portalconfig.menu.searchBar.searchInterfaces.resultEvents
Actions that are executed when an interaction, such as hover or click, is performed with a result list item.

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|
|onClick|no|String[]||Actions that are fired when clicking on a result list item.|false|
|onHover|no|String[]||Actions that are fired when hovering on a result list item.|false|

**Example**

```json
"resultEvents": {
    "onClick": ["setMarker", "zoomToResult"],
    "onHover": ["setMarker"]
}
```

***

#### Portalconfig.menu.sections
Modules can be divided into sections. In the menu, sections are divided with a horizontal line.

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|
|layerClusterToggler|no|**[layerClusterToggler](#markdown-header-portalconfigmenusectionsmoduleslayerClusterToggler)**||This module allows a cluster layers to be active and deactive together.|false|
|layerSlider|no|**[layerSlider](#markdown-header-portalconfigmenutoollayerslider)**||The layerSlider module allows showing arbitrary services in order. This can e.g. be used to show aerial footage from multiple years in succession.|false|
|openConfig|no|**[openConfig](#markdown-header-portalconfigmenusectionsopenConfig)**||ith this module a configuration file (config.json) can be reloaded at runtime. The modules and map are adapted to the new configuration.|false|

***

#### Portalconfig.menu.sections.modules

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|
|description|no|String||The description that should be shown in the button in the right menu.|false|
|icon|no|String||Icon that is shown in front of the module in the menu. For selection see **[Bootstrap Icons](https://icons.getbootstrap.com/)**.|false|
|name|no|String||Name of the module in the menu.|false|
|showDescription|no|String||Indicates whether the description of the module should be displayed in the menu.|false|
|supportedDevices|no|String||Devices on which the module can be used and is displayed in the menu.|false|
|supportedMapModes|no|String||Map modes in which the module can be used and is displayed in the menu.|false|
|type|no|String||The type of the module. Defines which module is configured.|false|

***

##### Portalconfig.menu.sections.modules.addWMS

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|

***

##### Portalconfig.menu.sections.modules.baselayerSwitcher

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|

***

##### Portalconfig.menu.sections.modules.bufferAnalysis

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|

***

##### Portalconfig.menu.sections.modules.contact

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|

***

##### Portalconfig.menu.sections.modules.coordToolkit

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|

***

##### Portalconfig.menu.sections.modules.draw

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|

***

##### Portalconfig.menu.sections.modules.featureLister

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|

***

##### Portalconfig.menu.sections.modules.fileImport

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|

***

##### Portalconfig.menu.sections.modules.filter

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|

***

##### Portalconfig.menu.sections.modules.layerClusterToggler
This module allows to activate/load and deactivate layers in clusters simultaneously.

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|
|icon|no|String|"bi-list"|Icon that is shown in front of the module in the menu. For selection see **[Bootstrap Icons](https://icons.getbootstrap.com/)**.|false|
|layerIdList|yes|String[]|[]|List of layerIds, the layers that should be switched on or off together.|false|
|name|no|String|"common:modules.layerClusterToggler.name"|Name of the module in the menu.|false|
|type|no|String|"layerClusterToggler"|The type of the module. Defines which module is configured.|false|

**Example**

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
The layer slider module allows showing multiple layers in a row. This may e.g. be used to animate a time series of aerial imagery.

The slider can switch between two modes in the interface. Layer slider type. `""player"` shows start, pause, and stop buttons, while `"handle"` uses a switch. In the latter case, layer transparency is adjusted additionally.

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|
|icon|no|String|"bi-collection-play"|Icon that is shown in front of the module in the menu. For selection see **[Bootstrap Icons](https://icons.getbootstrap.com/)**|false|
|layerIds|yes|**[layerId](#markdown-header-portalconfigmenusectionsmoduleslayersliderlayerid)**[]|[]|Array of layer information objects.|false|
|name|no|String|"common:modules.layerSlider.name"|Name of the module in the menu.|false|
|timeInterval|no|Integer|2000|Time in ms until the next layer is shown.|false|
|title|no|String|"common:modules.layerSlider.title"|Name displayed in the module.|false|
|type|no|String|"layerSlider"|The type of the module. Defines which module is configured.|false|

**Example**

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
    "name": "Time series",
    "timeInterval": 2000,
    "title": "Simulation of Example-WMS"
}
```

***

###### Portalconfig.menu.sections.modules.layerSlider.layerIds
Defines a layer slider layer.

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|
|layerId|yes|String||ID of the service to be shown in the portal. This layer ID *MUST* be configured as part of the *Themenconfig*!|false|
|title|yes|String||Service name to be shown in the portal.|false|

**Example**

```json
{
    "layerId": "123",
    "title": "Dienst 1"
}
```

***

##### Portalconfig.menu.sections.modules.legend

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|

***

##### Portalconfig.menu.sections.modules.measure

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|

***

##### Portalconfig.menu.sections.modules.news

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|

***

##### Portalconfig.menu.sections.modules.openConfig
Mit diesem Modul lässt sich eine Konfigurationsdatei (config.json) zur Laufzeit neu laden. Die Module und Karte werden an die neue Konfiguration angepasst.

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|
|icon|no|String|"bi-upload"|Icon that is shown in front of the module in the menu. For selection see **[Bootstrap Icons](https://icons.getbootstrap.com/)**.|false|
|name|no|String|"common:modules.openConfig.name"|Name of the module in the menu.|false|
|type|no|String|"openConfig"|The type of the module. Defines which module is configured.|false|

**Example**

```json
{
    "icon": "bi-upload",
    "name": "common:modules.openConfig.name",
    "type": "openConfig"
}
```

***

##### Portalconfig.menu.sections.modules.print

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|

***

##### Portalconfig.menu.sections.modules.routing

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|

***

##### Portalconfig.menu.sections.modules.scaleSwitcher

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|

***

##### Portalconfig.menu.sections.modules.selectFeatures

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|

***

##### Portalconfig.menu.sections.modules.shadow

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|

***

##### Portalconfig.menu.sections.modules.shareView

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|

***

##### Portalconfig.menu.sections.modules.styleVT

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|

***

##### Portalconfig.menu.sections.modules.wfsSearch

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|

***

##### Portalconfig.menu.sections.modules.wfst

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|

***

#### Portalconfig.menu.title

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
|elements|no|**[elements](#markdown-header-themenconfigelements)**[]||Definition of the layers to be displayed as background maps in the topic tree.|false|

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
