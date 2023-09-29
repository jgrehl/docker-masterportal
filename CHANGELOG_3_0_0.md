# Changelog Masterportal v3.0.0
 All important changes in this project are stored in this file.

[Semantic versioning](https://semver.org/spec/v2.0.0.html) is used.


## 2023-10-04 v3.0.0 - beta1

### __Breaking Changes__
- The `wfsSearch` modules config.json parameter 'field'-property `type` was renamed to `queryType`
- New config.json parameter 'tree' added. Contains:
  - 'type' (was 'treeType' at root before), the following params are possible: "auto" ( = old "default") or "light"
  - 'addLayerButton': if true, a button to add layers is shown. On the first menu side only Layers configured in config.json with attribute 'showInLayerTree':true or "visibility": true is shown.
  - 'validLayerTypesAutoTree' (new parameter) only for tree type 'auto'
  - 'layerIDsToIgnore' (moved from config.js) only for tree type 'auto'
  - 'metaIDsToMerge' (moved from config.js) only for tree type 'auto'
  - 'metaIDsToIgnore' (moved from config.js) only for tree type 'auto'
  - 'layerIDsToStyle' (moved from config.js) only for tree type 'auto'
  - 'categories': only for tree type 'auto', contains categories in datasets of layers. Tree is structured by them.
  - configuration of 'Fachdaten' changed
- The attribute 'cache' on the layer is no longer taken into account with tree.type 'auto
- Controls: a control can only be configured in config.json as "expandable". "bottomControl" is no longer supported.
- 'supportedTreeTypes': attribute was added like 'supportedDevices' and 'supportedMapModes' to make it configurable in which tree type the module should be displayed; default value is light.
- GetFeatureInfo:
    - The `gfi` module has been renamed to `getFeatureInfo` and is now configured at the top level in config.json/portalconfigs.
    - The menu side can be accessed under Portalconfig.getFeatureInfo.menuSide.
- The `startTool` control has been renamed to `startModule`. Modules are now completely configured within the control.
- Update from vue 2 to vue 3
- The configuration for `mouseHover` is moved from config.js to config.json. Also, the configuration is now optional.
- PortalFooter
    - The Footer has been renamed to `portalFooter` and its configuration has been moved from config.js to config.json.
    - The `scaleLine` is now a fixed part of the `portaFooter` and is configured within it.
    - In the `portalFooter` only `urls` and the `scaleLine` are configured. For the other contents e.g. `version` or `footerInfo` a module is created in the menu. Language switching has also been moved to a separate `language` module.
    - The width of the ScaleLine [in cm] can now be configured with the attribute `scaleLineWidth`.
- The 'active' attribute has been removed from the modules. Instead, a module to be displayed initially can now be defined centrally for each menu window with the attribute `currentComponent`.
- LayerIds can no longer be configured as Object in the layer configuration (config.json). Instead the suffix `#` should be used to use a LayerId more than once.
- The `mapMarker` is now a part of `map`.
- You can configure the possibility to add attachments to the `contact` form.
- Script to migrate masterportal configuration files to version 3.0.0.
- The layer attribution is now displayed in an alert when a layer is activated for the first time.
- It is now possible to configure a search interface more than once. For example `elasticSearch`.
- Time library moment.js has been replaced with day.js.
- `Searchbar`: The searchbar has been refactored with new options e.g. that the order of the search results can be configured accordingly the order of the searchInstances in the config.json. Furthermore, the search results are categorized by the different search categories. ClickEvents can be defined for search results (e.g. zooming to results). Furthermore, buttons can be defined for the individual search interfaces, which are displayed at each search result that is visible after clicking on "show all". E.g. for addresses, a button can be configured that allows to open the routing module with a certain start address.

### Added
- Added documentation file doc\jsdoc.md for jsdoc in vue-components and vuex-files.
- LayerPreview: Preview images can be generated and displayed for layer types WMS, WMTS and VectorTile. The layer preview was added to the layerTree.
- The following NPM package was added:
    - dependencies:
        - @panter/vue-i18next
        - dayjs
    - devDependencies:
        - @vue/compiler-sfc
        - @vue/devtools-api
        - cross-env
        - jsdoc
        - jsdoc-vuejs
        - shelljs
        - sinon-chai
- A new module `about` has been implemented, which can be used to show detailed information about a portal.
- A new module `baseLayerSwitcher` allows to selected base layers by preview images from a configurable base layer set.
- Different modules were refactored from masterportal dev: `draw`, `filter`, `legend`, `search`, `wmsTime`, `wfst`
- The new control `tiltView` adds two controls that allow you to tilt the 3d map up or down
- Following [Addons](https://bitbucket.org/geowerkstatt-hamburg/addons/src/3.0.0-beta1/addons_3_0_0/) have been refactored:
    - `sdpDownload`, `populationRequest`, `sdpDownload`, `streetsmart`, `vcOblique` and different `gfiThemes`.
    - Additionally a mechanism was added to define searchInterfaces for the searchBar as an addon.
- The layer tree can be filtered by categories e. g. `opendata`.
- 3D print support has been added.
- 3D tile highlighting was refactored from masterportal dev.
- Possibility to use urlParams including searching within searchInterfaces.
- Printing functions for vector styking and legend has been added.
- New draw module (still in development) has been added to the code structure parallel to the refactored draw within the module folder.
### Changed
- The following NPM packages have been updated:
    - dependencies:
        - @masterportal/masterportalapi: 2.17.0 to 2.28.0
        - @vue/compat: 3.2.45 to 3.2.47
        - @popperjs/core: 2.11.5 to 2.11.6
        - axios: 1.2.2 to 1.3.4
        - charts.js: 4.1.1 to 4.2.1
         - i18next: 22.4.8 to 22.4.11
        - i18next-http-backend: 2.1.1 to 2.2.0
        - moment-timezone: 0.5.40 to 0.5.41
        - vue: 3.2.45 to 3.2.47
    - devDependencies:
        - @vue/devtools-api: 6.4.5 to 6.5.0
        - @vue/test-utils: 2.2.7 to 2.3.1
        - esbuild-loader: 2.20.0 to 3.0.1
        - eslint: 8.31.0 to 8.36.0
        - eslint-plugin-vue: 9.8.0 to 9.9.0
        - eslint-plugin-vuejs-accessibility: 2.0.0 to 2.2.0
        - sass: 1.57.1 to 1.59.3
        - sinon: 15.0.1 to 15.0.2

- Support for node 18.16.0 and npm 9.5.1
- UI: SDP-Download UI was updated
- Different terms for baselayer (basemap, backgroundlayer, basemap, hintergrundkarte) have been unified to baselayer
- Searchbar: custom actions can be configured as buttons at each search result in list of all search results.
- Changes in routing-components in order to improve accessibility.
- The layer pills are now animated, work with the menu and only show the arrow buttons when useful.
- Proxy function handling has been centralized.

### Deprecated

### Removed
- The url parameter `TOOLS/[tool-id]` was removed. The `MENU` parameter can be used instead.
- The following NPM packages are removed:
    - dependencies
        - @vue/compiler-sfc
        - rbush
        - rbush-knn
        - vcs-oblique
        - vue-template-compiler
        - vue2-datepicker
    - devDependencies:
        - raf
        - string-replace-loader
        - sinon-chai
        - webpack-visualizer-plugin
- The loader start screen has been removed.
- The layerAttribution control no longer exists. Instead, when a layer that has a layerAttribution is turned on, it is displayed as an alert.
- Several warnings have been removed from alerting as they are unnecessary.
- LayerAttribution is shown only once when the layer has been selected.

### Fixed
- Issue #1072: Fixed a problem when launching the portal with addons_3_0_0.
- 3D layer tree folder issues have been fixed. Vectortile layer appearing again.
- SpecialWFS search: Bugs related to MultiPolygon and Point handling, result handling, getWKTGeom have been resolved.
- Controls can be shown now on mobile mode.
- Errors in `selectFeatures` have been fixed.
- Printing Bugs with area and line measurements have been fixed in `measure` module.
- Design Bugs of the GFI window have been fixed e.g. the display of arrows.
- Different mobil bugs within `coordToolkit` have been fixed.
- Errors within the menu navigation in combination with different modules have been removed.
- UI: different Issues have been resolved and the design has been generalized.
- Legend display for WFS layer has been fixed.

---

## 2023-03-01 v3.0.0 - alpha1
### Added
- The following NPM package was added:
    - devDependencies:
        - @babel/plugin-transform-modules-commonjs
        - @vue/devtools-api
        - @vue/compiler-sfc
        - i18next-vue
- A new module `OpenConfig` has been implemented, which can be used to load a new configuration file (config.json) at runtime.
- A new module `News` has been implemented, it displays the recent alerts.
- A new module in menu `CustomMenuElement` has been implemented. It can open a link, display html from config.json or from external file or dispatch an action.
- Modules can now have an attribute `hasMouseMapInteractions`. Only one module that has this attribute set to `true` can be open at the same time.

### Changed
- Parameters moved from config.js to config.json:
  - 'layerIDsToIgnore'
  - 'metaIDsToMerge'
  - 'metaIDsToIgnore'
  - 'layerIDsToStyle'
- The Control-Bar Design

### Deprecated

### Removed
- The following NPM packages are removed:
    - dependencies
        - @panter/vue-i18next
        - backbone
        - backbone.radio
        - bootstrap-colorpicker
        - bootstrap-datepicker
        - bootstrap-toggle
        - jquery
        - jquery-ui
        - rbush
        - rbush-knn
        - vcs-oblique
        - vue-template-compiler
        - vue2-datepicker
    - devDependencies:
        - eslint-plugin-backbone
        - eslint-plugin-you-dont-need-lodash-underscore
        - jsdoc
        - sinon-chai
- Module print: The attribute `mapfishServiceId` has been removed. Use `printServiceId` instead.
- Module contact: The attribute `serviceID` has been removed. Use `serviceId` instead.


