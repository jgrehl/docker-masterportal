define(function (require) {

    var Layer = require("modules/core/modelList/layer/model"),
        Cesium = require("cesium"),
        TerrainLayer;

    TerrainLayer = Layer.extend({
        defaults: _.extend({}, Layer.prototype.defaults, {
            supported: ["3D"],
            showSettings: false
        }),
        initialize: function () {
            this.listenToOnce(this, {
                // Die LayerSource wird beim ersten Selektieren einmalig erstellt
                "change:isSelected": function () {
                    if (this.has("terrainProvider") === false) {
                        this.createTerrainProvider();
                    }
                }
            });
            this.listenTo(Radio.channel("Layer"), {
                "updateLayerInfo": function (name) {
                    if (this.get("name") === name && this.getLayerInfoChecked() === true) {
                        this.showLayerInformation();
                    }
                },
                "setLayerInfoChecked": function (layerInfoChecked) {
                    this.setLayerInfoChecked(layerInfoChecked);
                }
            });


            this.listenTo(this, {
                "change:isVisibleInMap": function () {
                    // triggert das Ein- und Ausschalten von Layern
                    Radio.trigger("ClickCounter", "layerVisibleChanged");
                    this.toggleLayerOnMap();
                    this.toggleAttributionsInterval();
                }
            });

            //  Ol Layer anhängen, wenn die Layer initial Sichtbar sein soll
            //  Im Lighttree auch nicht selektierte, da dort alle Layer von anfang an einen
            //  selectionIDX benötigen, um verschoben werden zu können
            if (this.get("isSelected") === true || Radio.request("Parser", "getTreeType") === "light") {
                if (_.isUndefined(Radio.request("ParametricURL", "getLayerParams")) === false) {
                    this.collection.appendToSelectionIDX(this);
                }
                else {
                    this.collection.insertIntoSelectionIDX(this);
                }

                this.createTerrainProvider();
                if (this.get("isSelected")) {
                    this.listenToOnce(Radio.channel("Map"), {
                        // Die LayerSource wird beim ersten Selektieren einmalig erstellt
                        "activateMap3d": function () {
                            this.toggleLayerOnMap(this.get("isSelected"));
                        }
                    });
                }
            }
            // this.setAttributes();
        },

        /**
         * Der Layer wird der Karte hinzugefügt, bzw. von der Karte entfernt
         * Abhängig vom Attribut "isSelected"
         */
        toggleLayerOnMap: function () {
            var map3d;

            if (Radio.request("Map", "isMap3d") === true) {
                map3d = Radio.request("Map", "getMap3d");
                if (this.get("isVisibleInMap") === true) {
                    map3d.getCesiumScene().terrainProvider = this.get("terrainProvider");
                }
                else {
                    map3d.getCesiumScene().terrainProvider = new Cesium.EllipsoidTerrainProvider({});
                }
            }
        },


        createTerrainProvider: function () {
            var options;

            if (this.has("terrainProvider") === false) {
                options = {};
                if (this.has("cesiumTerrainProviderOptions")) {
                    _.extend(options, this.get("cesiumTerrainProviderOptions"));
                }
                options.url = this.get("url");
                this.setTerrainProvider(new Cesium.CesiumTerrainProvider(options));
            }
        },

        /**
         * Setter für Attribut "isVisibleInMap"
         * Zusätzlich wird das "visible-Attribut" vom Layer auf den gleichen Wert gesetzt
         * @param {boolean} value
         */
        setIsVisibleInMap: function (value) {
            this.set("isVisibleInMap", value);
        },

        /**
         * @param {Cesium.TerrainProvider} value
         */
        setTerrainProvider: function (value) {
            this.set("terrainProvider", value);
        }
    });

    return TerrainLayer;
});
