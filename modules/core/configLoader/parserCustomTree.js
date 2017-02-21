define([
    "modules/core/configLoader/parser",

], function () {

    var Parser = require("modules/core/configLoader/parser"),

        CustomTreeParser;

    CustomTreeParser = Parser.extend({

        /**
         * Parsed response.Themenconfig
         * Die Objekte aus der config.json und services.json werden über die Id zusammengeführt
         * @param  {Object} object - Baselayer | Overlayer | Folder
         * @param  {string} parentId
         * @param  {Number} level - Rekursionsebene = Ebene im Themenbaum
         */
        parseTree: function (object, parentId, level, isBaseLayer) {
            if (_.has(object, "Layer")) {
                _.each(object.Layer, function (layer) {
                    // Für Singel-Layer (ol.layer.Layer)
                    // z.B.: {id: "5181", visible: false}
                    if (_.isString(layer.id)) {
                        var objFromRawList = Radio.request("RawLayerList", "getLayerAttributesWhere", {id: layer.id});

                        layer = _.extend(objFromRawList, layer, {isBaseLayer: isBaseLayer});
                        if (_.isNull(objFromRawList)) { // Wenn LayerID nicht definiert, dann Abbruch
                            return;
                        }
                    }
                    // Für Single-Layer (ol.layer.Layer) mit mehreren Layern(FNP, LAPRO, Geobasisdaten (farbig), etc.)
                    // z.B.: {id: ["550,551,552,...,559"], visible: false}
                    else if (_.isArray(layer.id) && _.isString(layer.id[0])) {
                        var objsFromRawList = Radio.request("RawLayerList", "getLayerAttributesList"),
                            mergedObjsFromRawList = this.mergeObjectsByIds(layer.id, objsFromRawList);

                        if (layer.id.length !== mergedObjsFromRawList.layers.split(",").length) { // Wenn nicht alle LayerIDs des Arrays definiert, dann Abbruch
                            return;
                        }
                        layer = _.extend(mergedObjsFromRawList, _.omit(layer, "id"));
                    }
                    // Für Gruppen-Layer (ol.layer.Group)
                    // z.B.: {id: [{ id: "1364" }, { id: "1365" }], visible: false }
                    else if (_.isArray(layer.id) && _.isObject(layer.id[0])) {
                        var layerdefinitions = [];

                        _.each(layer.id, function (childLayer) {
                            var objFromRawList = Radio.request("RawLayerList", "getLayerAttributesWhere", {id: childLayer.id});

                            if (!_.isNull(objFromRawList)) {
                                layerdefinitions.push(objFromRawList);
                            }
                        });
                        layer = _.extend(layer, {typ: "GROUP", id: layerdefinitions[0].id, layerdefinitions: layerdefinitions, isBaseLayer: isBaseLayer});
                        if (layer.id.length !== layerdefinitions.length) { // Wenn nicht alle LayerIDs des Arrays definiert, dann Abbruch
                            return;
                        }
                    }

                    // HVV :(
                    if (_.has(layer, "styles") && layer.styles.length >= 1) {
                        _.each(layer.styles, function (style, index) {
                            this.addItem(_.extend(
                                {
                                    type: "layer",
                                    parentId: parentId,
                                    name: layer.name[index],
                                    id: layer.id + style.toLowerCase(),
                                    styles: layer.styles[index],
                                    level: level,
                                    isVisibleInTree: this.getIsVisibleInTree(level, "folder", true)
                                }, _.omit(layer, "id", "name", "styles")));
                        }, this);
                    }
                    else {
                        this.addItem(_.extend(
                            {
                                type: "layer",
                                parentId: parentId,
                                level: level,
                                format: "image/png",
                                isVisibleInTree: this.getIsVisibleInTree(level, "folder", true),
                                isBaseLayer: isBaseLayer
                            }, layer));
                    }
                }, this);
            }
            if (_.has(object, "Ordner")) {
                _.each(object.Ordner, function (folder) {
                    var isLeafFolder = (!_.has(folder, "Ordner")) ? true : false;

                    folder.id = this.createUniqId(folder.Titel);
                    this.addItem(
                    {
                        type: "folder",
                        parentId: parentId,
                        name: folder.Titel,
                        id: folder.id,
                        isLeafFolder: isLeafFolder,
                        level: level,
                        glyphicon: "glyphicon-plus-sign",
                        isVisibleInTree: this.getIsVisibleInTree(level, "folder", true),
                        isInThemen: true
                    });
                    // rekursiver Aufruf
                    this.parseTree(folder, folder.id, level + 1, isBaseLayer);
                }, this);
            }
        },
        getIsVisibleInTree: function (level, type, isInThemen) {
            isInThemen = _.isUndefined(isInThemen) ? false : isInThemen;
            return level === 0 && ((type === "layer") || (type === "folder" && isInThemen));
        }
    });

    return CustomTreeParser;
});
