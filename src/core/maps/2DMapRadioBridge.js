import store from "../../app-store";

const channel = Radio.channel("Map");

channel.reply({
    "getLayers": function () {
        return store.getters["Maps/get2DMap"].getLayers();
    },
    "createLayerIfNotExists": function (layerName) {
        return store.dispatch("Maps/addNewLayerIfNotExists", {layerName});
    },
    "getSize": function () {
        return store.getters["Maps/get2DMap"].getSize();
    },
    "registerListener": function (event, callback, context) {
        store.dispatch("Maps/registerListener", {event: event, callback: callback, context: context});
    },
    "getMap": function () {
        return store.getters["Maps/get2DMap"];
    },
    "getLayerByName": function (name) {
        return store.dispatch("Maps/getLayerByName", name);
    },
    "getMapMode": function () {
        return store.getters["Maps/mode"];
    }
});

channel.on({
    "addLayerToIndex": function (args) {
        store.dispatch("Maps/addLayerToIndex", {layer: args[0], zIndex: args[1]});
    },
    "addLayerOnTop": function (layer) {
        store.dispatch("Maps/addLayer", layer);
    },
    "addOverlay": async function (overlay) {
        await store.getters["Maps/get2DMap"].addOverlay(overlay);
    },
    "addInteraction": function (interaction) {
        store.dispatch("Maps/addInteraction", interaction);
    },
    "removeLayer": function (layer) {
        store.getters["Maps/get2DMap"].removeLayer(layer);
    },
    "removeOverlay": async function (overlay) {
        await store.getters["Maps/get2DMap"].removeOverlay(overlay);
    },
    "removeInteraction": function (interaction) {
        store.dispatch("Maps/removeInteraction", interaction);
    },
    "setBBox": function (bbox) {
        store.commit("Maps/setBBox", {bbox: bbox});
    },
    "render": function () {
        store.getters["Maps/get2DMap"].render();
    },
    "zoomToExtent": function (extentOptions) {
        store.dispatch("Maps/zoomToExtent", {extent: extentOptions.extent, options: extentOptions.options});
    },
    "zoomToProjExtent": function (data) {
        store.dispatch("Maps/zoomToProjExtent", {data: data});
    },
    "zoomToFilteredFeatures": function (ids, layerId, zoomOptions) {
        store.dispatch("Maps/zoomToFilteredFeatures", {ids: ids, layerId: layerId, zoomOptions: zoomOptions});
    },
    "registerListener": function (event, callback) {
        store.dispatch("Maps/registerListener", {event: event, callback: callback});
    },
    "unregisterListener": function (event, callback) {
        store.dispatch("Maps/unregisterListener", {event: event, callback: callback});
    },
    "updateSize": function () {
        store.getters["Maps/get2DMap"].updateSize();
    }
});
