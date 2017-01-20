define([
    "backbone.radio",
    "modules/menu/desktop/listViewMain",
    "modules/menu/desktop/folder/viewTree",
    "modules/menu/desktop/folder/viewCatalog",
    "modules/menu/desktop/layer/viewSelection",
    "modules/menu/desktop/layer/view"
    ], function () {
        var listView = require("modules/menu/desktop/listViewMain"),
            DesktopThemenFolderView = require("modules/menu/desktop/folder/viewTree"),
            CatalogFolderView = require("modules/menu/desktop/folder/viewCatalog"),
            DesktopLayerView = require("modules/menu/desktop/layer/view"),
            SelectionView = require("modules/menu/desktop/layer/viewSelection"),
            Radio = require("backbone.radio"),
            Menu;

        Menu = listView.extend({
            initialize: function () {
                this.collection = Radio.request("ModelList", "getCollection");

                Radio.on("Autostart", "startTool", this.startTool, this);
                this.listenTo(this.collection, {
                    "updateOverlayerView": function (parentId) {
                        this.updateOverlayer(parentId);
                    },
                    "updateSelection": function (model) {
                        this.trigger("updateLightTree");
                        this.renderSelectedList(model);
                    },
                    "renderTree": function () {
                        this.render();
                    }
                });
                this.renderMain();
                this.render();
                this.renderSelectedList();
            },
            render: function () {
                $("#" + "Themen").html("");
                // Eine Themenebene rendern
                this.renderSubTree("Themen", 0, 0, true);
                $("ul#Themen ul#Overlayer").addClass("LayerListMaxHeight");
                $("ul#Themen ul#SelectedLayer").addClass("LayerListMaxHeight");
                $("ul#Themen ul#Baselayer").addClass("LayerListMaxHeight");
                Radio.trigger("Title", "setSize");
            },
            /**
             * Rendert die  Auswahlliste
             * @return {[type]} [description]
             */
            renderSelectedList: function () {
                $("#" + "SelectedLayer").html("");
                var selectedLayerModel = this.collection.findWhere({id: "SelectedLayer"});

                if (selectedLayerModel.getIsExpanded()) {
                    var selectedModels = this.collection.where({isSelected: true, type: "layer"});

                    selectedModels = _.sortBy(selectedModels, function (model) {
                        return model.getSelectionIDX();
                    });
                    this.addSelectionView(selectedModels);
                }
            },
            /**
            * Rendert rekursiv alle Themen unter ParentId bis als rekursionsstufe Levellimit erreicht wurde
             */
            renderSubTree: function (parentId, level, levelLimit, firstTime) {
                if (level > levelLimit) {
                    return;
                }

                var lightModels = Radio.request("Parser", "getItemsByAttributes", {parentId: parentId});

                var models = this.collection.add(lightModels);

                // Ordner öffnen, die initial geöffnet sein sollen
                if (parentId === "Themen") {
                     _.each(models, function (model) {
                        if (model.getType() === "folder" && model.getIsInitiallyExpanded()) {
                            model.setIsExpanded(true);
                        }
                    });
                }

                if (level === 0 && firstTime !== true) {
                    this.collection.setVisibleByParentIsExpanded(parentId);
                }

                var layer = _.filter(models, function (model) {
                        return model.getType() === "layer";
                    });

                // Layer Atlas sortieren
                if (Radio.request("Parser", "getTreeType") === "default") {
                    layer = _.sortBy(layer, function (item) {
                        return item.getName();
                    });
                }
                // Notwendig, da jQuery.after() benutzt werden muss wenn die Layer in den Baum gezeichnet werden, um den Layern auf allen Ebenen die volle Breite des Baumes zu geben
                // Mit jQuery.append würden sie ab der 2. ebene immer mit dem Eltern element zusammen eingerückt werden
                layer.reverse();

                this.addOverlayViews(layer);

                 var folder = _.filter(models, function (model) {
                    return model.getType() === "folder";
                });

                if (Radio.request("Parser", "getTreeType") === "default" && parentId !== "Overlayer" && parentId !== "Themen") {
                    folder = _.sortBy(folder, function (item) {
                        return item.getName();
                    });
                }

                if (parentId !== "Overlayer" && parentId !== "Themen") {
                    folder.reverse();
                }

                this.addOverlayViews(folder);

                _.each(folder, function (folder) {
                    this.renderSubTree(folder.getId(), level + 1, levelLimit, false);
                }, this);
            },
            updateOverlayer: function (parentId) {
                this.renderSubTree(parentId, 0, 0, false);
            },
            addViewsToItemsOfType: function (type, items, parentId) {
                items = _.filter(items, function (model) {
                    return model.getType() === type;
                });

                if (Radio.request("Parser", "getTreeType") === "default" && parentId !== "Themen") {
                    items = _.sortBy(items, function (item) {
                        return item.getName();
                    });
                    if (parentId !== "Overlayer") {
                        items.reverse();
                    }
                }

                this.addOverlayViews(items);
                return items;
            },
            addOverlayViews: function (models) {
                _.each(models, function (model) {
                    if (model.getType() === "folder") {
                        // Oberste ebene im Themenbaum?
                        if (model.getParentId() === "Themen") {
                            new CatalogFolderView({model: model});
                        }
                        else {
                            new DesktopThemenFolderView({model: model});
                        }
                    }
                    else {
                        new DesktopLayerView({model: model});
                    }
                }, this);
            },
            addSelectionView: function (models) {
                _.each(models, function (model) {
                   new SelectionView({model: model});
                }, this);
            },
            startTool: function (toolId) {
                var tools = this.collection.where({type: "tool"}),
                    tool = _.findWhere(tools, {id: toolId});

                if (tool) {
                    tool.setIsActive(true);
                }
            }
        });
        return Menu;
    }
);
