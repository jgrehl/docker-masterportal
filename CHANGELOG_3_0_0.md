# Changelog Masterportal v3.0.0
 All important changes in this project are stored in this file.

[Semantic versioning](https://semver.org/spec/v2.0.0.html) is used.


## v3.0.0 - future

### __Breaking Changes__
- the `wfsSearch` modules config.json parameter 'field'-property `type` was renamed to `queryType`
- new config.json parameter 'tree' added. Containes:
    - 'type' (was 'treeType' at root before), the following params are possible: "auto" ( = old "default") or "light"
    - 'addLayerButton': if true, a button to add layers is shown. On first menu side only Layers configured in config.json with attribute 'showInLayerTree':true or "visibility": true are shown.
    - 'validLayerTypesAutoTree' (new parameter) only for tree type 'auto'
    - 'layerIDsToIgnore' (moved from config.js) only for tree type 'auto'
    - 'metaIDsToMerge' (moved from config.js) only for tree type 'auto'
    - 'metaIDsToIgnore' (moved from config.js) only for tree type 'auto'
    - 'layerIDsToStyle' (moved from config.js) only for tree type 'auto'
    - 'categories': only for tree type 'auto', contains categories in datasets of layers. Tree is structured by them.
    - configuration of 'Fachdaten' changed
- the attribute 'cache' on the layer is no longer taken into account with tree.type 'auto
- controls: a control can only be configured in config.json as "expandable". "bottomControl" is not longer supported.
- 'supportedTreeTypes': attribute was added like 'supportedDevices' and 'supportedMapModes' to make it configurable in which tree type the module should be displayed; default value is light.
- getFeatureInfo:
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
- You can configure the posiibility to add attachments to the `contact` form.
- Added documentation file doc\jsdoc.md for jsdoc in vue-components and vuex-files.
- Script to migrate masterportal configuration files to version 3.0.0
- The layer attribution is now displayed in an alert when a layer is activated for the first time
- It is now possible to configure a search interface more than once. For example `elasticSerch`.
- Searchbar: buttons can be defined for the individual search interfaces, which are displayed at each search result that is visible after clicking on "show all".

### Added
- LayerPreview: Preview images can be generated and displayed for layer types WMS, WMTS and VectorTile.
- The following NPM package was added:
    - dependencies:
        - @vue/compat
        - @vue/compiler-sfc
        - i18next-vue
        - qrcode
        - vue-datepicker-next
        - vuedraggable
    - devDependencies:
        - @vue/devtools-api
- A new module `OpenConfig` has been implemented, which can be used to load a new configuration file (config.json) at runtime.  
- A new module `News` has been implemented, it displays the recent alerts.
- A new module in menu `CustomMenuElement` has been implemented. It can open a link, display html from config.json or from external file or dispatch an action.
- Modules can now have an attribute `hasMouseMapInteractions`. Only one module that has this attribute set to `true` can be open at the same time.      
- Added documentation file doc\jsdoc.md for jsdoc in vue-components and vuex-files.

### Changed
- The following NPM packages have been updated:
    - dependencies:
        - @masterportal/masterportalapi: 2.17.0 to xxx
        - @popperjs/core: 2.11.5 to 2.11.6
        - bootstrap: 5.2.0 to 5.2.2
        - charts.js to 4.2.1
        - i18next-browser-languagedetector: 6.1.4 to 6.1.8
        - i18next-http-backend: 1.4.1 to 1.4.5
        - moment-timezone: 0.5.34 to 0.5.37
        - vue: 2.7.8 to 3.1.0
        - vuex: 3.6.2 to 4.0.2
    - devDependencies:
        - @masterportal/mpconfigparser: 1.3.0 to 1.3.1
        - @vue/test-utils to 2.3.1
        - fs-extra to 11.1.0
        - mocha: 10.0.0 to 10.1.0
        - vue-loader: 15.9.8 to 17.0.1
- Parameters moved from config.js to config.json:
    - 'layerIDsToIgnore'
    - 'metaIDsToMerge'
    - 'metaIDsToIgnore'
    - 'layerIDsToStyle'
- The Control-Bar Design changed
- different terms for baselayer (basemap, backgroundlayer, basemap, hintergrundkarte) have been unified to baselayer
- Searchbar: custom actions can be configured to show as buttons at each search result in list of all results.

### Deprecated

### Removed
- The url parameter `TOOLS/[tool-id]` was removed. The `MENU` parameter can be used instead.
- The following NPM packages are removed:
    - dependencies
        - @panter/vue-i18next
        - backbone
        - backbone.radio
        - bootstrap-colorpicker
        - bootstrap-datepicker
        - bootstrap-slider
        - bootstrap-toggle
        - jquery
        - jquery-ui
        - rbush
        - rbush-knn
        - vcs-oblique
        - vue-template-compiler
        - vue2-datepicker
    - devDependencies:
        - dotenv
        - eslint-plugin-backbone
        - eslint-plugin-you-dont-need-lodash-underscore
        - jaguarjs-jsdoc
        - jsdoc
        - jsdom
        - node-fetch
        - npm-run-all
        - raf
        - selenium-webdriver
        - sinon-chai
        - webpack-visualizer-plugin
- Module print: The attribute `mapfishServiceId` has been removed. Use `printServiceId` instead.
- Module contact: The attribute `serviceID` has been removed. Use `serviceId` instead.
- The loader start screen has been removed.
- The layerAttribution control no longer exists. Instead, when a layer that has a layerAttribution is turned on, it is displayed as an alert.

### Fixed
