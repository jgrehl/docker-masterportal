define(function (require) {

    var Radio = require("backbone.radio"),
        Parser = require("modules/core/configLoader/parser"),
        CustomTreeParser;

    CustomTreeParser = Parser.extend({

        /**
         * Parsed response.Themenconfig
         * Die Objekte aus der config.json und services.json werden über die Id zusammengeführt
         * @param  {Object} object - Baselayer | Overlayer | Folder
         * @param  {string} parentId Elternid
         * @param  {Number} level - Rekursionsebene = Ebene im Themenbaum
         * @return {undefined}
         */
        parseTree: function (object, parentId, level) {
            if (_.has(object, "Layer")) {
                _.each(object.Layer, function (layer) {
                    var objFromRawList,
                        objsFromRawList,
                        layerExtended = layer,
                        layerdefinitions,
                        mergedObjsFromRawList;

                    // Für Singel-Layer (ol.layer.Layer)
                    // z.B.: {id: "5181", visible: false}
                    if (_.isString(layerExtended.id)) {
                        objFromRawList = Radio.request("RawLayerList", "getLayerAttributesWhere", {id: layerExtended.id});

                        if (_.isNull(objFromRawList)) { // Wenn LayerID nicht definiert, dann Abbruch
                            return;
                        }
                        layerExtended = _.extend(objFromRawList, layerExtended);
                    }
                    // Für Single-Layer (ol.layer.Layer) mit mehreren Layern(FNP, LAPRO, Geobasisdaten (farbig), etc.)
                    // z.B.: {id: ["550,551,552,...,559"], visible: false}
                    else if (_.isArray(layerExtended.id) && _.isString(layerExtended.id[0])) {
                        objsFromRawList = Radio.request("RawLayerList", "getLayerAttributesList");
                        mergedObjsFromRawList = this.mergeObjectsByIds(layerExtended.id, objsFromRawList);

                        if (layerExtended.id.length !== mergedObjsFromRawList.layers.split(",").length) { // Wenn nicht alle LayerIDs des Arrays definiert, dann Abbruch
                            return;
                        }
                        layerExtended = _.extend(mergedObjsFromRawList, _.omit(layerExtended, "id"));
                    }
                    // Für Gruppen-Layer (ol.layer.Group)
                    // z.B.: {id: [{ id: "1364" }, { id: "1365" }], visible: false }
                    else if (_.isArray(layerExtended.id) && _.isObject(layerExtended.id[0])) {
                        layerdefinitions = [];

                        _.each(layerExtended.id, function (childLayer) {
                            objFromRawList = Radio.request("RawLayerList", "getLayerAttributesWhere", {id: childLayer.id});

                            if (!_.isNull(objFromRawList)) {
                                objFromRawList = _.extend(objFromRawList, childLayer);
                                layerdefinitions.push(objFromRawList);
                            }
                        });
                        if (layerExtended.id.length !== layerdefinitions.length) { // Wenn nicht alle LayerIDs des Arrays definiert, dann Abbruch
                            return;
                        }
                        layerExtended = _.extend(layerExtended, {typ: "GROUP", id: layerdefinitions[0].id + "_groupLayer", layerdefinitions: layerdefinitions});
                        Radio.trigger("RawLayerList", "addGroupLayer", layerExtended);
                    }

                    // HVV :(
                    if (_.has(layerExtended, "styles") && layerExtended.styles.length >= 1) {
                        _.each(layerExtended.styles, function (style, index) {
                            this.addItem(_.extend({
                                type: "layer",
                                parentId: parentId,
                                name: layerExtended.name[index],
                                id: layerExtended.id + style,
                                styles: layerExtended.styles[index],
                                legendURL: layerExtended.legendURL[index],
                                level: level,
                                isVisibleInTree: this.getIsVisibleInTree(level, "folder", true)
                            }, _.omit(layerExtended, "id", "name", "styles", "legendURL")));
                        }, this);
                    }
                    else {
                        this.addItem(_.extend({
                            type: "layer",
                            parentId: parentId,
                            level: level,
                            format: "image/png",
                            isVisibleInTree: this.getIsVisibleInTree(level, "folder", true)
                        }, layerExtended));
                    }
                }, this);
            }
            if (_.has(object, "Ordner")) {
                _.each(object.Ordner, function (folder) {
                    var isLeafFolder = !_.has(folder, "Ordner"),
                        isFolderSelectable;

                    // Visiblity of SelectAll-Box. Use item property first, if not defined use global setting.
                    if (folder.isFolderSelectable === true) {
                        isFolderSelectable = true;
                    }
                    else if (folder.isFolderSelectable === false) {
                        isFolderSelectable = false;
                    }
                    else {
                        isFolderSelectable = this.get("isFolderSelectable");
                    }

                    folder.id = this.createUniqId(folder.Titel);
                    this.addItem({
                        type: "folder",
                        parentId: parentId,
                        name: folder.Titel,
                        id: folder.id,
                        isLeafFolder: isLeafFolder,
                        isFolderSelectable: isFolderSelectable,
                        level: level,
                        glyphicon: "glyphicon-plus-sign",
                        isVisibleInTree: this.getIsVisibleInTree(level, "folder", true),
                        isInThemen: true
                    });
                    // rekursiver Aufruf
                    this.parseTree(folder, folder.id, level + 1);
                }, this);
            }
        },

        getIsVisibleInTree: function (level, type, isInThemen) {
            var isInThemenBool = _.isUndefined(isInThemen) ? false : isInThemen;

            return level === 0 && ((type === "layer") || (type === "folder" && isInThemenBool));
        }
    });

    return CustomTreeParser;
});
