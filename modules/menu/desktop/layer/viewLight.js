import TemplateSettings from "text-loader!./templateSettings.html";
import Template from "text-loader!./templateLight.html";
import checkChildrenDatasets from "../../checkChildrenDatasets.js";

const LayerView = Backbone.View.extend(/** @lends LayerView.prototype */{
    events: {
        "click .glyphicon-unchecked, .glyphicon-check, .title": "toggleIsSelected",
        "click .glyphicon-info-sign": "showLayerInformation",
        "click .glyphicon-cog": "toggleIsSettingVisible",
        "click .arrows > .glyphicon-arrow-up": "moveModelUp",
        "click .arrows > .glyphicon-arrow-down": "moveModelDown",
        "click .glyphicon-plus-sign": "incTransparency",
        "click .glyphicon-minus-sign": "decTransparency",
        "change select": "setTransparency",
        "click .styleWMS": "openStyleWMS",
        "click .styleVT": "openStyleVT",
        "click .remove-layer": "removeLayer"
    },

    /**
     * @class LayerView
     * @extends Backbone.View
     * @memberof Menu.Desktop.Layer
     * @constructs
     * @listens Layer#changeIsSelected
     * @listens Layer#changeIsSettingVisible
     * @listens Layer#changeTransparency
     * @listens Layer#changeIsOutOfRange
     * @listens Layer#changeCurrentLng
     * @listens Map#RadioTriggerMapChange
     * @listens LayerInformation#RadioTriggerLayerInformationUnhighlightLayerInformationIcon
     * @listens i18next#RadioTriggerLanguageChanged
     * @fires Map#RadioRequestMapGetMapMode
     * @fires StyleWMS#RadioTriggerStyleWMSOpenStyleWMS
     * @fires Parser#RadioTriggerParserRemoveItem
     */
    initialize: function () {
        checkChildrenDatasets(this.model);
        this.listenTo(this.model, {
            "change:isSelected": this.rerender,
            "change:isSettingVisible": this.renderSetting,
            "change:transparency": this.rerender,
            "change:isOutOfRange": this.toggleColor,
            "change:currentLng": () => {
                this.render();
            }
        });
        this.listenTo(Radio.channel("Map"), {
            "change": this.toggleByMapMode
        });
        this.listenTo(Radio.channel("LayerInformation"), {
            "unhighlightLayerInformationIcon": this.unhighlightLayerInformationIcon
        });
        this.$el.on({
            click: function (e) {
                e.stopPropagation();
            }
        });
        this.render();

        this.toggleColor(this.model, this.model.get("isOutOfRange"));
        this.toggleByMapMode(Radio.request("Map", "getMapMode"));
    },
    tagName: "li",
    className: "layer list-group-item",
    template: _.template(Template),
    templateSettings: _.template(TemplateSettings),

    /**
     * Renders the selection view.
     * @returns {Backbone.View} todo
     */
    render: function () {
        const attr = this.model.toJSON(),
            selector = $("#" + this.model.get("parentId"));

        selector.prepend(this.$el.html(this.template(attr)));
        if (this.model.get("isSettingVisible") === true) {
            this.$el.append(this.templateSettings(attr));
        }
        return this;
    },

    /**
     * Rerenders the model with updated elements.
     * @returns {void}
     */
    rerender: function () {
        const attr = this.model.toJSON();

        this.$el.html(this.template(attr));
        if (this.model.get("layerInfoChecked")) {
            this.highlightLayerInformationIcon();
        }
        if (this.model.get("isSettingVisible")) {
            this.$el.append(this.templateSettings(attr));
        }
    },

    /**
     * Draws the settings (transparency, metainfo, ...)
     * @return {void}
     */
    renderSetting: function () {
        const attr = this.model.toJSON();

        // Animation Zahnrad
        this.$(".glyphicon-cog").toggleClass("rotate rotate-back");
        // Slide-Animation templateSetting
        if (this.model.get("isSettingVisible") === false) {
            this.$el.find(".layer-settings").slideUp("slow", function () {
                $(this).remove();
            });
        }
        else {
            this.$el.append(this.templateSettings(attr));
            this.$el.find(".layer-settings").hide();
            this.$el.find(".layer-settings").slideDown();
        }
    },

    /**
     * Executes toggleIsSelected in the model
     * @returns {void}
     */
    toggleIsSelected: function () {
        this.model.toggleIsSelected();
        this.rerender();
        this.toggleColor(this.model, this.model.get("isOutOfRange"));
    },

    /**
     * Init the LayerInformation window and inits the highlighting of the informationIcon.
     * @returns {void}
     */
    showLayerInformation: function () {
        this.model.showLayerInformation();
        // Navigation wird geschlossen
        $("div.collapse.navbar-collapse").removeClass("in");
        this.highlightLayerInformationIcon();
    },

    /**
     * Executes toggleIsSettingVisible in the model
     * @returns {void}
     */
    toggleIsSettingVisible: function () {
        this.model.toggleIsSettingVisible();
    },

    /**
     * todo
     * @param {*} evt - todo
     * @returns {void}
     */
    setTransparency: function (evt) {
        this.model.setTransparency(parseInt(evt.target.value, 10));
    },

    /**
     * Executes moveDown in the model
     * @returns {void}
     */
    moveModelDown: function () {
        this.model.moveDown();
    },

    /**
     * Executes moveUp in the model
     * @returns {void}
     */
    moveModelUp: function () {
        this.model.moveUp();
    },

    /**
     * Executes incTransparency in the model
     * @returns {void}
     */
    incTransparency: function () {
        this.model.incTransparency(10);
    },

    /**
     * Executes decTransparency in the model
     * @returns {void}
     */
    decTransparency: function () {
        this.model.decTransparency(10);
    },

    /**
     * Triggers the styleWMS tool to open
     * Removes the class "open" from ".nav li:first-child"
     * @fires StyleWMS#RadioTriggerStyleWMSOpenStyleWMS
     * @returns {void}
     */
    openStyleWMS: function () {
        Radio.trigger("StyleWMS", "openStyleWMS", this.model);
        $(".nav li:first-child").removeClass("open");
    },

    /**
     * Triggers the parser to remove the item/layer
     * Executes removeLayer in the model
     * Removes the element
     * Select a style for vector tile leyer.
     * @returns {void}
     */
    openStyleVT: function () {
        Radio.trigger("StyleVT", "open", this.model);
    },

    /**
     * todo
     * @fires Parser#RadioTriggerParserRemoveItem
     * @returns {void}
     */
    removeLayer: function () {
        Radio.trigger("Parser", "removeItem", this.model.get("id"));
        this.model.removeLayer();
        this.$el.remove();
    },

    /**
     * If the layer is outside its scale range,
     * if the view is grayed out and not clickable
     * @param {Backbone.Model} model - todo
     * @param {boolean} value - todo
     * @returns {void}
     */
    toggleColor: function (model, value) {
        if (model.has("minScale") === true) {
            let statusCheckbox = 0;

            if (value === true) {
                statusCheckbox = this.$el.find("span.glyphicon.glyphicon-unchecked").length;
                this.$el.addClass("disabled");
                this.$el.find("*").css("cursor", "not-allowed");
                this.$el.find("*").css("pointer-events", "none");
                if (statusCheckbox === 0) {
                    this.$el.find("span.pull-left").css({"pointer-events": "auto", "cursor": "pointer"});
                }
                this.$el.attr("title", "Layer wird in dieser Zoomstufe nicht angezeigt");
            }
            else {

                this.$el.removeClass("disabled");
                this.$el.find("*").css("pointer-events", "auto");
                this.$el.find("*").css("cursor", "pointer");
                this.$el.attr("title", "");
            }
        }
    },

    /**
     * adds only layers to the tree that support the current mode of the map
     * e.g. 2D, 3D
     * @param {String} mapMode - current mode from map
     * @returns {void}
     */
    toggleByMapMode: function (mapMode) {
        if (this.model.get("supported").indexOf(mapMode) >= 0) {
            this.$el.show();
        }
        else {
            this.$el.hide();
        }
    },

    /**
     * Highlights the Layer Information Icon in the layertree
     * @returns {void}
     */
    highlightLayerInformationIcon: function () {
        if (this.model.get("layerInfoChecked")) {
            this.$el.find("span.glyphicon-info-sign").addClass("highlightLayerInformationIcon");
        }
    },

    /**
     * Unhighlights the Layer Information Icon in the layertree
     * @returns {void}
     */
    unhighlightLayerInformationIcon: function () {
        this.$el.find("span.glyphicon-info-sign").removeClass("highlightLayerInformationIcon");
        this.model.setLayerInfoChecked(false);
    }
});

export default LayerView;
