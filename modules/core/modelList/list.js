define(function (require) {

    var $ = require("jquery"),
        WMSLayer = require("modules/core/modelList/layer/wms"),
        WFSLayer = require("modules/core/modelList/layer/wfs"),
        GeoJSONLayer = require("modules/core/modelList/layer/geojson"),
        GROUPLayer = require("modules/core/modelList/layer/group"),
        SensorLayer = require("modules/core/modelList/layer/sensor"),
        HeatmapLayer = require("modules/core/modelList/layer/heatmap"),
        Folder = require("modules/core/modelList/folder/model"),
        Tool = require("modules/core/modelList/tool/model"),
        StaticLink = require("modules/core/modelList/staticlink/model"),
        ModelList;

    ModelList = Backbone.Collection.extend({
        initialize: function () {
            var channel = Radio.channel("ModelList");

            channel.reply({
                "getCollection": this,
                "getModelsByAttributes": function (attributes) {
                    return this.where(attributes);
                },
                "getModelByAttributes": function (attributes) {
                    return this.findWhere(attributes);
                }
            }, this);

            channel.on({
                "setModelAttributesById": this.setModelAttributesById,
                "showAllFeatures": this.showAllFeatures,
                "hideAllFeatures": this.hideAllFeatures,
                "showFeaturesById": this.showFeaturesById,
                "removeModelsByParentId": this.removeModelsByParentId,
                // Initial sichtbare Layer etc.
                "addInitialyNeededModels": this.addInitialyNeededModels,
                "addModelsByAttributes": this.addModelsByAttributes,
                "setIsSelectedOnChildLayers": this.setIsSelectedOnChildLayers,
                "setIsSelectedOnParent": this.setIsSelectedOnParent,
                "showModelInTree": this.showModelInTree,
                "closeAllExpandedFolder": this.closeExpandedFolder,
                "setAllDescendantsInvisible": this.setAllDescendantsInvisible,
                "renderTree": function () {
                    this.trigger("renderTree");
                }
            }, this);

            this.listenTo(this, {
                "change:isVisibleInMap": function () {
                    channel.trigger("updateVisibleInMapList");
                    channel.trigger("updatedSelectedLayerList", this.where({isSelected: true, type: "layer"}));
                },
                "change:isExpanded": function (model) {
                    this.trigger("updateOverlayerView", model.get("id"));
                    if (model.get("id") === "SelectedLayer") {
                        this.trigger("updateSelection", model);
                    }
                    // Trigger für mobiles Wandern im Baum
                    this.trigger("traverseTree", model);
                    channel.trigger("updatedSelectedLayerList", this.where({isSelected: true, type: "layer"}));
                },
                "change:isSelected": function (model) {
                    if (model.get("type") === "layer") {
                        this.resetSelectionIdx(model);
                        model.setIsVisibleInMap(model.get("isSelected"));
                    }
                    this.trigger("updateSelection");
                    channel.trigger("updatedSelectedLayerList", this.where({isSelected: true, type: "layer"}));
                },
                "change:transparency": function () {
                    channel.trigger("updatedSelectedLayerList", this.where({isSelected: true, type: "layer"}));
                },
                "change:selectionIDX": function () {
                    channel.trigger("updatedSelectedLayerList", this.where({isSelected: true, type: "layer"}));
                }
            });
        },
        selectionIDX: [],
        model: function (attrs, options) {
            if (attrs.type === "layer") {
                if (attrs.typ === "WMS") {
                    return new WMSLayer(attrs, options);
                }
                else if (attrs.typ === "WFS") {
                    if (attrs.outputFormat === "GeoJSON") {
                        return new GeoJSONLayer(attrs, options);
                    }
                    return new WFSLayer(attrs, options);

                }
                else if (attrs.typ === "GeoJSON") {
                    return new GeoJSONLayer(attrs, options);
                }
                else if (attrs.typ === "GROUP") {
                    return new GROUPLayer(attrs, options);
                }
                else if (attrs.typ === "SensorThings" || attrs.typ === "ESRIStreamLayer") {
                    return new SensorLayer(attrs, options);
                }
                else if (attrs.typ === "Heatmap") {
                    return new HeatmapLayer(attrs, options);
                }
            }
            else if (attrs.type === "folder") {
                return new Folder(attrs, options);
            }
            else if (attrs.type === "tool") {
                return new Tool(attrs, options);
            }
            else if (attrs.type === "staticlink") {
                return new StaticLink(attrs, options);
            }
            else {
                Radio.trigger("Alert", "alert", "unbekannter LayerTyp " + attrs.type + ". Bitte wenden Sie sich an einen Administrator!");
            }
            return null;
        },
        /**
        * [checkIsExpanded description]
        * @return {[type]} [description]
        */
        closeAllExpandedFolder: function () {
            var folderModel = this.findWhere({isExpanded: true});

            if (!_.isUndefined(folderModel)) {
                folderModel.setIsExpanded(false);
            }
        },

        /**
        * Setzt bei Ã„nderung der Ebene, alle Model
        * auf der neuen Ebene auf sichtbar
        * @param {int} parentId Die Id des Objektes dessen Kinder angezeigt werden sollen
        * @return {undefined}
        */
        setModelsVisibleByParentId: function (parentId) {
            var itemListByParentId = this.where({parentId: parentId}),
                // Falls es ein LeafFolder ist --> "Alle auswÃ¤hlen" Template
                selectedLeafFolder = this.where({id: parentId, isLeafFolder: true});

            _.each(_.union(selectedLeafFolder, itemListByParentId), function (item) {
                item.setIsVisibleInTree(true);
            });
        },
        /**
        * Setzt bei Ã„nderung der Ebene, alle Model
        * auf der alten Ebene auf unsichtbar
        * @param {int} parentId Die Id des Objektes dessen Kinder angezeigt werden sollen
        * @return {undefined}
        */
        setModelsInvisibleByParentId: function (parentId) {
            var children;

            if (parentId === "SelectedLayer") {
                children = this.where({isSelected: true});
            }
            else {
                children = this.where({parentId: parentId});
            }
            _.each(children, function (item) {
                item.setIsVisibleInTree(false);
            });
        },
        /**
        *
        *
        * @param {int} parentId Die Id des Objektes dessen Kinder angezeigt werden sollen
        * @return {undefined}
        */
        setVisibleByParentIsExpanded: function (parentId) {
            var itemListByParentId = this.where({parentId: parentId}),
                parent = this.findWhere({id: parentId});

            if (!parent.get("isExpanded")) {
                this.setAllDescendantsInvisible(parentId);
            }
            else {
                _.each(itemListByParentId, function (item) {
                    item.setIsVisibleInTree(true);
                });
            }
        },
        setAllDescendantsInvisible: function (parentId) {
            var itemListByParentId = this.where({parentId: parentId});

            _.each(itemListByParentId, function (item) {
                item.setIsVisibleInTree(false);
                if (item.get("type") === "folder") {
                    item.setIsExpanded(false, {silent: true});
                }
                this.setAllDescendantsInvisible(item.get("id"));
            }, this);
        },

        /**
        * Setzt alle Models unsichtbar
        * @return {undefined}
        */
        setAllModelsInvisible: function () {
            this.forEach(function (model) {
                model.setIsVisibleInTree(false);
                if (model.get("type") === "folder") {
                    model.setIsExpanded(false, {silent: true});
                }
            });
        },
        /**
        * Alle Layermodels von einem Leaffolder werden "selected" oder "deselected"
        * @param {Backbone.Model} model - folderModel
        * @return {undefined}
        */
        setIsSelectedOnChildLayers: function (model) {
            var layers = this.add(Radio.request("Parser", "getItemsByAttributes", {parentId: model.get("id")}));

            _.each(layers, function (layer) {
                layer.setIsSelected(model.get("isSelected"));
            });
        },
        /**
        * PrÃ¼ft ob alle Layer im Leaffolder isSelected = true sind
        * Falls ja, wird der Leaffolder auch auf isSelected = true gesetzt
        * @param {Backbone.Model} model - layerModel
        * @return {undefined}
        */
        setIsSelectedOnParent: function (model) {
            var layers = this.where({parentId: model.get("parentId")}),
                folderModel = this.findWhere({id: model.get("parentId")}),
                allLayersSelected = _.every(layers, function (layer) {
                    return layer.get("isSelected") === true;
                });

            if (allLayersSelected === true) {
                folderModel.setIsSelected(true);
            }
            else {
                folderModel.setIsSelected(false);
            }
        },

        setActiveToolToFalse: function (model, deactivateGFI) {
            var tools = _.without(this.where({isActive: true}), model);

            _.each(tools, function (tool) {
                if (!_.isUndefined(tool)) {
                    if (model.get("id") !== "gfi" || deactivateGFI) {
                        tool.setIsActive(false);
                    }
                }
            });
        },

        insertIntoSelectionIDX: function (model) {
            var idx = 0;

            if (this.selectionIDX.length === 0 || model.get("parentId") !== "Baselayer") {
                idx = this.appendToSelectionIDX(model);
                // idx = this.selectionIDX.push(model) - 1;
            }
            else {
                while (idx < this.selectionIDX.length && this.selectionIDX[idx].get("parentId") === "Baselayer") {
                    idx++;
                }
                this.selectionIDX.splice(idx, 0, model);
                this.updateModelIndeces();
            }
            return idx;
        },
        insertIntoSelectionIDXAt: function (model, idx) {
            this.selectionIDX.splice(idx, 0, model);
            this.updateModelIndeces();
        },
        appendToSelectionIDX: function (model) {
            var idx = this.selectionIDX.push(model) - 1;

            this.updateModelIndeces();
            return idx;
        },
        removeFromSelectionIDX: function (idx) {
            var deleteCid = idx.cid,
                filteredIDX = _.reject(this.selectionIDX, function (i) {
                    return i.cid === deleteCid;
                });

            this.selectionIDX = filteredIDX;
            this.updateModelIndeces();
        },

        resetSelectionIdx: function (model) {
            if (Radio.request("Parser", "getTreeType") !== "light") {
                if (model.get("isSelected")) {
                    this.insertIntoSelectionIDX(model);
                }
                else {
                    this.removeFromSelectionIDX(model);
                }
            }
        },
        moveModelDown: function (model) {
            var oldIDX = model.get("selectionIDX"),
                newIDX = oldIDX - 1;

            if (oldIDX > 0) {
                this.removeFromSelectionIDX(model);
                this.insertIntoSelectionIDXAt(model, newIDX);
                if (model.get("isSelected")) {
                    Radio.trigger("Map", "addLayerToIndex", [model.get("layer"), newIDX]);
                }
                this.trigger("updateSelection");
                this.trigger("updateLightTree");
                // Trigger fÃ¼r mobil
                this.trigger("changeSelectedList");
            }
        },
        moveModelUp: function (model) {
            var oldIDX = model.get("selectionIDX"),
                newIDX = oldIDX + 1;

            if (oldIDX < this.selectionIDX.length - 1) {
                this.removeFromSelectionIDX(model);
                this.insertIntoSelectionIDXAt(model, newIDX);
                // Auch wenn die Layer im simple Tree noch nicht selected wurde, kÃ¶nnen
                // die Settings angezeigt werden. Das Layer objekt wurden dann jedoch noch nicht erzeugtt und ist undefined
                if (model.get("isSelected")) {
                    Radio.trigger("Map", "addLayerToIndex", [model.get("layer"), newIDX]);
                }
                this.trigger("updateSelection");
                this.trigger("updateLightTree");
                // Trigger fÃ¼r mobil
                this.trigger("changeSelectedList");
            }
        },
        updateModelIndeces: function () {
            _.each(this.selectionIDX, function (model, index) {
                model.setSelectionIDX(index);
            });
        },

        /**
        * Setzt bei allen Models vom Typ "layer" das Attribut "isSettingVisible"
        * @param {boolean} value ist sichtbar?
        * @return {undefined}
        */
        setIsSettingVisible: function (value) {
            var models = this.where({type: "layer"});

            _.each(models, function (model) {
                model.setIsSettingVisible(value);
            });
        },
        /**
        * Im Lighttree alle Models hinzufÃ¼gen ansonsten, die Layer die initial
        * angezeigt werden sollen.
        * @return {undefined}
        */
        addInitialyNeededModels: function () {
            // lighttree: Alle models gleich hinzufÃ¼gen, weil es nicht viele sind und sie direkt einen Selection index
            // benötigen, der ihre Reihenfolge in der Config Json entspricht und nicht der Reihenfolge
            // wie sie hinzugefügt werden
            var paramLayers = Radio.request("ParametricURL", "getLayerParams"),
                treeType = Radio.request("Parser", "getTreeType"),
                lightModels,
                itemIsVisibleInMap,
                lightModel;

            if (treeType === "light") {
                lightModels = Radio.request("Parser", "getItemsByAttributes", {type: "layer"});

                lightModels = this.mergeParamsToLightModels(lightModels, paramLayers);
                this.add(lightModels);
            }
            else if (paramLayers.length > 0) {
                itemIsVisibleInMap = Radio.request("Parser", "getItemsByAttributes", {isVisibleInMap: true});
                _.each(itemIsVisibleInMap, function (layer) {
                    layer.isVisibleInMap = false;
                    layer.isSelected = false;
                }, this);

                _.each(paramLayers, function (paramLayer) {
                    lightModel = Radio.request("Parser", "getItemByAttributes", {id: paramLayer.id});

                    if (_.isUndefined(lightModel) === false) {
                        this.add(lightModel);
                        this.setModelAttributesById(paramLayer.id, {isSelected: true, transparency: paramLayer.transparency});
                        // selektierte Layer werden automatisch sichtbar geschaltet, daher muss hier nochmal der Layer auf nicht sichtbar gestellt werden
                        if (paramLayer.visibility === false && _.isUndefined(this.get(paramLayer.id)) === false) {
                            this.get(paramLayer.id).setIsVisibleInMap(false);
                        }
                    }
                }, this);
            }
            else {
                this.addModelsByAttributes({type: "layer", isSelected: true});
            }

        },

        mergeParamsToLightModels: function (lightModels, paramLayers) {
            lightModels.reverse();
            // Merge die parametrisierten Einstellungen an die geparsten Models
            if (_.isUndefined(paramLayers) === false && paramLayers.length !== 0) {
                _.each(lightModels, function (lightModel) {
                    var hit = _.find(paramLayers, function (paramLayer) {
                        return paramLayer.id === lightModel.id;
                    });

                    if (hit) {
                        lightModel.isSelected = hit.visibility;
                        lightModel.transparency = hit.transparency;
                    }
                    else {
                        lightModel.isSelected = false;
                    }
                });
            }
            return lightModels;
        },

        setModelAttributesById: function (id, attrs) {
            var model = this.get(id);

            if (_.isUndefined(model) === false) {
                model.set(attrs);
            }
        },

        addModelsByAttributes: function (attrs) {
            var lightModels = Radio.request("Parser", "getItemsByAttributes", attrs);

            this.add(lightModels);
        },

        /**
        * Wird aus der Themensuche heraus aufgerufen
        * Ã–ffnet den Themenbaum, selektiert das Model und fÃ¼gt es zur Themenauswahl hinzu
        * @param  {String} modelId die Id des Models
        * @return {undefined}
        */
        showModelInTree: function (modelId) {
            var lightModel = Radio.request("Parser", "getItemByAttributes", {id: modelId});

            this.closeAllExpandedFolder();

            // Ã¶ffnet den Themenbaum
            $("#root li:first-child").addClass("open");
            // Parent und eventuelle Siblings werden hinzugefÃ¼gt
            this.addAndExpandModelsRecursive(lightModel.parentId);
            this.setModelAttributesById(modelId, {isSelected: true});
            // Nur bei Overlayern wird in Tree gescrollt.
            if (lightModel.parentId !== "Baselayer") {
                this.scrollToLayer(lightModel.name);
            }
        },

        /**
        * Scrolled auf den Layer
        * @param {String} overlayername - in "Fachdaten" wird auf diesen Layer gescrolled
        * @return {undefined}
        */
        scrollToLayer: function (overlayername) {
            var liLayer = _.findWhere($("#Overlayer").find("span"), {title: overlayername}),
                offsetFromTop = liLayer ? $(liLayer).offset().top : null,
                heightThemen = $("#tree").css("height"),
                scrollToPx = 0;

            if (offsetFromTop) {
                // die "px" oder "%" vom string lÃ¶schen und zu int parsen
                if (heightThemen.slice(-2) === "px") {
                    heightThemen = parseInt(heightThemen.slice(0, -2), 10);
                }
                else if (heightThemen.slice(-1) === "%") {
                    heightThemen = parseInt(heightThemen.slice(0, -1), 10);
                }

                scrollToPx = (offsetFromTop - heightThemen) / 2;

                $("#Overlayer").animate({
                    scrollTop: scrollToPx
                }, "fast");
            }
        },

        /**
        * Rekursive Methode, die von unten im Themenbaum startet
        * FÃ¼gt alle Models der gleichen Ebene zur Liste hinzu, holt sich das Parent-Model und ruft sich selbst auf
        * Beim ZurÃ¼cklaufen werden die Parent-Models expanded
        * @param {String} parentId - Models mit dieser parentId werden zur Liste hinzugefÃ¼gt
        * @return {undefined}
        */
        addAndExpandModelsRecursive: function (parentId) {
            var lightSiblingsModels = Radio.request("Parser", "getItemsByAttributes", {parentId: parentId}),
                parentModel = Radio.request("Parser", "getItemByAttributes", {id: lightSiblingsModels[0].parentId});

            this.add(lightSiblingsModels);
            // Abbruchbedingung
            if (_.isUndefined(parentModel) === false && parentModel.id !== "tree") {
                this.addAndExpandModelsRecursive(parentModel.parentId);
                this.get(parentModel.id).setIsExpanded(true);
            }
        },

        toggleCatalogs: function (id) {
            _.each(this.where({parentId: "tree"}), function (model) {
                if (model.get("id") !== id) {
                    model.setIsExpanded(false);
                }
            }, this);
        },

        /**
        * [removeModelsByParentId description]
        * @param  {[type]} parentId [description]
        * @return {[type]}          [description]
        */
        removeModelsByParentId: function (parentId) {
            _.each(this.where({parentId: parentId}), function (model) {
                if (model.get("type") === "layer" && model.get("isVisibleInMap") === true) {
                    model.setIsVisibleInMap(false);
                }
                model.setIsVisibleInTree(false);

                this.remove(model);
            }, this);
        },

        showAllFeatures: function (id) {
            var model = this.get(id);

            model.showAllFeatures();
        },

        showFeaturesById: function (id, featureIds) {
            var model = this.get(id);

            model.showFeaturesByIds(featureIds);
        },
        hideAllFeatures: function (id) {
            var model = this.get(id);

            model.hideAllFeatures();
        }

    });

    return ModelList;
});
