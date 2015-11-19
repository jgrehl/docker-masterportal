define([
    "backbone"
], function (Backbone) {

    var model = Backbone.Model.extend({
        /**
         * {Array} layers - Aufbereitete Layer-Objeke für die Config
         */
        defaults: {
            layers: []
        },

        /**
         * [initialize description]
         * @return {[type]} [description]
         */
        initialize: function () {
            if (this.has("childnodes")) {
                this.setNodeChildLayer();
            }
            if (this.has("layerIDs")) {
                this.setNodeLayer();
            }
        },

        /**
         * Fügt die Layer der ersten Ebene(nodeLayer) dem Attribut "layers" hinzu.
         */
        setNodeLayer: function () {
            _.each(this.get("layerIDs"), function (element) {
                element.node = this.get("node");
                this.push("layers", element);
            }, this);
        },

        /**
         * Fügt die Layer der zweiten Ebene(nodeChildLayer) dem Attribut "layers" hinzu.
         */
        setNodeChildLayer: function () {
            _.each(this.get("childnodes"), function (subfolder) {
                _.each(subfolder.layerIDs, function (element) {
                    if (_.has(element, "name") === true) {
                        this.push("layers", {
                            id: element.id,
                            name: element.name,
                            metaName: element.metaName,
                            visibility: element.visible,
                            subfolder: subfolder.node,
                            node: this.get("node")
                        });
                    }
                    else {
                        this.push("layers", {
                            id: element.id,
                            visibility: element.visible,
                            subfolder: subfolder.node,
                            node: this.get("node")
                        });
                    }
                }, this);
            }, this);
        },

        /**
         * Hilfsmethode um ein Attribut vom Typ Array zu setzen.
         * {String} attribute - Das Attribut das gesetzt werden soll
         * {whatever} value - Der Wert des Attributs
         */
        push: function (attribute, value) {
            var clonedAttribute = _.clone(this.get(attribute));

            clonedAttribute.push(value);
            this.set(attribute, clonedAttribute);
        }
    });

    return model;
});
