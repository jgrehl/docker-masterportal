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
5. Display of a tooltip of features (*mouseHover*)
6. Footer configuration (*portalFooter*)
7. Menu entries in secondary menu and availability as well as order of modules (*secondaryMenu*)
8. Type of topic selection (*tree*)

The configuration options listed in the following table exist:

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|
|baselayerSwitcher|no|**[baselayerSwitcher](#markdown-header-portalconfigbaselayerSwitcher)**||The baselayerSwitcher allows you to easily change or select a background map.|false|
|controls|no|**[controls](#markdown-header-portalconfigcontrols)**||Allows setting which interactions are active in the map.|false|
|getFeatureInfo|no|**[getFeatureInfo](#markdown-header-portalconfiggetFeatureInfo)**||Via  getFeatureInfo (GFI) information to arbitrary layers can be requested. For WMS, the data is fetched with a GetFeatureInfo request. Vector data (WFS, Sensor, GeoJSON, etc.) is already present in the client and will be shown from the already fetched information.|false|
|mainMenu|no|**[menu](#markdown-header-portalconfigmenu)**||Menu entries in main menu and their order are configured in this entry. The order of modules corresponds to the order in the object specifying them; see **[Modules](#markdown-header-portalconfigmenumodules)**.|false|
|mapView|no|**[mapView](#markdown-header-portalconfigmapview)**||Defines the initial map view and a background shown when no layer is selected.|false|
|mouseHover|no|**[mouseHover](#markdown-header-portalconfigmousehover)**||Activates the MouseHover feature for vector layers, both WFS and GeoJSON. For per-layer configuration, see the **[Vector](#markdown-header-themenconfiglayervector)**.|false|
|portalFooter|no|**[footer](#markdown-header-footer)**||Possibility to configure the content of the portal footer.|false|
|secondaryMenu|no|**[menu](#markdown-header-portalconfigmenu)**||Menu entries in secondary menu and their order are configured in this entry. The order of modules corresponds to the order in the object specifying them; see **[Modules](#markdown-header-portalconfigmenumodules)**.|false|
|tree|no|**[tree](#markdown-header-portalconfigtree)**||Configuration of the topic selection tree.|false|

**Example**

```json
{
    "Portalconfig": {
        "baselayerSwitcher": {},
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

### Portalconfig.baselayerSwitcher
The baselayerSwitcher allows you to easily switch or select a baselayer.

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|
active|no|Boolean|false|Defines if the baselayerSwitcher is activated.|false|
activatedExpandable|no|Boolean|false|Specifies whether the baselayerSwitcher is expanded and all available baselayers are displayed or only the active one which is on the highest level.|false|

**Example**

```json
"baselayerSwitcher": {
      "active": true,
      "activatedExpandable": false
    }
```
***
### Portalconfig.controls
Allows setting which interactions are active in the map.

Controls can be configured to be expandable so they will not initially show up in the sidebar but if you click the button with the three dots. You need to add the object "expandable" to the controls configuration.

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|
|backForward|no|**[backForward](#markdown-header-portalconfigcontrolsbackforward)**|false|Shows buttons to jump to previous and next map views.|false|
|expandable|no|**[expandable](#markdown-header-portalconfigcontrols)**||With expandable, controls are hidden behind a button with three dots and can be expanded when needed.|false|
|freeze|no|Boolean/**[freeze](#markdown-header-portalconfigcontrolsfreeze)**|false|Whether a "lock view" button is shown.|false|
|fullScreen|no|Boolean/**[fullScreen](#markdown-header-portalconfigcontrolsfullscreen)**|false|Allows the user to view the portal in full screen mode, that is, without the browser's tabs and address bar, by clicking a button. A second click on the element returns the view back to normal.|false|
|rotation|no|**[rotation](#markdown-header-portalconfigcontrolsrotation)**|false|Control that shows the current rotation of the map. With a click the map rotation can be set to north again. See also `mapInteractions` in **[config.js.md](config.js.md)**.|false|
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
The attribute backForward may be of type boolean or object. If of type boolean, it shows a button using the default configuration that allows the user to switch back and forth between view states. When of type object, the following attributes may be set:

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|
|iconForward|no|String||Allows changing the icon on the forward button.|false|
|iconBack|no|String||Allows changing the icon on the backwards button.|false|

**Example using type object backForward**

```json
{
    "backForward" : {
        "iconForward": "bi-skip-forward-fill",
        "iconBack": "bi-skip-backward-fill"
    }
}
```

**Example using type boolean backForward**

```json
{
    "backForward": true
}
```

***

#### Portalconfig.controls.button3d
|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|

***

#### Portalconfig.controls.freeze
Screen is locked so that no more actions can be performed in the map. Whether a "lock view" button is shown.

The freeze attribute can be of type Boolean or Object. If it is of type Boolean, it shows the buttons that are set in the default settings. If it is of type Object, the following attributes apply:

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|
|icon|no|String|"bi-lock"|Using the icon parameter, a different icon can be used to switch back to the home screen.|false|
|supportedDevices|no|String|["Desktop"]|Devices on which the module can be used and is displayed in the menu.|false|
|supportedMapModes|no|String|["2D", "3D"]|Map modes in which the module can be used and is displayed in the menu.|false|

***

#### Portalconfig.controls.fullScreen
Allows the user to view the portal in full screen mode by clicking a button without the browser's tabs and address bar, by clicking a button. A second click on the element returns the view back to default.

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|
|iconArrow|no|String|"arrows-fullscreen"|Using the iconArrow parameter, another icon can be used for the button to switch on fullscreen mode.|false|
|iconExit|no|String|"fullscreen-exit"|Using the iconExit parameter, another icon can be used for the button to exit fullscreen mode.|false|
|supportedDevices|no|String|["Desktop"]|Devices on which the module can be used and is displayed in the menu.|false|
|supportedMapModes|no|String|["2D", "3D"]|Map modes in which the module can be used and is displayed in the menu.|false|

**Example fullScreen as Object**

```json
"fullScreen" : {
    "iconArrow": "arrows-fullscreen",
    "iconExit": "fullscreen-exit"
},
```

**Example fullScreen as Boolean**

```json
"fullScreen": true
```

***

#### Portalconfig.controls.orientation
|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|

***
#### Portalconfig.controls.rotation
The attribute rotation may be of type boolean or object. If of type boolean and value is set to true, the rotation control is just shown when the map rotation is not equal north/0. When of type object, the following attributes may be set:

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|
|showAlways|no|Boolean|false|If the attribute is set to true, the control is shown permanently. Via default it appears only if the map rotation is not equal north/0.|

**Example using type object rotation**
```json
"rotation": {
    "showAlways": true
}
```

**Example using type boolean rotation**
```json
"rotation": true
```
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
|supportedDevices|no|String|["Desktop"]|Devices on which the module can be used and is displayed in the menu.|false|
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
|supportedDevices|no|String|["Desktop"]|Devices on which the module can be used and is displayed in the menu.|false|
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
|centerMapToClickPoint|no|Boolean|false|If true, centers any clicked feature on the map.|false|
|coloredHighlighting3D|no|**[coloredHighlighting3D](#markdown-header-portalconfiggetfeatureinfocoloredhighlighting3d)**||Rule definition to override the highlighting of clicked 3D tiles.|false|
|hideMapMarkerOnVectorHighlight|no|Boolean|false|If set to true, the mapmarker won't be shown on vector highlighting. Only applies for the DetachedTemplate|false|
|highlightVectorRules|no|**[highlightVectorRules](#markdown-header-portalconfiggetfeatureinfohighlightvectorrules)**||Rule definition to override the styling of clicked vector data.|false|
|icon|no|String|"bi-info-circle-fill"|CSS icon class. Icon is shown before the tool name.|false|
|menuSide|no|String|"secondaryMenu"|Specifies in which menu the information should be displayed.|false|
|name|yes|String|"common:modules.getFeatureInfo.name"|Name displayed in the menu.|false|

**Example of a GetFeatureInfo configuration**.

```json
"getFeatureInfo": {
    "name": "Request information",
    "icon": "bi-info-circle-fill",
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

**Example of a GetFeatureInfo configuration to retrieve information from features**.

```json
"getFeatureInfo": {
    "name": "Request information"
}
```

***

#### Portalconfig.getFeatureInfo.coloredHighlighting3D
Highlight Setting of 3D Tiles.
If e.g. a building is selected by left mouse click, it will be highlighted in the given color.
For color configuration see **[Color-documentation](https://cesium.com/learn/cesiumjs/ref-doc/Color.html)**

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|-----------|
|color|no|String/String[]|"RED"|Color can be configured as Array or Cesium.Color (definition e.g "GREEN" for Cesium.Color.GREEN)|false|
|enabled|no|Boolean|true|False if coloredHighlighting3D is disabled.|false|

**Example Array**

```json
"coloredHighlighting3D": {
    "enabled": true,
    "color": [0, 255, 0, 255]
}
```

**Example Cesium.Color**

```json
"coloredHighlighting3D": {
    "enabled": true,
    "color": "GREEN"
}
```

***

#### Portalconfig.getFeatureInfo.highlightVectorRules
Configuration list to overwrite vector styles on gfi requests.

Hint: highlighting only works if there is a styleId in config.json configured for the layer.

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|
|fill|no|**[fill](#markdown-header-portalconfiggetfeatureinfohighlightvectorrulesfill)**||Settable field: `color`|false|
|image|no|**[image](#markdown-header-portalconfiggetfeatureinfohighlightvectorrulesimage)**||Settable field: `scale`|false|
|stroke|no|**[stroke](#markdown-header-portalconfiggetfeatureinfohighlightvectorrulesstroke)**||Settable field: `width`|false|
|text|no|**[text](#markdown-header-portalconfiggetfeatureinfohighlightvectorrulestext)**||Settable field: `scale`|false|

***

##### Portalconfig.getFeatureInfo.highlightVectorRules.fill
|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|
|color|no|Float[]|[255, 255, 255, 0.5]|RGBA value|false|

**Example**

```json
"fill": {
    "color": [215, 102, 41, 0.9]
}
```

***

##### Portalconfig.getFeatureInfo.highlightVectorRules.image
|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|
|scale|no|Float|1|Scale number|false|

**Example**

```json
"image": {
    "scale": 1.5
}
```

***

##### Portalconfig.getFeatureInfo.highlightVectorRules.stroke
|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|
|color|no|Float[]|[255, 255, 255, 0.5]|RGBA value|false|
|width|no|Integer|1|Stroke line width|false|

**Example**

```json
"stroke": {
    "width": 4,
    "color": [215, 102, 41, 0.9]
}
```

***

##### Portalconfig.getFeatureInfo.highlightVectorRules.text
|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|
|scale|no|Float|1|Text scale number|false|

**Example**

```json
"text": {
    "scale": 2
}
```

***

### Portalconfig.Menu
Here you can configure the menu items for the `mainMenu` (in the desktop view on the left) and `secondaryMenu` (in the desktop view on the right) and their arrangement. The order of the modules results from the order in the *Config.json*.

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|
|expanded|no|Boolean|false|Defines whether the respective menu is expanded or collapsed when the portal is started.|false|
|showDescription|no|Boolean||Defines whether a description of the modules should be displayed in the respective menu.|false|
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
|fileImport|no|**[fileImport](#markdown-header-portalconfigmenusectionsmodulesfileImport)**||Import KML, GeoJSON, and GPX files with this modules.|false|
|layerClusterToggler|no|**[layerClusterToggler](#markdown-header-portalconfigmenusectionsmoduleslayerClusterToggler)**||This module allows a cluster layers to be active and deactive together.|false|
|layerSlider|no|**[layerSlider](#markdown-header-portalconfigmenusectionsmoduleslayerslider)**||The layerSlider module allows showing arbitrary services in order. This can e.g. be used to show aerial footage from multiple years in succession.|false|
|openConfig|no|**[openConfig](#markdown-header-portalconfigmenusectionsmodulesopenConfig)**||ith this module a configuration file (config.json) can be reloaded at runtime. The modules and map are adapted to the new configuration.|false|
|print|no|**[print](#markdown-header-portalconfigmenusectionsmodulesprint)**||Printing module that can be used to export the map's current view as PDF.|false|
|routing|no|**[routing](#markdown-header-portalconfigmenusectionsmodulesrouting)**||Routing module to create routes and isochrones.|false|
|scaleSwitcher|no|**[scaleSwitcher](#markdown-header-portalconfigmenusectionsmodulesSwitcher)**||Module that allows changing the map's current scale.|false|
|selectFeatures|no|**[selectFeatures](#markdown-header-portalconfigmenusectionsmodulesselectfeatures)**||Allows selecting a set of vector features by letting the user draw a box on the map. Features in that box will be displayed with GFI information.|false|
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
#json
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
Import "*.kml", "*.geojson" and "*.gpx" files with this module.

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|
|enableZoomToExtend|no|Boolean|false|To decide if the file name is shown as a button and it is able to zoom the imported features by clicking the file name|false|
|icon|no|String|"bi-box-arrow-in-down"|Icon that is shown in front of the module in the menu. For selection see **[Bootstrap Icons](https://icons.getbootstrap.com/)**.|false|
|name|no|String|"common:modules.fileImport.name"|Name of the module in the menu.|false|
|type|no|String|"fileImport"|The type of the module. Defines which module is configured.|false|

**Example**

```json
{
    "type": "fileImport",
    "enableZoomToExtend": true
}
```

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

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|
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
Routing module. Enables user to plan routes between multiple points with multiple options to choose from. In addition users can create isochrones. Both functions are available with mass requests for specific use cases. ❗ This tool will use the routing service provided by the BKG ❗.

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|
|activeRoutingToolOption|no|String|"DIRECTIONS"|Which routing tool should be open.|false|
|routingToolOptions|no|String[]|[ ]|Which routing tool should be enabled. ("DIRECTIONS", "ISOCHRONES")|false|
|download|no|**[download](#markdown-header-portalconfigmenusectionsmodulesroutingdownload)**||Downloadoptions|false|
|geosearch|no|**[geosearch](#markdown-header-portalconfigmenusectionsmodulesroutinggeosearch)**||Geosearchoptions|false|
|geosearchReverse|no|**[geosearchReverse](#markdown-header-portalconfigmenusectionsmodulesroutinggeosearchreverse)**||Geosearchreverseoptions|false|
|directionsSettings|no|**[directionsSettings](#markdown-header-portalconfigmenusectionsmodulesroutingdirectionssettings)**||Directionsoptions|false|
|isochronesSettings|no|**[isochronesSettings](#markdown-header-portalconfigmenusectionsmodulesroutingisochronessettings)**||Isochronesoptions|false|

**Example**

```
#json
{
    "type": "routing",
    "name": "common:modules.routing",
    "icon": "bi-signpost-2-fill",
    "activeRoutingToolOption": "DIRECTIONS",
    "routingToolOptions": ["DIRECTIONS", "ISOCHRONES"],
    "download": {
        "filename": "",
        "format": "GEOJSON"
    },
    "geosearch": {
        "minChars": 3,
        "limit": 10,
        "type": "BKG",
        "serviceId": "bkg_geosearch"
    },
    "geosearchReverse": {
        "distance": 1000,
        "filter": "",
        "type": "BKG",
        "serviceId": "bkg_suggest"
    },
    "directionsSettings": {
        "type": "ORS",
        "serviceId": "bkg_ors",
        "speedProfile": "CAR",
        "preference": "RECOMMENDED",
        "styleRoute": {
            "fillColor": [255, 44, 0],
            "width": 6,
            "highlightColor": [255, 255, 255],
            "highlightWidth": 9,
            "partHighlightColor": [255, 255, 255],
            "partHighlightWidth": 3
        },
        "styleWaypoint": {
            "lineColor": [255, 127, 0],
            "lineWidth": 4,
            "fillColor": [255, 127, 0],
            "textFillColor": "#000",
            "textLineColor": "#fff",
            "textLineWidth": 3,
            "opacity": 0.3,
            "radius": 8
        },
        "styleAvoidAreas": {
            "lineColor": [0, 127, 255],
            "lineWidth": 2,
            "fillColor": [0, 127, 255],
            "opacity": 0.3,
            "pointRadius": 8,
            "pointLineWidth": 4
        },
        "batchProcessing": {
            "enabled": false,
            "active": false,
            "limit": 1000,
            "maximumConcurrentRequests": 3
        }
    },
    "isochronesSettings": {
        "type": "ORS",
        "serviceId": "bkg_ors",
        "speedProfile": "CAR",
        "isochronesMethodOption": "TIME",
        "distanceValue": 30,
        "minDistance": 1,
        "maxDistance": 400,
        "timeValue": 30,
        "minTime": 1,
        "maxTime": 180,
        "intervalValue": 15,
        "minInterval": 3,
        "maxInterval": 30,
        "styleCenter": {
            "lineColor": [255, 127, 0],
            "lineWidth": 4,
            "fillColor": [255, 127, 0],
            "opacity": 0.3,
            "radius": 8
        },
        "styleIsochrones": {
            "lineWidth": 2,
            "opacity": 0.65,
            "startColor": [66, 245, 78],
            "endColor": [245, 66, 66]
        },
        "batchProcessing": {
            "enabled": false,
            "active": false,
            "limit": 1000,
            "maximumConcurrentRequests": 3
        }
    }
}
```

***

#### Portalconfig.sections.modules.routing.download
Routing-tool download options.

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|
|fileName|no|String|""|Default filename for the download.|false|
|format|no|enum["GEOJSON","KML","GPX"]|"GEOJSON"|Which format should be selected by default.|false|

**Example**

```
#json
{
    "download": {
        "filename": "",
        "format": "GEOJSON"
    }
}
```

***

#### Portalconfig.sections.modules.routing.geosearch
Routing-tool geosearch options.

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|
|minChars|no|Number|3|Minimum amount of characters before sending a request to an external service.|false|
|limit|no|Number|10|Maximale amount of characters for the search.|false|
|type|yes|enum["BKG","NOMINATIM","LOCATIONFINDER","KOMOOT","GAZETTEER","SPECIALWFS","ELASTIC"]|""|Which type of the geosearch should be used.|false|
|serviceId|yes|String||Which service should be used for the geosearch.|false|
|typeName|no|String||Type name for the specialWfs geosearch query.|false|
|propertyNames|no|String[]||Names of properties to be included in the specialWfs geosearch.|false|
|geometryNames|no|String||Name of the geometry field for specialWfs geosearch.|false|
|bbox|no|**[bbox](#markdown-header-portalconfigmenusectionsmodulesroutinggeosearchbbox)**||BBOX value according to the speedProfile. Coordinate system depends on the epsg parameter. Geosearch service must support bbox string.|false|
|epsg|no|String|4326|Which EPSG code is used by the service (e.g. 4326, 25832).|false|
|searchField|no|String||The path to the field to be searched for when using Elastic Search.|false|
|sortField|no|String||The path to the field that specifies the sorting of the results in ascending order when using Elastic Search.|false|

**Example for BKG**

```
#json
{
    "geosearch": {
        "type": "BKG",
        "serviceId": "bkg_geosearch",
        "bbox": {"CYCLING": "9.6,53.40,10.4,53.84"}
    }
}
```
**Example for SPECIALWFS**

```
#json
{
    "geosearch": {
        "minChars": 3,
        "limit": 10,
        "type": "SPECIALWFS",
        "serviceId": "specialWfs_geosearch",
        "typeName": "ms:strasse_nr",
		"propertyNames": [
			"ms:LABEL_TEXT"
			],
		"geometryName": "ms:msGeometry"
    }
}
```
**Example for ELASTIC**

```
#json
{
    "geosearch": {
        "minChars": 3,
        "limit": 10,
        "type": "ELASTIC",
        "serviceId": "elastic_geosearch",
        "epsg": "25832",
        "searchField": "properties.searchField",
        "sortField": "properties.HAUSNUMMER"
    }
}
```

***

#### Portalconfig.sections.modules.routing.geosearch.bbox
BBOX value according to the speedProfile. Coordinate system depends on the epsg parameter. Geosearch service must support bbox string.
|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|
|speedProfile|no|String||Coordinate values "West,South,East,North"|false|

**Example**

```
#json
{
    "bbox": {"CYCLING": "9.6,53.40,10.4,53.84"}
}
```

***

#### Portalconfig.sections.modules.routing.geosearchReverse
Routing-tool geosearch reverse options.

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|
|distance|no|Number|1000|Search radius in meter for the external service.|false|
|filter|no|String||Additional filter used in the query.|false|
|type|yes|enum["BKG","NOMINATIM","KOMOOT"]||Which type of geosearch reverse should be used.|false|
|serviceId|yes|String||Which service should be used for the geosearch reverse.|false|

**Example**

```
#json
{
    "geosearchReverse": {
        "distance": 1000,
        "filter": "",
        "type": "BKG",
        "serviceId": "bkg_suggest"
    }
}
```

***

#### Portalconfig.sections.modules.routing.directionsSettings
Routing-tool directions options.

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|
|type|yes|enum["ORS"]||Which type of service should be used for the request.|false|
|serviceId|yes|String||Which service should be used for the request.|false|
|speedProfile|no|String|"CAR"|Which speed profile should be selected by default.|false|
|preference|no|String|"RECOMMENDED"|Which type of directions should be used by default.|false|
|customPreferences|no|**[customPreferences](#markdown-header-portalconfigmenusectionsmodulesroutingdirectionssettingscustompreferences)**||Possibility to define additional preferences for the different speed profiles (additionally to the BKG service)  (requires own modified backend)|false|
|customAvoidFeatures|no|**[customAvoidFeatures](#markdown-header-portalconfigmenusectionsmodulesroutingdirectionssettingscustomavoidfeatures)**||Possibility to define own options for avoid traffic routes for the different speed profiles(additionally to the BKG service) (requires own modified backend)|false|
|styleRoute|no|**[styleRoute](#markdown-header-portalconfigmenusectionsmodulesroutingdirectionssettingsstyleroute)**||Stylerouteoptions|false|
|styleWaypoint|no|**[styleWaypoint](#markdown-header-portalconfigmenusectionsmodulesroutingdirectionssettingsstylewaypoint)**||Stylewaypointoptions|false|
|styleAvoidAreas|no|**[styleAvoidAreas](#markdown-header-portalconfigmenusectionsmodulesroutingdirectionssettingsstyleavoidareas)**||Styleavoidareasoptions|false|
|batchProcessing|no|**[batchProcessing](#markdown-header-portalconfigmenusectionsmodulesroutingdirectionssettingsbatchprocessing)**||Batchprocessingoptions|false|

**Example**

```
#json
{
    "directionsSettings": {
        "type": "ORS",
        "serviceId": "bkg_ors",
        "speedProfile": "CAR",
        "preference": "RECOMMENDED",
        "customPreferences": {
            "CYCLING": ["RECOMMENDED", "SHORTEST", "GREEN"]
        },
        "customAvoidFeatures": {
                "CYCLING": ["STEPS", "FERRIES", "UNPAVEDROADS"]
        },
        "styleRoute": {
            "fillColor": [255, 44, 0],
            "width": 6,
            "highlightColor": [255, 255, 255],
            "highlightWidth": 9,
            "partHighlightColor": [255, 255, 255],
            "partHighlightWidth": 3
        },
        "styleWaypoint": {
            "lineColor": [255, 127, 0],
            "lineWidth": 4,
            "fillColor": [255, 127, 0],
            "textFillColor": "#000",
            "textLineColor": "#fff",
            "textLineWidth": 3,
            "opacity": 0.3,
            "radius": 8
        },
        "styleAvoidAreas": {
            "lineColor": [0, 127, 255],
            "lineWidth": 2,
            "fillColor": [0, 127, 255],
            "opacity": 0.3,
            "pointRadius": 8,
            "pointLineWidth": 4
        },
        "batchProcessing": {
            "enabled": false,
            "active": false,
            "limit": 1000,
            "maximumConcurrentRequests": 3
        }
    }
}
```

***

#### Portalconfig.sections.modules.routing.directionsSettings.customAvoidFeatures
Possibility to define additional avoid features for the different speed profiles (additionally to the BKG service) (requires own modified backend).
|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|
|speedProfile|no|String[]||Options for avoid traffic routes that should be available for the speedProfile.|false|

**Example**

```
#json
{
    "customAvoidFeatures": {
       "CYCLING": ["STEPS", "FERRIES", "UNPAVEDROADS"],
       "CAR": ["HIGHWAYS"]
    }
}
```

***

#### Portalconfig.sections.modules.routing.directionsSettings.customPreferences
Routing-tool directions route customPreferences.
Possibility to define additional preferences for the different speed profiles (additionally to the BKG service)  (requires own modified backend)


|Name|Required|Type|Default|Description|Expert|
|----|-------------|---|-------|------------|------|
|speedProfile|no|String[]||Which preferences should be available for the speedProfile.|false|

**Example**

```
#json
{
    "customPreferences": {
       "CYCLING": ["RECOMMENDED", "SHORTEST", "GREEN"],
       "CAR": ["RECOMMENDED", "SHORTEST", "GREEN"]
    }
}
```

***
#### Portalconfig.sections.modules.routing.directionsSettings.styleRoute
Routing-tool directions route style options.

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|
|fillColor|no|Number[]|[255, 44, 0]|Which color should be used to fill.|false|
|width|no|Number|6|How thick should the line be displayed.|false|
|highlightColor|no|Number[]|[255, 255, 255]|Which color should be used to highlight the route.|false|
|highlightWidth|no|Number|9|How thick should the highlighting line be displayed.|false|
|partHighlightColor|no|Number[]|[255, 255, 255]|Which color should be used when highlighting part of the route.|false|
|highlightWidth|no|Number|9|How thick should the highlighting part of the route be displayed.|false|

**Example**

```
#json
{
    "styleRoute": {
        "fillColor": [255, 44, 0],
        "width": 6,
        "highlightColor": [255, 255, 255],
        "highlightWidth": 9,
        "partHighlightColor": [255, 255, 255],
        "partHighlightWidth": 3
    }
}
```

***

#### Portalconfig.sections.modules.routing.directionsSettings.styleWaypoint
Routing-tool directions waypoint style options.

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|
|lineColor|no|Number[]|[255, 127, 0]|Which color should be used for the border.|false|
|lineWidth|no|Number|4|How thick should the border be.|false|
|fillColor|no|Number[]|[255, 127, 0]|Which color should be used to fill.|false|
|textFillColor|no|String|"#000"|Which color should be used for the text.|false|
|textLineColor|no|String|"#fff"|Which color should be used for the text background.|false|
|textLineWidth|no|Number|3|How big should the text be displayed.|false|
|opacity|no|Number|0.3|How transparent should the fill color be displayed.|false|
|radius|no|Number|8|How big should the waypoint be displayed.|false|

**Example**

```
#json
{
    "styleWaypoint": {
        "lineColor": [255, 127, 0],
        "lineWidth": 4,
        "fillColor": [255, 127, 0],
        "textFillColor": "#000",
        "textLineColor": "#fff",
        "textLineWidth": 3,
        "opacity": 0.3,
        "radius": 8
    }
}
```

***

#### Portalconfig.sections.modules.routing.directionsSettings.styleAvoidAreas
Routing-tool directions avoid areas style options.

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|
|lineColor|no|Number[]|[0, 127, 255]|Which color should be used for the border.|false|
|lineWidth|no|Number|2|How thick should the border be.|false|
|fillColor|no|Number[]|[0, 127, 255]|Which color should be used to fill.|false|
|opacity|no|Number|0.3|How transparent should the fill color be displayed.|false|
|pointRadius|no|Number|8|How big should the corner points be displayed.|false|
|pointLineWidth|no|Number|4|How big should the border of the corner points be displayed.|false|

**Example**

```
#json
{
    "styleAvoidAreas": {
        "lineColor": [0, 127, 255],
        "lineWidth": 2,
        "fillColor": [0, 127, 255],
        "opacity": 0.3,
        "pointRadius": 8,
        "pointLineWidth": 4
    }
}
```

***

#### Portalconfig.sections.modules.routing.directionsSettings.batchProcessing
Routing-tool directions batch processing options.

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|
|enabled|no|Boolean|false|If the batch processing should be enabled for the user.|false|
|active|no|Boolean|false|If the batch processing is active by default.|false|
|limit|no|Number|1000|The maximum amount of rows allowed in the csv file.|false|
|maximumConcurrentRequests|no|Number|3|The maximum concurrent requests allowed to be made by the batch processing task handler.|false|

**Example**

```
#json
{
    "batchProcessing": {
        "enabled": false,
        "active": false,
        "limit": 1000,
        "maximumConcurrentRequests": 3
    }
}
```

***

#### Portalconfig.sections.modules.routing.isochronesSettings
Routing-tool isochrones options.

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|
|type|yes|String||Which type of service should be used for the request. ("ORS")|false|
|serviceId|yes|String||Which service should be used for the request.|false|
|speedProfile|no|String|"CAR"|Which speed profile should be selected by default.|false|
|isochronesMethodOption|no|String|"TIME"|Which method should be selected by default.|false|
|distanceValue|no|Number|30|Which distance value in km should be selected by default.|false|
|minDistance|no|Number|1|Which minimal distance value in km should be used.|false|
|maxDistance|no|Number|400|Which maximum distance value in km should be used.|false|
|timeValue|no|Number|30|Which time value in min should be selected by default.|false|
|minTime|no|Number|1|Which minimal time value in min should be used.|false|
|maxTime|no|Number|180|Which maximum time in min should be used.|false|
|intervalValue|no|Number|15|Which interval value in km/min should be used by default.|false|
|minInterval|no|Number|1|Which minimal interval value in km/min should be used.|false|
|maxInterval|no|Number|30|Which maximum interval value in km/min should be used.|false|
|styleCenter|no|**[styleCenter](#markdown-header-portalconfigmenusectionsmodulesroutingisochronessettingsstylecenter)**||Stylecenteroptions|false|
|styleIsochrones|no|**[styleIsochrones](#markdown-header-portalconfigmenusectionsmodulesroutingisochronessettingsstyleisochrones)**||Styleisochronesoptions|false|
|batchProcessing|no|**[batchProcessing](#markdown-header-portalconfigmenusectionsmodulesroutingisochronessettingsbatchprocessing)**||Batchprocessingoptions|false|

**Example**

```
#json
{
    "isochronesSettings": {
        "type": "ORS",
        "serviceId": "bkg_ors",
        "speedProfile": "CAR",
        "isochronesMethodOption": "TIME",
        "distanceValue": 30,
        "minDistance": 1,
        "maxDistance": 400,
        "timeValue": 30,
        "minTime": 1,
        "maxTime": 180,
        "intervalValue": 15,
        "minInterval": 3,
        "maxInterval": 30,
        "styleCenter": {
            "lineColor": [255, 127, 0],
            "lineWidth": 4,
            "fillColor": [255, 127, 0],
            "opacity": 0.3,
            "radius": 8
        },
        "styleIsochrones": {
            "lineWidth": 2,
            "opacity": 0.65,
            "startColor": [66, 245, 78],
            "endColor": [245, 66, 66]
        },
        "batchProcessing": {
            "enabled": false,
            "active": false,
            "limit": 1000,
            "maximumConcurrentRequests": 3
        }
    }
}
```

***

#### Portalconfig.sections.modules.routing.isochronesSettings.styleCenter
Routing-tool isochrones centers style options.

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|
|lineColor|no|Number[]|[255, 127, 0]|Which color should be used for the border.|false|
|lineWidth|no|Number|4|How thick should the border be displayed.|false|
|fillColor|no|Number[]|[255, 127, 0]|Which color should be used to fill.|false|
|opacity|no|Number|0.3|How transparent should the fill color be displayed.|false|
|radius|no|Number|8|How big should the waypoint be displayed.|false|

**Example**

```
#json
{
    "styleCenter": {
        "lineColor": [255, 127, 0],
        "lineWidth": 4,
        "fillColor": [255, 127, 0],
        "opacity": 0.3,
        "radius": 8
    }
}
```

***

#### Portalconfig.sections.modules.routing.isochronesSettings.styleIsochrones
Routing-tool isochrones style options.

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|
|lineWidth|no|Number|2|How thick should the lines be displayed.|false|
|opacity|no|Number|0.65|How transparent the fill color is displayed.|false|
|startColor|no|Number[]|[66, 245, 78]|The starting color for the fill color interpolation calculation.|false|
|endColor|no|Number[]|[245, 66, 66]|The end color for the fill color interpolation calculation.|false|

**Example**

```
#json
{
    "styleIsochrones": {
        "lineWidth": 2,
        "opacity": 0.65,
        "startColor": [66, 245, 78],
        "endColor": [245, 66, 66]
    }
}
```

***

#### Portalconfig.sections.modules.routing.isochronesSettings.batchProcessing
Routing-tool isochrones batch processing options.

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|
|enabled|no|Boolean|false|If the batch processing should be enabled for the user.|false|
|active|no|Boolean|false|If the batch processing is active by default.|false|
|limit|no|Number|1000|The maximum amount of rows allowed in the csv file.|false|
|maximumConcurrentRequests|no|Number|3|The maximum concurrent requests allowed to be made by the batch processing task handler.|false|

**Example**

```
#json
{
    "batchProcessing": {
        "enabled": false,
        "active": false,
        "limit": 1000,
        "maximumConcurrentRequests": 3
    }
}
```

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
Allows selecting a set of vector features by letting the user draw a box on the map. Features in that box will be displayed with GFI information and it's possible to zoom to a feature. This tool requires WFS(❗) layers.

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|
|highlightVectorRulesPointLine|no|**[highlightVectorRulesPointLine](#markdown-header-portalconfigmenusectionsmodulesselectfeatureshighlightvectorrulespointline)**||Specify outline color and stroke width for highlighting lines and fill color and scale factor for highlighting points as well as a zoom parameter.|false|
|highlightVectorRulesPolygon|no|**[highlightVectorRulesPolygon](#markdown-header-portalconfigmenusectionsmodulesselectfeatureshighlightvectorrulespolygon)**||Specify the fill color and outline color and stroke width for highlighting the polygon features as well as a zoom parameter.|false|
|icon|no|String|"bi-hand-index"|Icon that is shown in front of the module in the menu. For selection see **[Bootstrap Icons](https://icons.getbootstrap.com/)**.|false|
|name|no|String|"common:modules.selectFeatures.name"|Name of the module in the menu.|false|
|type|no|String|"selectFeatures"|The type of the module. Defines which module is configured.|false|

**Example**

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
Specify outline color and stroke width for highlighting lines and fill color and scale factor for highlighting points. Also a zoom level.

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|
|fill|no|**[fill](#markdown-header-portalconfigmenutoolselectfeatureshighlightvectorrulespointlinefill)**||Possible setting: color|false|
|stroke|no|**[stroke](#markdown-header-portalconfigmenutoolselectfeatureshighlightvectorrulespointlinestroke)**||Possible setting: width and color|false|
|image|no|**[image](#markdown-header-portalconfigmenutoolselectfeatureshighlightvectorrulespointlineimage)**||Possible setting: scale|false|
|zoomLevel|no|Integer|7|Zoom level, possible setting: 0-9|false|

***

####### Portalconfig.menu.sections.modules.selectFeatures.highlightVectorRulesPointLine.fill
|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|
|color|no|Float[]|[255, 255, 255, 0.5]|Possible setting: color (RGBA)|false|

**Example**

```json
"fill": {
    "color": [215, 102, 41, 0.9]
}
```

***

####### Portalconfig.menu.sections.modules.selectFeatures.highlightVectorRulesPointLine.stroke
|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|
|color|no|Float[]|[255, 255, 255, 0.5]|Possible setting: color (RGBA)|false|
|width|no|Integer|1|Possible setting: width|false|

**Example**

```json
"stroke": {
    "width": 4 ,
    "color": [255, 0, 255, 0.9]
}
```

***

####### Portalconfig.menu.sections.modules.selectFeatures.highlightVectorRulesPointLine.image
|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|
|scale|no|Integer|1.5|Possible setting: scale|false|

**Example**

```json
"image": {
    "scale": 2
    }
```

***

###### Portalconfig.menu.sections.modules.selectFeatures.highlightVectorRulesPolygon
Specify the fill color and stroke width for highlighting the polygon features as well as a zoom level.

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|
|fill|no|**[fill](#markdown-header-portalconfigmenusectionsmodulesselectfeatureshighlightvectorrulespolygonfill)**||Possible setting: color|false|
|stroke|no|**[stroke](#markdown-header-portalconfigmenusectionsmoduleselectfeatureshighlightvectorrulespolygonstroke)**||Possible setting: width|false|
|zoomLevel|no|Integer|7|Zoom level, possible setting: 0-9|false|

***

####### Portalconfig.menu.sections.modules.selectFeatures.highlightVectorRulesPolygon.fill
|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|
|color|no|Float[]|[255, 255, 255, 0.5]|Possible setting: color (RGBA)|false|

**Example**

```json
"fill": {
    "color": [215, 102, 41, 0.9]
}
```

***

####### Portalconfig.menu.sections.modules.selectFeatures.highlightVectorRulesPolygon.stroke
|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|
|color|no|Float[]|[255, 255, 255, 0.5]|Possible setting: color (RGBA)|false|
|width|no|Integer|1|Possible setting: width|false|

**Example**

```json
"stroke": {
    "width": 4 ,
    "color": [255, 0, 255, 0.9]
}
```

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
|month|no|String||month|
|day|no|String||day|
|hour|no|String||hour|
|minute|no|String||minute|

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
Allows to query a WFS(❗) layer decoupled from the search bar using filters and to create a form if necessary.
It is assumed that a stored query is used when using a WFS@2.0.0. When using a WFS@1.1.0, it is assumed that the way the WFS should be filtered is defined through the configuration.

Multiple **[SearchInstances](#markdown-header-portalconfigmenusectionsmoduleswfssearchsearchinstance)** can be defined, which will be selectable through a dropdown menu.

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|
|instances|yes|**[searchInstance](#markdown-header-portalconfigmenusectionsmoduleswfssearchsearchinstance)**[]||Array of `searchInstances`. A singular **[searchInstance](#markdown-header-portalconfigmenusectionsmoduleswfssearchsearchinstance)** corresponds to its own search form.|false|
|zoomLevel|no|Number|5|Specifies to which zoom level zooming is to be performed. If the feature does not fit into the zoom level, a suitable zoom level is automatically selected.|false|
|resultsPerPage|no|Number|0|The search result list will at most show this amount of results at a time. Further results will be offered on separate result pages. 0 means display all on one page at the same time.|false|
|multiSelect|no|Boolean|false|If `true`, a user may select multiple features from the result list by either pressing Strg/Shift or using checkboxes; when zooming, all selected features will be shown.|false|

**Example**

```json
{
    "wfsSearch": {
        "instances": [
            {
                "requestConfig": {
                    "layerId": "1234"
                },
                "selectSource": "https://geoportal-hamburg.de/lgv-config/gemarkungen_hh.json",
                "literals": [
                    {
                        "clause": {
                            "type": "and",
                            "literals": [
                                {
                                    "field": {
                                        "queryType": "equal",
                                        "fieldName": "gemarkung",
                                        "inputLabel": "District",
                                        "options": ""
                                    }
                                },
                                {
                                    "field": {
                                        "queryType": "equal",
                                        "fieldName": "flur",
                                        "inputLabel": "Cadastral District",
                                        "options": "flur"
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        ]
    }
}
```

***

#### Portalconfig.menu.sections.modules.wfsSearch.searchInstance
A singular instance of the WFS Search which is selectable through a dropdown.

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|
|literals|yes|**[literal](#markdown-header-portalconfigmenusectionsmoduleswfssearchsearchinstanceliteral)**[]||Array of `literals`.|true|
|requestConfig|yes|**[requestConfig](#markdown-header-portalconfigmenusectionsmoduleswfssearchsearchinstancerequestconfig)**||An object, which mainly contains the id of the service (`layerId` or `restLayerId`) that is supposed to be requested. If a WFS@2.0.0 will be used, the `storedQueryId` needs to be provided as well. Additionally, further options for requests can be set.|false|
|selectSource|no|String||Optional Url leading to the expected options for the different inputs. See **[https://geoportal-hamburg.de/lgv-config/gemarkungen_hh.json]** for an example.|false|
|suggestions|no|**[suggestions](#markdown-header-portalconfigmenusectionsmoduleswfssearchsearchinstancesuggestions)**||If given, the service will be queried whenever a user inserts values into an input field to suggest a value.|false|
|title|yes|String||Title of the search instance to be displayed in a dropdown inside the tool.|false|
|userHelp|no|String||Information text regarding the search form to be displayed to the user. If not given, it will be generated from the structure of the config. May be a translation key. If the value is explicitly set to `hide`, no information regarding the structure of the form will be displayed.|false|
|resultDialogTitle|no|String||Heading of the result list. If not configured the name `WFS search` will be displayed. May be a translation key.|false|
|resultList|no|**[resultList](#markdown-header-portalconfigmenusectionsmoduleswfssearchsearchinstanceresultlist)**||Settings for the output of the found features in the result list. If no resultList is configured, the search will zoom directly to the first feature found.|true|

**Example**

```json
{
    "requestConfig": {
        "layerId": "1234"
    },
    "resultList": {
        "schulname": "School name",
        "abschluss": "Degree"
    },
    "selectSource": "https://geoportal-hamburg.de/lgv-config/gemarkungen_hh.json",
    "title": "Parcel Search",
    "literals": [
        {
            "clause": {
                "type": "and",
                "literals": [
                    {
                        "field": {
                            "queryType": "equal",
                            "fieldName": "gemarkung",
                            "inputLabel": "District",
                            "options": ""
                        }
                    },
                    {
                        "field": {
                            "queryType": "equal",
                            "fieldName": "flur",
                            "inputLabel": "Cadastral District",
                            "options": "flur"
                        }
                    }
                ]
            }
        }
    ]
}
```
***

#### Portalconfig.menu.sections.modules.wfsSearch.searchInstance.literal
A `literal` can either have the parameter `clause`, or the parameter `field`. If both are set, the `clause`-part will be ignored.
However, a `field` needs to be wrapped inside a `clause` (as seen in most examples).

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|
|clause|yes|**[clause](#markdown-header-portalconfigmenusectionsmoduleswfssearchsearchinstanceliteralclause)**||Defines the way multiple `literals` should be queried together. Can be seen as a group of `literals`.|true|
|field|no|**[field](#markdown-header-portalconfigmenusectionsmoduleswfssearchsearchinstanceliteralfield)**||Representation for the selection field of a service value for the user.|true|

**Examples**

```json
{
    "clause": {
        "type": "and",
        "literals": [
            {
                "field": {
                    "queryType": "equal",
                    "fieldName": "gemarkung",
                    "inputLabel": "District",
                    "options": ""
                }
            },
            {
                "field": {
                    "queryType": "equal",
                    "fieldName": "flur",
                    "inputLabel": "Cadastral District",
                    "options": "flur"
                }
            }
        ]
    }
}
```

```json
{
    "field": {
        "queryType": "equal",
        "fieldName": "rivers",
        "inputLabel": "Rivers",
        "options": [
            {
                "id": "0",
                "displayName": "Elbe"
            },
            {
                "id": "1",
                "displayName": "Moselle"
            },
            {
                "id": "2",
                "displayName": "Rhine"
            }
        ]
    }
}
```

***

#### Portalconfig.menu.sections.modules.wfsSearch.searchInstance.literal.clause
A `clause` defines the way multiple `literals` should be queried together.

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|
|literals|yes|**[literal](#markdown-header-portalconfigmenusectionsmoduleswfssearchsearchinstanceliteral)**[]||Array of `literals`.|true|
|type|yes|enum["and", "or"]||The way the `literals` in this `clause` should be queried together.|false|

**Example**

```json
{
    "clause": {
        "type": "and",
        "literals": [
            {
                "field": {
                    "queryType": "equal",
                    "fieldName": "gemarkung",
                    "inputLabel": "District",
                    "options": ""
                }
            },
            {
                "field": {
                    "queryType": "equal",
                    "fieldName": "flur",
                    "inputLabel": "Cadastral District",
                    "options": "flur"
                }
            }
        ]
    }
}
```

***

#### Portalconfig.menu.sections.modules.wfsSearch.searchInstance.literal.field
A `field` represents the selection field for a value in the service.
It is possible to use a `field` for multiple search parameters. To do this, each parameter needs to be an array where each element of the array corresponds to a single parameter of the service.
A configuration like

```json
{
    "field": {
        "queryType": ["equal", "like"],
        "fieldName": ["flst", "gmkr"],
        "inputLabel": ["Parcel", "Communal district number"]
    }
}
```

would create a single `field` with which the user can decide whether he wants to use the input field to search for a `Parcel` or a `Communal district number` by selecting the alue through a dropdown.
If the values are not an array, a label for the `field` will be shown instead of the dropdown.

If the parameter `options` is set, a select field is used, otherwise a simple text input.
If `options` is a String, it is important that the order of the fields corresponds to the order of the objects in the external source (`selectSource`).
Assume the source looks like this:

```json
{
    "one": {
        "foo": {
            "id": "foo_one",
            "bar": ["f1_bar_one", "f1_bar_two"]
        }
    },
    "two": {
        "foo": {
            "id": "foo_two",
            "bar": ["f2_bar_one", "f2_bar_two"]
        }
    }
}
```

Then the order of the config should look like this:

```json
{
    "clause": {
        "type": "and",
        "literals": [
            {
                "field": {
                    "queryType": "equal",
                    "fieldName": "objects",
                    "inputLabel": "Objects",
                    "options": ""
                }
            },
            {
                "field": {
                    "queryType": "equal",
                    "fieldName": "foo",
                    "inputLabel": "Foo",
                    "options": "foo"
                }
            },
            {
                "field": {
                    "queryType": "equal",
                    "fieldName": "bar",
                    "inputLabel": "Bar",
                    "options": "foo.bar"
                }
            }
        ]
    }
}
```

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|
|defaultValue|no|String/String[]||If the field is not `required`, this value will be used on sending.|false|
|fieldName|yes|String/String[]||The wfs service parameter name for the comparison.|false|
|inputLabel|yes|String/String[]||Label for the UI element. May be a translation key.|false|
|inputPlaceholder|no|String/String[]||Placeholder for the UI element; only used if `options` is not set. Should contain example data. May be a translation key.|false|
|inputTitle|no|String/String[]||Value to be shown when hovering the UI element. May be a translation key.|false|
|required|no|Boolean/Boolean[]|false|Whether the field has to be filled.|false|
|options|no|String/**[option](#markdown-header-portalconfigmenusectionsmoduleswfssearchsearchinstanceliteralfieldoption)**[]/String[]||If `options` is an array (irrelevant if of strings or **[options](#markdown-header-portalconfigmenusectionsmoduleswfssearchsearchinstanceliteralfieldoption)**), the given values are used for selection. These options may either match **[option](#markdown-header-portalconfigmenusectionsmoduleswfssearchsearchinstanceliteralfieldoption)** or are plain values (`String` / `Number`). In the latter case, the plain value is used as both id and `displayName`. <br /> If it is a String, there are different possibilities: <ul><li>If the String is empty, the keys of **[selectSource](#markdown-header-portalconfigmenusectionsmoduleswfssearchsearchinstance)** are used.</li><li>If the String is not empty, it is assumed that another field with `options=""` exists; otherwise the field is disabled. It is also assumed that the String represents an array in **[selectSource](#markdown-header-portalconfigmenusectionsmoduleswfssearchsearchinstance)** providing further options.</li></ul> **Note**: It is also possible to declare the `options` as a multidimensional array **[option](#markdown-header-portalconfigmenusectionsmoduleswfssearchsearchinstanceliteralfieldoption)**[][]. However, this can't be used as a parameter for Masterportal Admin. This should be used if an **[option](#markdown-header-portalconfigmenusectionsmoduleswfssearchsearchinstanceliteralfieldoption)**[] is wanted for a `field` that uses multiples parameters.|true|
|queryType|no|enum["equal", "like"]/enum["equal", "like"][]||Required for usage with WFS@1.1.0. The `queryType` declared how the field should be compared to the value in the service.|false|
|usesId|no|Boolean/Boolean[]|false|Only relevant if the Parameters `options` is set and an empty String (root element). Determines whether the key of the object of the external source should be used as a value for the query or if the object has an Id which should be used.|false|

**Example**

```json
{
    "field": {
        "queryType": "equal",
        "fieldName": "rivers",
        "inputLabel": "Rivers",
        "options": [
            {
                "displayName": "Elbe",
                "fieldValue": "0"
            },
            {
                "displayName": "Moselle",
                "fieldValue": "1"
            },
            {
                "displayName": "Rhine",
                "fieldValue": "2"
            }
        ]
    }
}
```

***

#### Portalconfig.menu.sections.modules.wfsSearch.searchInstance.literal.field.option
A selectable option for a queryable parameter.

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|
|displayName|no|String||Value to be displayed for the value. May be a translation key. If not set, the `id` will be shown.|false|
|fieldValue|yes|String||Value that is supposed to be sent to the service.|false|

**Example**

```json
{
    "fieldValue": "elbe",
    "displayName": "Elbe"
}
```

***

#### Portalconfig.menu.sections.modules.wfsSearch.searchInstance.resultList
Settings for the output of the found features in the result list.
By specifying `showAll` all attributes of the found features are displayed in their original form.
By using an object, a key of the object must represent one of the attributes of the feature,
and the corresponding value defines the textual output of that attribute.

**Examples**:

```json
{
    "resultList": "showAll"
}
```

```json
{
    "resultList": {
        "schulname": "School name",
        "abschluss": "Degree"
    }
}
```

***

#### Portalconfig.menu.sections.modules.wfsSearch.searchInstance.requestConfig
Information about the WFS service that is supposed to be requested.
Either `layerId` or `restLayerId` need to be present. If `layerId` is chosen, the layer needs to be configured in the **[config.json](config.json.md)**.
If both are defined `restLayerId` is used.

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|
|gazetteer|no|**[gazetteer](#markdown-header-portalconfigmenusectionsmoduleswfssearchsearchinstancerequestconfiggazetteer)**||Declares whether the used WFS service is a WFS-G, which needs to be parsed differently.|false|
|layerId|no|String||Id of the WFS service that should be queried. Information is fetched from **[services.json](services.json.md)**.|false|
|likeFilter|no|**[likeFilter](#markdown-header-portalconfigmenusectionsmoduleswfssearchsearchinstancerequestconfiglikefilter)**|{"wildCard": "*", "singleChar": "#", "escape": "!"}|The configuration of the service for the like filter.|true|
|maxFeatures|no|Number/String|8|Maximum amount of features that are supposed to be returned from the service. Alternatively, the String `showAll` can be assigned to `maxFeatures` to load all features.|false|
|restLayerId|no|String||Id of the WFS service that should be queried. Information is fetched from **[rest-services.json](rest-services.json.md)**.|false|
|storedQueryId|no|String||The id of the Stored Query of the WFS that should be used to query the service. If this field is set, it is assumed that a WFS@2.0.0 is used.|false|

**Example**

```json
{
    "requestConfig": {
        "restLayerId": "1234",
        "storedQueryId": "Flurstuecke"
    }
}
```

***

#### Portalconfig.menu.sections.modules.wfsSearch.searchInstance.requestConfig.likeFilter
Values inside a filter for a WFS service can be compared with an `equal` or a `like`.
If the comparison should be with a `like` then the filter needs additional properties. These may vary in value and property definition.
For the documentation, it is assumed that the properties are called `wildCard`, `singleChar` and `escapeChar`; variations like e.g. `single` and `escape` are possible and need to be configured in line with the service. All key-value pairs are used in the request as given.

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|
|wildCard|yes|String|"*"|The wildcard value for the like filter.|true|
|singleChar|yes|String|"#"|The single character value for the like filter.|true|
|escapeChar|yes|String|"!"|The escape character value for the like filter.|true|

**Example**

In this example case, the key for `escapeChar` deviates.

```json
{
    "wildCard": "*",
    "singleChar": "#",
    "escape": "!"
}
```

***

#### Portalconfig.menu.sections.modules.wfsSearch.searchInstance.requestConfig.gazetteer
Parameters that are exclusively needed for using a WFS-G (Gazetteer).

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|
|namespaces|yes|String/String[]||The namespaces need to be provided.|false|
|memberSuffix|yes|enum["member","featureMember"]||The suffix of the featureType needs to be specified.|false|

**Example**

```json
{
    "gazetteer": {
        "namespaces": [
            "http://www.adv-online.de/namespaces/adv/dog",
            "http://geodienste.hamburg.de/dog_gages/services/wfs_dog?SERVICE=WFS&VERSION=2.0.0&REQUEST=DescribeFeatureType&OUTPUTFORMAT=application/gml+xml;+version=3.2&TYPENAME=dog:Flurstueckskoordinaten&NAMESPACES=xmlns(dog,http://www.adv-online.de/namespaces/adv/dog)"
        ],
        "memberSuffix": "memberSuffix"
    }
}
```

***

#### Portalconfig.menu.sections.modules.wfsSearch.searchInstance.suggestions
Configuration for the suggestions of the user input.

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|
|featureType|no|String||If given, the query will be sent with this featureType instead of the one configured for the service itself. Only usable if the layer was defined in the **[services.json](services.json.md)**.|false|
|length|no|Number|3|The query is triggered when the length of the input is at least as long as this parameter.|false|

***


##### Portalconfig.menu.sections.modules.wfst

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|

***

#### Portalconfig.menu.title
The menu bar allows showing a portal name and portal image.

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|
|link|no|String||URL of an external website to link to.|false|
|logo|no|String||Path to an external image file. If no image is set, the title will be shown without an accompanying logo.|false|
|text|no|String||Portal name.|false|
|toolTip|no|String||Shown on hovering the portal logo.|false|

**Example portalTitle**

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
Defines the initial map view and a background shown when no layer is selected.

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|

***

### Portalconfig.mouseHover
Enables the MouseHover function for vector layers, e.g. WFS or GeoJSON. For per-layer configuration see **[Vector](#markdown-header-themeconfiglayervector)**.

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|
|infoText|no|String|"common:modules.mouseHover.infoText"| Text that will be displayed if the features exceed the number of `numFeaturesToShow`.|false|
|numFeaturesToShow|no|Integer|2|Maximum amount of element information per tooltip; when exceeded, an information text informs the user of cut content.|false|

**Example**

```json
"mouseHover": {
    "numFeaturesToShow": 1,
    "infoText": "Exampletext"
},
```

***

### Portalconfig.portalFooter
Possibility to configure the content of the portal footer.

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|

***

### Portalconfig.tree
Possibility to make settings for the topic selection tree.

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|
|addLayerButton|no|Boolean|false|If true, a button for adding layers will be displayed. Initially only visible layers and layers with the property `showInLayerTree = true` are shown in the topic tree. If false, then all configured layers are shown in the topic tree. With the tree.type `auto` an add button is always shown. |false|
|categories|no|**[categories](#markdown-header-portalconfigtreecategories)**||Configuration of the categories from the metadata. Only for the tree.type `auto`.|false|
|highlightedFeatures|no|**[highlightedFeatures](#markdown-header-portalconfigtreehighlightedfeatures)**||Configuration in addition to highlighting features.|false|
|layerIDsToIgnore|no|String[]||List of `services.json` layer ids that should not be displayed in the tree and map. Only for the tree.type `auto`.|false|
|layerIDsToStyle|no|**[layerIDsToStyle](#markdown-header-portalconfigtreelayeridstostyle)**[]||Special implementation for a HVV service (Hamburger Verkehrsbetriebe). Contains objects to query different styles of a layer ID. Only for the tree.type `auto`.|true|
|layerPills|no|**[layerPills](#markdown-header-portalconfigtreelayerpills)**||Configuration of the LayerPills.|false|
|metaIDsToIgnore|no|String[]||All layers found in `services.json` that match these meta IDs will not be displayed in the tree and map. Only for the tree.type `auto`.|false|
|metaIDsToMerge|no|String[]||All layers found in `services.json` that match these meta-IDs will be merged into a single layer in the tree. Only for the tree.type `auto`.|true|
|type|no|enum["auto"]||The topic tree is built in the same structure as the **[topicconfig](#markdown-header-themenconfig)**. If the type `auto` is configured, all layers from the [services.json](services.json.md) are offered in the tree, structured by their metadata (Geo-Online).|false|
|validLayerTypesAutoTree|no|enum|["WMS", "SENSORTHINGS", "TERRAIN3D", "TILESET3D", "OBLIQUE"]|Layer types to be used with the tree.type `auto`.|false|

**Example type auto**

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

**Example no type**

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
**Example**

```json
 "tree": {
      "addLayerButton": true,
      "layerPills": {
        "active": true
      },
      "highlightedFeatures": {
        "active": true
      }
 }
```

***

### Portalconfig.tree.layerPills
Configuration to make settings for LayerPills.

Layerpills are buttons on top of the map that show the selected layers. When clicking on a LayerPill, the corresponding layer information is displayed in the menu. The close button deselects the layer. The LayerPills attribute is specified as an object and contains the following attributes:

|Name|Required|Type|Default|Description|Expert|
|----|-------------|---|-------|------------|------|
|active|no|Boolean|false|Indicates whether LayerPills are active.|false|
|mobileOnly|no|Boolean|false|Defines whether LayerPills should only be active in the mobile version.|false|


**Example**

```json
"layerPills": {
    "active": true,
    "mobileOnly": true
    }
```

***

#### Portalconfig.tree.categories
Configuration of the categories from the metadata. Only for the tree.type `auto`.

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|
|key|yes|String||Key of the respective category in the metadata.|false|
|name|yes|String||Name of the categorie.|false|
|active|no|Boolean||Indicates whether this category is initially active. If not specified, the 1st category is initially active.|false|

**Example**

```json
 "categories": [
        {
          "key": "categorie_opendata",
          "name": "common:modules.layerTree.categoryOpendata",
          "active": true
        },
        {
          "key": "categorie_inspire",
          "name": "common:modules.layerTree.categoryInspire"
        },
        {
          "key": "categorie_organisation",
          "name": "common:modules.layerTree.categoryOrganisation"
        }
      ]
```

***

#### Portalconfig.tree.highlightedFeatures
Configuration in addition to highlighting features. If features are highlighted with the "List" or "Select Features" module with "Zoom to this Feature" or via url parameter, then a layer with these features is selectable in the menu tree.

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|
|active|no|Boolean|false|Indicates whether this feature is active.|false|
|layerName|no|String|"common:tree.selectedFeatures"|Name of the created layer with the highlighted features. The name additionally contains the name of the module that was worked with.|true|

**Example**

```json
"highlightedFeatures": {
    "active": false,
    "layerName": "Selected features"
},
```

***

#### Portalconfig.tree.layerIDsToStyle
Special implementation for a HVV service (Hamburger Verkehrsbetriebe). Contains objects to query different styles of a layer ID. Only for the tree.type `auto`.

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|
|id|no|String||A `services.json` layer's id.|false|
|styles|no|String/String[]||Style to use as a string; if multiple styles are to be used, they are listed in an array.|false|
|name|no|String/String[]||Name to use as a string; if multiple names are to be used, they are listed in an array.|false|
|legendUrl|no|String/String[]||URL of the legend image as a string ; if multiple legend images are to be used, their URLs are listed in an array.|false|

**Example:**

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
Configuration of the LayerPills.

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|
|active|no|Boolean|false|Indicates whether this feature is active.|false|
|mobileOnly|no|Boolean|false|Indicates whether this feature is active only on small screens.|false|

**Example**

```json
"layerPills": {
    "active": true,
    "mobileOnly": true
    }
```

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
Layers or folders are defined here. Folders can in turn contain **[elements](#markdown-header-themenconfigelements)** with folders or layers.

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|
|name|no|String|""|Layer or folder name.|false|
|type|no|String|"layer"|Type of the lement: "layer" or "folder"|false|
|elements|no|**[elements](#markdown-header-themenconfigelements)**[]||Next layer with layers or folders under the type `folder`.|false|


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

**Example with folders and layers**
```json
{
"elements": [
        {
        "name": "Folder level 1",
        "type": "folder",
        "elements": [
                {
                "name": "Folder level 2",
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
                            "name": "Folder level 3",
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
Here layers of different types are configured. Layers can be configured in many different ways. Most of the attributes are defined in **[services.json](services.json.en.md)**, but can be overridden here at the layer.
Besides these attributes, there are also type-specific attributes for the different layer types.

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|
|id|yes|String/String[]||Layer ID(s). Resolved using the **[services.json](services.json.md)** file. Please mind that the given IDs **MUST** refer to the same URL, that is, use the same service. When configuring an array of IDs, setting `minScale` and `maxScale` of each layer is required to be in the `services.json`. With the special character `.` as suffix, a LayerId can be used multiple times. Each LayerId marked with a suffix creates its own entry in the topic tree.|false|
|name|no|String||Layer name.|false|
|type|no|String|"layer"|Type of the lement: "layer" or "folder"|false|
|transparency|no|Integer|0|Layer transparency.|false|
|visibility|no|Boolean|false|Layer visibility.|false|
|styleId|yes|String||Id of the style. Id defined in the **[style.json](style.json.md)**.|false|
|autoRefresh|no|Integer||Automatically reload layer every `autoRefresh` ms. Minimum value is 500.|false|
|urlIsVisible|no|Boolean|true|Whether the service URL should be shown in the layer information window.|false|
|renderer|no|String|"default"|Which render pipeline to use ("default" or "webgl") (only for vector data of type "GeoJSON", "WFS", "OAF"). "webgl" is currently classified as experimental and can lead to errors in some modules|false|
|isPointLayer|no|Boolean|false|Whether the (vector) layer only consists of point features (only relevant for WebGL rendering)|false|
|showInLayerTree|no|Boolean|false|If true, then the layer is initially displayed in the topic tree. If portalConfig.tree.addLayerButton is not configured, then this attribute has no effect.|false|

**Example**
```json
{
    "elements": [
          {
          "id": "2",
          "name": "Example Layer",
          "typ": "WMS",
          "visibility": false,
          "styleId": "3"
        }
    ]
}
```
**Example with an array of IDs**

```json
{
    "elements": [
        {
            "id": ["123", "456", "789"],
            "name": "My test layer"
        }
    ]
}
```
***
#### Themenconfig.elements.layers.Vector
Vector typical attributes are listed here. Vector layers are vpm type **[WFS](#markdown-header-themenconfigelementslayerswfs)**, GeoJSON (only in EPSG:4326), **[SensorLayer](sensorThings.md)**, and Vector Tile Layer.

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|
|searchField|no|String||Attribute name for which the searchbar searches this layer.|false|
|mouseHoverField|no|String/String[]||Attribute name or array of attribute names to be displayed when the user hovers over a feature.|false|
|||||||

**Example**
```json
{
"elements": [
          {
          "id": "22078",
          "name": "Residents parking areas Hamburg",
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
List of typical WFS query attributes for highlightFeaturesByAttribute. For the invocation parameters see **[urlParameter](urlParameter.md)**.
```
Example invocations:
?api/highlightFeaturesByAttribute=1&wfsId=1&attributeName=DK5&attributeValue=valueToSearchFor&attributeQuery=isequal
?api/highlightFeaturesByAttribute=123&wfsId=1711&attributeName=name&attributeValue=Helios%20ENDO-Klinik%20Hamburg&attributeQuery=IsLike
?api/highlightFeaturesByAttribute=123&wfsId=2003&attributeName=gebietsname&attributeValue=NSG%20Zollenspieker&attributeQuery=isequal
?api/highlightFeaturesByAttribute=123&wfsId=2928&attributeName=biotop_nr&attributeValue=279&attributeQuery=isLike
```

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|
|featurePrefix|yes|String||Search prefix for the WFS query - e.g. app:.|true|
|wildCard|yes|String||The wildcard character for the WFS query -e.g. %|true|
|singleChar|yes|String||The single character for the WFS query - e.g. #|true|
|escapeChar|yes|String||The escape character for the WFS query - e.g. \||true|
|valueDelimiter|no|String||The value delimiter for isIn queries attributeValue, defaulting to semicolon|true|

**Example**

```json
{
    "id": "1",
    "styleId": "1",
    "visibility": false,
    "name": "Animal species invasive",
    "featurePrefix": "app:",
    "wildCard": "%",
    "singleChar": "#",
    "escapeChar": "!"
}
```
***
