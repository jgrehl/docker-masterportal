define([
    "backbone",
    "text!modules/treeMobile/layer/template.html",
    "text!modules/treeMobile/layer/templateSelected.html",
    "text!modules/treeMobile/layer/templateSetting.html"
], function () {

    var Backbone = require("backbone"),
        LayerTemplate = require("text!modules/treeMobile/layer/template.html"),
        SelectedLayerTemplate = require("text!modules/treeMobile/layer/templateSelected.html"),
        SettingTemplate = require("text!modules/treeMobile/layer/templateSetting.html"),
        LayerView;

    LayerView = Backbone.View.extend({
        tagName: "li",
        className: "list-group-item",
        template: _.template(LayerTemplate),
        templateSelected: _.template(SelectedLayerTemplate),
        templateSetting: _.template(SettingTemplate),
        events: {
            "click .layer-item": "toggleIsChecked",
            "click .layer-info-item > .glyphicon-info-sign": "showLayerInformation",
            "click .selected-layer-item > .glyphicon-remove": "removeFromSelection",
            "click .selected-layer-item > div": "toggleLayerVisibility",
            "click .layer-info-item > .glyphicon-cog": "toggleIsSettingVisible",
            "change select": "setTransparence"
        },
        initialize: function () {
            this.listenTo(this.model, {
                 "change:isChecked change:isLayerVisible": this.render,
                 "change:isSettingVisible": this.renderSetting
            });
        },

        render: function () {
            var attr = this.model.toJSON();

            if (this.model.getIsInSelection() === true) {
                this.$el.html(this.templateSelected(attr));
            }
            else {
                this.$el.html(this.template(attr));
            }

            return this;
        },

        /**
         * Zeichnet die Einstellungen (Transparenz, Metainfos, ...)
         */
        renderSetting: function () {
            var attr = this.model.toJSON();

            // Animation Zahnrad
            this.$(".glyphicon-cog").toggleClass("rotate rotate-back");
            // Slide-Animation templateSetting
            if (this.model.getIsSettingVisible() === false) {
                this.$el.find(".item-settings").slideUp("slow", function () {
                    this.remove();
                });
            }
            else {
                this.$el.append(this.templateSetting(attr));
                this.$el.find(".item-settings").hide();
                this.$el.find(".item-settings").slideDown();
            }

        },

        toggleIsChecked: function () {
            this.model.toggleIsChecked();
        },

        removeFromSelection: function () {
            this.model.setIsInSelection(false);
            this.model.setIsChecked(false);
            this.$el.remove();
        },

        toggleLayerVisibility: function () {
            this.model.toggleLayerVisibility();
        },

        showLayerInformation: function () {
            this.model.showLayerInformation();
            // Navigation wird geschlossen
            $("div.collapse.navbar-collapse").removeClass("in");
        },

        toggleIsSettingVisible: function () {
            this.model.toggleIsSettingVisible();
        },

        setTransparence: function (evt) {
            this.model.setTransparence(parseInt(evt.target.value, 10));
        }
    });

    return LayerView;
});
