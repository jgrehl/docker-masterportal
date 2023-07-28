const toolsNotToMigrate = [
        "compareFeatures",
        "saveSelection",
        "addLayerRemotely",
        "bauforum",
        "boris",
        "commuterFlows",
        "cosi",
        "fileImportAddon",
        "formular",
        "geoAnalyze",
        "gfiOnAddress",
        "hochWasserPrint",
        "mietenspiegelFormular",
        "oktagonKartenportal",
        "quickResponseCode",
        "refugeeHomes",
        "resetTree",
        "schoolRoutePlanning",
        "sessionTool",
        "showParcelGFI",
        "tacticalMark",
        "valuationPrint",
        "verkehrsfunctions",
        "vpiDashboard",
        "vueAddon",
        "wholeCityList"
    ],
    deprecated = ["searchByCoord", "supplyCoord", "parcelSearch", "extendedFilter"],
    // toRemoveFromTools => attributes not to provide at tool-configs in v3.0.0
    toRemoveFromTools = {
        "all": ["icon", "renderToWindow", "active", "isVisibleInMenu", "resizableWindow", "initialWidth", "glyphicon"],
        "draw": ["enableAttributesSelector", "iconList", "addIconsOfActiveLayers"],
        "legend": ["showCollapseAllButton"],
        "getFeatureInfo": ["name", "centerMapToClickPoint", "desktopType"]
    },
    toRemoveFromConfigJs = ["footer", "defaultToolId", "scaleLine", "tree.layerIDsToIgnore", "tree.layerIDsToStyle", "tree.metaIDsToMerge", "tree.metaIDsToIgnore"],
    replacementsInConfigJson = {
        "menu.tools.parcelSearch": "modules.wfsSearch.parcelSearch",
        "modules.tools.wfsSearch": "modules.wfsSearch",
        "modules.tools.gfi": "modules.getFeatureInfo",
        "modules.footer": "modules.portalFooter",
        "modules.tools.layerSlider": "modules.layerSlider",
        "menu.filter": "modules.filter.name",
        "menu.contact": "modules.contact.name",
        "menu.tools.print": "modules.print.name",
        "modules.searchbar": "modules.searchBar",
        "translate#common": "common",
        "translate#additional": "additional",
        "\"clusterList\":": "\"layerIdList\":", // module LayerClusterToggler
        "\"iconFor\":": "\"iconForward\":", // control "BackForward"
        "\"type\": \"gfi\"": "\"type\":\"getFeatureInfo\""// module gfi
    };

module.exports = {
    deprecated,
    replacementsInConfigJson,
    toolsNotToMigrate,
    toRemoveFromConfigJs,
    toRemoveFromTools
};
