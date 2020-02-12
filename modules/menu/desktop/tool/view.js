import ItemTemplate from "text-loader!./template.html";
/**
 * @member ToolTemplate
 * @description Template for a Tool
 * @memberof Menu.Desktop.Tool
 */
const ToolView = Backbone.View.extend(/** @lends ToolView.prototype */{
    events: {
        "click": "checkItem"
    },
    /**
    * @class ToolView
    * @extends Backbone.View
    * @memberof Menu.Desktop.Tool
    * @constructs
    * @fires ClickCounter#RadioTriggerClickCounterToolChanged
    * @fires Map#RadioRequestMapGetMapMode
    * @listens Map#RadioTriggerMapChange
    */
    initialize: function () {
        this.listenTo(this.model, {
            "change:isActive": this.toggleIsActiveClass
        });
        this.listenTo(Radio.channel("Map"), {
            "change": function (mode) {
                this.toggleSupportedVisibility(mode);
            }
        });
        Radio.once("Addons", "initialized", this.render, this);

        this.render();
        this.toggleSupportedVisibility(Radio.request("Map", "getMapMode"));
        this.setCssClass();
        this.toggleIsActiveClass();
    },
    tagName: "li",
    className: "dropdown",
    template: _.template(ItemTemplate),
    /**
     * @todo Write the documentation.
     * @returns {this} this
     */
    render: function () {
        const attr = this.translateName(this.model.toJSON());

        if (this.model.get("isVisibleInMenu") !== false) {
            $("#" + this.model.get("parentId")).append(this.$el.html(this.template(attr)));
        }
        return this;
    },

    /**
     * Looks for the key "translate#" in the name of the model. If found the name will be translated.
     * The name is not yet translated, because it is from an addon.
     * @param {Array} attr attributes of this model
     * @returns {Array} attributes of this model maybe with translated name, if necessary
     */
    translateName: function (attr) {
        if (attr.name && attr.name.indexOf("translate#") === 0) {
            // addons-model: name is not translated in app.js, must be done here
            const translationKey = attr.name.substr("translate#".length);

            if (i18next.exists(translationKey)) {
                const name = i18next.t(translationKey);

                this.model.set("name", name);
                attr.name = name;
            }
        }
        return attr;
    },


    /**
     * Controls which tools are available in 2D, 3D and Oblique modes.
     * @param {String} mode Flag of the view mode
     * @returns {void}
     */
    toggleSupportedVisibility: function (mode) {
        const modelId = this.model.get("id"),
            supportedIn3d = this.model.get("supportedIn3d"),
            supportedOnlyIn3d = this.model.get("supportedOnlyIn3d"),
            supportedInOblique = this.model.get("supportedInOblique");

        if (mode === "2D" && !supportedOnlyIn3d.includes(modelId)) {
            this.$el.show();
        }
        else if (mode === "3D" && (supportedIn3d.includes(modelId) || supportedOnlyIn3d.includes(modelId))) {
            this.$el.show();
        }
        else if (mode === "Oblique" && supportedInOblique.includes(modelId)) {
            this.$el.show();
        }
        else {
            this.$el.hide();
        }
    },

    /**
     * Abhängig davon ob ein Tool in die Menüleiste oder unter dem Punkt Werkzeuge gezeichnet wird,
     * bekommt die View eine andere CSS-Klasse zugeordent
     * @returns {void}
     */
    setCssClass: function () {
        if (this.model.get("parentId") === "root") {
            this.$el.addClass("menu-style");
            this.$el.find("span").addClass("hidden-sm");
        }
        else {
            this.$el.addClass("submenu-style");
        }
    },
    /**
     * @todo Write the documentation.
     * @returns {void}
     */
    toggleIsActiveClass: function () {
        if (this.model.get("isActive") === true) {
            this.$el.addClass("active");
        }
        else {
            this.$el.removeClass("active");
        }
    },
    /**
     * @todo Write the documentation.
     * @returns {void}
     */
    checkItem: function () {
        Radio.trigger("ClickCounter", "toolChanged");
        if (this.model.get("id") === "legend") {
            this.model.setIsActive(true);
        }
        else {
            if (!this.model.collection) {
                // addons are initialized with 'new Tool(attrs, options);' Then the model is replaced after importing the addon.
                // In that case 'this.model' of this class has not full content, e.g. collection is undefined --> replace it by the new model in the list
                this.model = Radio.request("ModelList", "getModelByAttributes", {id: this.model.id});
            }
            this.model.collection.setActiveToolsToFalse(this.model);
            this.model.setIsActive(true);
        }
        // Navigation wird geschlossen
        $("div.collapse.navbar-collapse").removeClass("in");
    }
});

export default ToolView;
