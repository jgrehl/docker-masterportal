define(function (require) {

    var BreadCrumbItem = require("modules/menu/mobile/breadCrumb/model"),
        $ = require("jquery"),
        BreadCrumbList;

    require("bootstrap/collapse");

    BreadCrumbList = Backbone.Collection.extend({
        model: BreadCrumbItem,
        initialize: function () {
            var channel = Radio.channel("BreadCrumb");

            channel.on({
                "addItem": this.addItem
            }, this);

            channel.reply({
                "getLastItem": this.getLastItem
            }, this);

            this.addMainItem();
        },

        addMainItem: function () {
            this.add({
                id: "root",
                name: "Menü"
            });
        },

        /**
         * Fügt der Liste ein neues Model hinzu
         * @param {Backbone.Model} model - Model aus der TreeList
         * @returns {void}
         */
        addItem: function (model) {
            this.add({
                id: model.get("id"),
                name: model.get("name")
            });
        },

        /**
         * Löscht alle Models ab einen bestimmten Index aus der Collection
         * @param  {Backbone.Model} model - Ab diesem Model aufwärts, werden alle Models gelöscht
         * @returns {void}
         */
        removeItems: function (model) {
            var modelIndex = this.indexOf(model),
                models = this.filter(function (element, index) {
                    return index > modelIndex;
                }),
                hasModels = models.length > 0;

            if (hasModels) {
                this.remove(models);
                Radio.trigger("ModelList", "setAllDescendantsInvisible", models[0].get("id"));
                Radio.trigger("ModelList", "setModelAttributesById", models[0], {isExpanded: false});
            }
            else if (modelIndex === 0) {
                $("div.collapse.navbar-collapse").removeClass("in");
            }
        },

        removeLastItem: function () {
            if (this.length > 1) {
                Radio.trigger("ModelList", "setModelAttributesById", this.pop().get("id"), {isExpanded: false});
            }
        },

        /**
         * Gibt das letzte Model aus der Collection zurück
         * @return {Backbone.Model} model
         */
        getLastItem: function () {
            return this.at(this.length - 1);
        }
    });

    return BreadCrumbList;
});
