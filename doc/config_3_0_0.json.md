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
|freeze|no|Boolean|**[freeze](#markdown-header-portalconfigcontrolsfreeze)**|Whether a "lock view" button is shown.|false|
|startModule|no|**[startModule](#markdown-header-portalconfigcontrolsstartModule)**|false|Displays buttons for the configured tools. These can be used to open and close the respective tools.|false|
|tiltView|no|Boolean/**[tiltView](#markdown-header-portalconfigcontrolstiltView)**|false|Displays two buttons that can be used to tilt the camera up or down in the 3D scene.|false|
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
Screen is locked so that no more actions can be performed in the map. Whether a "lock view" button is shown.

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|
|icon|no|String|"bi-lock"|Using the icon parameter, a different icon can be used to switch back to the home screen.|false|
|supportedDevices|no|String|["Desktop"]|Devices on which the module can be used and is displayed in the menu.|false|
|supportedMapModes|no|String|["2D", "3D"]|Map modes in which the module can be used and is displayed in the menu.|false|

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
The startModule attribute must be of type Object. A button is displayed for each configured module, which can be used to open and close the respective module.

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|
|mainMenu|no|**[mainMenu](#markdown-header-portalconfigcontrolsstartModulemainMenu)**||Here you can configure the modules for which a button should be displayed. These will be displayed in the `mainMenu` when opened.|false|
|secondaryMenu|no|**[secondaryMenu](#markdown-header-portalconfigcontrolsstartModulesecondaryMenu)**||Here you can configure the modules for which a button should be displayed. These will be displayed in the `secondaryMenu` when opened.|false|
|supportedDevices|no|String|["Desktop", "Mobile", "Table"]|Devices on which the module can be used and is displayed in the menu.|false|
|supportedMapModes|no|String|["2D", "3D"]|Map modes in which the module can be used and is displayed in the menu.|false|

**Example**

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
Here you can configure the modules for which a button is to be displayed. These are displayed in the `mainMenu` when opened.

|Name|Required|Type|Default|Description|Expert|
|----|-------------|---|-------|------------|------|
|type|no|String||Type of the module that is to be displayed as a control and opened in the mainMenu when clicked.|false|

**Example**

```json
"mainMenu": [
    {
        "type": "scaleSwitcher"
    }
]
```

***

##### Portalconfig.controls.startModule.secondaryMenu
Here you can configure the modules for which a button is to be displayed. These are displayed in the `secondaryMenu` when opened.

|Name|Required|Type|Default|Description|Expert|
|----|-------------|---|-------|------------|------|
|type|no|String||Type of the module that is to be displayed as a control and opened in the secondaryMenu when clicked.|false|

**Example**

```json
"secondaryMenu": [
    {
        "type": "scaleSwitcher"
    }
]
```

***

#### Portalconfig.controls.tiltView
Displays two buttons that can be used to tilt the camera up or down in the 3D scene.

The tiltView attribute can be of type Boolean or Object. If it is of type Boolean, it shows the buttons that are set in the default settings. If it is of type Object, the following attributes apply:

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|
|tiltDownIcon|no|String|"bi-caret-down-square"|The tiltDownIcon parameter can be used to specify a different icon for tilt down.|false|
|tiltUpIcon|no|String|"bi-caret-up-square"|Using the parameter tiltUpIcon another icon can be used for tilting up the camera.|false|
|supportedDevices|no|String|["Desktop", "Mobile"]|Devices on which the module can be used and is displayed in the menu.|false|
|SupportedMapModes|no|String|["3D"]|Map modes in which the module can be used and is displayed in the menu.|false|

**Example tiltView as Object**

```json
"tiltView" : {
    "tiltDownIcon": "bi-caret-down-square",
    "tiltUpIcon": "bi-caret-up-square",
},
```

**Example tiltView as boolean**

```json
"tiltView": true
```

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
|searchBar|no|**[searchBar](#markdown-header-portalconfigmenusearchbar)**||The search bar allows requesting information from various search services at once.|false|
|sections|no|**[sections](#markdown-header-portalconfigmenusections)**[]||Subdivision of modules in the menu.|false|
|title|no|**[title](#markdown-header-portalconfigmenutitle)**||The portal's title and further elements to be shown in the main menu bar.|false|

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

|Name|Required|Type|Default|Description|Expert|
|----|-------------|---|-------|------------|------|
|resultEvents|no|**[resultEvents](#markdown-header-portalconfigmenusearchbarsearchInterfacesresultEvents)**|{"onClick": ["setMarker", "zoomToResult"], "onHover": ["setMarker"]}|Actions that are executed when an interaction, such as hover or click, is performed with a result list item. The following events are possible: "setMarker", "zoomToResult".|false|
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
}
```

***

##### Portalconfig.menu.searchBar.searchInterfaces.resultEvents
Actions that are executed when an interaction, such as hover or click, is performed with a result list item.

The following events exist. Which events can be configured can be found in the descriptions of the respective search interface:

- activateLayerInTopicTree: Activates the found layer in the topic tree and map.
- addLayerToTopicTree: Adds the found layer to the topic tree and map.
- highligtFeature: Highlights the search result on the map.
- openGetFeatureInfo: Opens the GetFeatureInfo for the search hit in the menu.
- setMarker: Places a marker on the map.
- zoomToResult: Zooms to the search hit.

|Name|Required|Type|Default|Description|Expert|
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
|coordToolkit|no|**[coordToolkit](#markdown-header-portalconfigmenusectionsmodulescoordtoolkit)**||Coordinate query: Tool to query coordinates and altitude by mouse click: When clicking in the map, the coordinates are frozen in the display and can also be copied directly to the clipboard. Coordinate search: The coordinate system and the coordinates can be entered via an input mask. The tool then zooms to the corresponding coordinate and places a marker on it. The coordinate systems are obtained from config.js.|false|
|layerClusterToggler|no|**[layerClusterToggler](#markdown-header-portalconfigmenusectionsmoduleslayerClusterToggler)**||This module allows a cluster layers to be active and deactive together.|false|
|layerSlider|no|**[layerSlider](#markdown-header-portalconfigmenutoollayerslider)**||The layerSlider module allows showing arbitrary services in order. This can e.g. be used to show aerial footage from multiple years in succession.|false|
|openConfig|no|**[openConfig](#markdown-header-portalconfigmenusectionsopenConfig)**||ith this module a configuration file (config.json) can be reloaded at runtime. The modules and map are adapted to the new configuration.|false|
|print|no|**[print](#markdown-header-portalconfigmenusectionsprint)**||Printing module that can be used to export the map's current view as PDF.|false|
|scaleSwitcher|no|**[scaleSwitcher](#markdown-header-portalconfigmenusectionsmodulesSwitcher)**||Module that allows changing the map's current scale.|false|
|shadow|no|**[shadow](#markdown-header-portalconfigmenusectionsmodulesshadow)**||Configuration object for the 3D mode shadow time.|false|
|styleVT|no|**[styleVT](#markdown-header-portalconfigmenusectionsmodulesstyleVT)**||Style selection for VT services. Allows switching between styles of a Vector Tile Layer that provides multiple stylings via the `services.json` file.|false|

***

#### Portalconfig.menu.sections.modules

|Name|Required|Type|Default|Description|Expert|
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
Coordinates tool: to display the height above sea level in addition to the 2 dimensional coordinates, a 'heightLayerId' of a WMS service that provides the height must be specified. The format XML is expected and the attribute for the heights is expected under the value of the parameter 'heightElementName'.

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|
|type|no|String|"coordToolkit"|The type of the module. Defines which module is configured.|false|
|heightLayerId|no|String||Coordinate query: Id of the WMS layer that provides the height in XML format. If not defined, then no height is displayed.|false|
|heightElementName|no|String||Coordinate query: The element name under which the height in the XML is searched.|false|
|heightValueWater|no|String||Coordinate query: the value in the element defined under "heightElementName" supplied by the WMS for an unmeasured height in the water area, it will display the internationalized text "Water surface, no heights available" under the key "common:modules.coordToolkit.noHeightWater" in the interface. If this attribute is not specified, then the text provided by the WMS will be displayed.|false|
|heightValueBuilding|no|String||Coordinate query: the value in the element defined under "heightElementName" supplied by the WMS for a non-measured height in the building area, it will display the internationalized text "Building area, no heights available" under the key "common:modules.coordToolkit.noHeightBuilding" in the interface. If this attribute is not specified, then the text provided by the WMS will be displayed.|false|
|zoomLevel|no|Number|7|Coordinate search: Specifies the zoom level to which you want to zoom.|false|
|showCopyButtons|no|Boolean|true|Switch to show or hide the buttons for copying the coordinates.|false|
|delimiter|no|String|"Pipe-Symbol"|Delimiter of the coordinates when copying the coordinate pair|false|
|heightLayerInfo|no|String||An explanation for the height can be deposited here.|false|
|coordInfo|no|[CoordInfo](#markdown-header-portalconfigmenutoolcoordToolkitcoordInfo)||An object with explanations for the coordinate reference systems can be stored here.|false|

**Example**
```
#!json
{
    "type": "coordToolkit",
    "heightLayerId": "19173",
    "heightElementName": "value_0",
    "heightValueWater": "-20",
    "heightValueBuilding": "200",
    "zoomLevel": 5,
    "heightLayerInfo": "Basis of the height information is the \"Digitalge Höhenmodell Hamburg DGM 1\".",
    "showDescription": true,
    "description": "Determine coordinates from the map or search for coordinates.",
    "coordInfo": {
        "title": "Coordinate reference system for 2D position information, explanations",
        "explanations": [
        "ETRS89_UTM32, EPSG 4647 (zE-N): Reference system ETRS89, mapping rule UTM, zone 32",
        "EPSG 25832: explanations..."
        ]
    }
}
```

***

###### Portalconfig.menu.sections.modules.coordToolkit.coordInfo

|Name|Required|Type|Default|Description|Expert|
|----|-------------|---|-------|------------|------|
|title|no|string||Heading for the explanations of the coordinate reference systems.|false|
|explanations|no|**[explanations](#markdown-header-portalconfigmenusectionsmodulescoordtoolkitcoordinfoexplanations)**[]||Array of declarations from which a list is created.|false|

###### Portalconfig.menu.tool.coordToolkit.coordInfo.explanations
Can contain an array of explanations of the coordinate reference systems from which a list is created.

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

The slider can switch between two modes in the interface. Layer slider type. `"player"` shows start, pause, and stop buttons, while `"handle"` uses a switch. In the latter case, layer transparency is adjusted additionally.

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
With this module a configuration file (config.json) can be reloaded at runtime. The modules and map are adapted to the new configuration.

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
Print module, configurable for 2 print services: *High Resolution PlotService* and *MapfishPrint 3*.

**This requires a backend!**

**A [Mapfish-Print3](https://mapfish.github.io/mapfish-print-doc), or *HighResolutionPlotService* is required as backend.**

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|
|capabilitiesFilter|no|**[capabilitiesFilter](#markdown-header-portalconfigmenutoolprintcapabilitiesfilter)**||Filter for the response of the configured print service. Possible keys are layouts and outputFormats.|false|
|currentLayoutName|no|String|""|Defines which layout is the default layout on opening the print tool, e.g. "A4 portrait format". If the given layout is not available oder none is provided, the first layout mentioned in the Capabilities is used.|false|
|defaultCapabilitiesFilter|no|**[capabilitiesFilter](#markdown-header-portalconfigmenutoolprintcapabilitiesfilter)**||If there is no key set in capabilitiesFilter, the key from this object is taken.|false|
|dpiForPdf|no|Number|200|DPI resolution for the map in the PDF file.|false|
|filename|no|String|"report"|Print result file name.|false|
|icon|no|String|"bi-printer"|Icon that is shown in front of the module in the menu. For selection see **[Bootstrap Icons](https://icons.getbootstrap.com/)**.|false|
|isLegendSelected|no|Boolean|false|Defines whether a checkbox to print the legend is offered. Only used for print services supporting legend printing (Mapfish Print 3).|false|
|name|no|String|"common:modules.print.name"|Name of the module in the menu.|false|
|overviewmapLayerId|no|String||Allows using a different layer for the overview map element. If no Id is specified, the first layer of the selected baselayer maps is used.|false|
|printAppCapabilities|no|String|"capabilities.json"|path for the configuration of the print service|false|
|printAppId|no|String|"master"|Print service print app id. This tells the print service which template(s) to use.|false|
|printMapMarker|no|Boolean|false|If set to true, map markers visible in the print image section will be printed. They may obstruct the view to interesting information.|false|
|printService|no|String|"mapfish"|Flag determining which print service is in use. `plotservice` activates the *High Resolution PlotService*, if the parameter is not set, *Mapfish 3* is used.|false|
|printServiceId|yes|String||Print service id. Resolved using the **[rest-services.json](rest-services.json.md)** file.|false|
|title|no|String|"PrintResult"|Document title appearing as header.|false|
|type|no|String|"print"|The type of the module. Defines which module is configured.|false|

**High Resolution PlotService example configuration**

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

**MapfishPrint3 example configuration**

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
List of layouts and formats that filters the response from the print service in the respective category.

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|
|layouts|no|String[]||Array of layouts should shown in the UI.|false|
|outputFormats|no|String[]||Array of formats should shown in the UI.|false|

**Example capabilitiesFilter:**

```json
"capabilitiesFilter": {
    "layouts": ["A4 Hochformat", "A3 Hochformat"],
    "outputFormats": ["PDF"]
}
```

***

##### Portalconfig.menu.sections.modules.routing

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|

***

##### Portalconfig.menu.sections.modules.scaleSwitcher
Module that allows changing the map's current scale.

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|
|icon|no|String|"bi-arrows-angle-contract"|Icon that is shown in front of the module in the menu. For selection see **[Bootstrap Icons](https://icons.getbootstrap.com/)**.|false|
|name|no|String|"common:modules.scaleSwitcher.name"|Name of the module in the menu.|false|
|type|no|String|"scaleSwitcher"|The type of the module. Defines which module is configured.|false|

**Example**

```json
{
    "icon": "bi-arrows-angle-contract",
    "name": "common:modules.scaleSwitcher.name",
    "type": "scaleSwitcher"
}
```

***

##### Portalconfig.menu.sections.modules.selectFeatures

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|

***

##### Portalconfig.menu.sections.modules.shadow
The shadow tool provides a UI element to define a point in time by using sliders and date pickers. The chosen time allows rendering the shadows of all 3D objects in 3D mode by simulating the sun's position. By pulling the sliders or selecting a different date, a new sun position is calculated immediately. By default, the tool starts with the current time, which can be overwritten in the parameters.

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|
|icon|no|String|"bi-lamp-fill"|Icon that is shown in front of the module in the menu. For selection see **[Bootstrap Icons](https://icons.getbootstrap.com/)**.|false|
|isShadowEnabled|no|Boolean|false|Default shadow value. `true` immediately renders shadows, `false` requires a manual confirmation.|false|
|name|no|String|"common:modules.shadow.name"|Name of the module in the menu.|false|
|shadowTime|no|**[shadowTime](#markdown-header-portalconfigmenusectionsmodulesshadowshadowtime)**||Default time the mdoule is started with. Recognizes "month", "day", "hour", and "minute".|false|
|type|no|String|"shadow"|The type of the module. Defines which module is configured.|false|

**Example**

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
|Name|Required|Type|Default|Description|
|----|--------|----|-------|-----------|
|month|nein|String||month|
|day|nein|String||day|
|hour|nein|String||hour|
|minute|nein|String||minute|

**Example**

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

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|

***

##### Portalconfig.menu.sections.modules.
The module allows for switching the style of vector tile layers(❗) which provides multiple stylings defined in the `services.json` file.

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|
|icon|no|String|"bi-paint-bucket"|Icon that is shown in front of the module in the menu. For selection see **[Bootstrap Icons](https://icons.getbootstrap.com/)**.|false|
|name|no|String|"common:modules.styleVT.name"|Name of the module in the menu.|false|
|type|no|String|"styleVT"|The type of the module. Defines which module is configured.|false|

**Example**

```json
{
    "icon": "bi-paint-bucket",
    "name": "common:modules.styleVT.name",
    "type": "styleVT"
}
```

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
