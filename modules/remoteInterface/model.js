import {getCenter} from "ol/extent.js";

const RemoteInterface = Backbone.Model.extend({
    defaults: {
        postMessageUrl: "https://localhost:8080"
    },
    initialize: function () {
        var channel = Radio.channel("RemoteInterface");

        channel.reply({
            "getMapState": this.getMapState,
            "getWGS84MapSizeBBOX": this.getWGS84MapSizeBBOX
        }, this);

        channel.on({
            "showAllFeatures": this.showAllFeatures,
            "showFeaturesById": this.showFeaturesById,
            "showPositionByExtent": this.showPositionByExtent,
            "removeAllFeaturesFromLayer": this.removeAllFeaturesFromLayer,
            "resetView": this.resetView,
            "setModelAttributesById": this.setModelAttributesById,
            "postMessage": this.postMessage
        }, this);
        window.addEventListener("message", this.receiveMessage.bind(this));
    },

    /**
     * handles the postMessage events
     * @param  {MessageEvent} event -
     * @returns {void}
     */
    receiveMessage: function (event) {
        if (event.origin !== this.get("postMessageUrl")) {
            return;
        }
        /*  Hiermit kann jedes beliebige Radio im Masterportal angetriggert werden
            Die Postmessage muss den radio_channel und die radio_function setzen, dann wird das Radio
            mit diesen Werten angetriggert.
            Falls Parameter übergeben werden sollen, muss die Radio-Funktion diese als Objekt erwarten.
            Das Parameter-Objekt muss der Postmessage als radio_para_object übergeben werden.
        */
        if (event.data.hasOwnProperty("radio_channel") && event.data.hasOwnProperty("radio_function")) {
            if (event.data.hasOwnProperty("radio_para_object")) {
                Radio.trigger(event.data.radio_channel, event.data.radio_function, event.data.radio_para_object);
            }
            else {
                Radio.trigger(event.data.radio_channel, event.data.radio_function);
            }
            return;
        }
        if (event.data.hasOwnProperty("showPositionByExtent")) {
            this.showPositionByExtent(event.data.showPositionByExtent);
        }
        else if (event.data.hasOwnProperty("showPositionByExtentNoScroll")) {
            this.showPositionByExtentNoScroll(event.data.showPositionByExtentNoScroll);
        }
        else if (event.data.hasOwnProperty("transactFeatureById")) {
            Radio.trigger("wfsTransaction", "transact", event.data.layerId, event.data.transactFeatureById, event.data.mode, event.data.attributes);
        }
        else if (event.data.hasOwnProperty("zoomToExtent")) {
            Radio.trigger("Map", "zoomToExtent", event.data.zoomToExtent);
        }
        else if (event.data.hasOwnProperty("highlightfeature")) {
            Radio.trigger("Highlightfeature", "highlightfeature", event.data.highlightfeature);
        }
        else if (event.data === "hidePosition") {
            Radio.trigger("MapMarker", "hideMarker");
        }
    },
    /**
     * sends Message to remotehost via postMessage Api
     * @param  {Object} content the Data to be sent
     * @returns {void}
     */
    postMessage: function (content) {
        if (!_.isUndefined(parent)) {
            parent.postMessage(content, this.get("postMessageUrl"));
        }
    },
    /**
     * gets the center coordinate of the feature geometry and triggers it to MapMarker module
     * @param  {String} featureId -
     * @param  {String} layerId -
     * @returns {void}
     */
    showPositionByFeatureId: function (featureId, layerId) {
        var model = Radio.request("ModelList", "getModelByAttributes", {id: layerId}),
            feature = model.get("layerSource").getFeatureById(featureId),
            extent = feature.getGeometry().getExtent(),
            center = getCenter(extent);

        Radio.trigger("MapMarker", "showMarker", center);
        Radio.trigger("MapView", "setCenter", center);
    },
    showPositionByExtent: function (extent) {
        var center = getCenter(extent);

        Radio.trigger("MapMarker", "showMarker", center);
        Radio.trigger("MapView", "setCenter", center);
    },
    showPositionByExtentNoScroll: function (extent) {
        var center = getCenter(extent);

        Radio.trigger("MapMarker", "showMarker", center);
    },
    showAllFeatures: function (id) {
        Radio.trigger("ModelList", "showAllFeatures", id);
    },
    showFeaturesById: function (layerId, featureIds) {
        Radio.trigger("ModelList", "showFeaturesById", layerId, featureIds);
    },
    setModelAttributesById: function (id, attributes) {
        Radio.trigger("ModelList", "setModelAttributesById", id, attributes);
    },
    removeAllFeaturesFromLayer: function () {
        Radio.trigger("Map", "removeAllFeaturesFromLayer", "gewerbeflaechen");
    },
    resetView: function () {
        Radio.trigger("MapView", "resetView");
        Radio.trigger("MapMarker", "hideMarker");
    },
    getMapState: function () {
        return Radio.request("SaveSelection", "getMapState");
    },
    getWGS84MapSizeBBOX: function () {
        return Radio.request("Map", "getWGS84MapSizeBBOX");
    },
    setPostMessageUrl: function (value) {
        this.set("postMessageUrl", value);
    }
});

export default RemoteInterface;
