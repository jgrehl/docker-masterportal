define([
    "backbone",
    "backbone.radio",
    "text!modules/menu/template.html",
    "text!modules/menu/desktop/template.html",
    "text!modules/menu/desktop/templateLight.html",
    "text!modules/menu/mobile/template.html",
    "modules/menu/desktop/folder/view",
    "modules/menu/desktop/layer/view",
    "modules/menu/desktop/tool/view",
    "modules/menu/mobile/folder/view",
    "modules/menu/mobile/layer/view",
    "modules/menu/mobile/tool/view",
    "bootstrap/dropdown",
    "bootstrap/collapse"
], function () {

    var Backbone = require("backbone"),
        Radio = require("backbone.radio"),
        MenuTemplate = require("text!modules/menu/template.html"),
        DesktopComplexTemplate = require("text!modules/menu/desktop/template.html"),
        DesktopLightTemplate = require("text!modules/menu/desktop/templateLight.html"),
        MobileTemplate = require("text!modules/menu/mobile/template.html"),
        DesktopFolderView = require("modules/menu/desktop/folder/view"),
        DesktopLayerView = require("modules/menu/desktop/layer/view"),
        DesktopToolView = require("modules/menu/desktop/tool/view"),
        MobileFolderView = require("modules/menu/mobile/folder/view"),
        MobileLayerView = require("modules/menu/mobile/layer/view"),
        MobileToolView = require("modules/menu/mobile/tool/view"),
        Menu;

    Menu = Backbone.View.extend({
        collection: Radio.request("ModelList", "getCollection"),
        tagName: "nav",
        className: "navbar navbar-default navbar-fixed-top",
        attributes: {role: "navigation"},
        template: _.template(MenuTemplate),
        desktopComplexTemplate: _.template(DesktopComplexTemplate),
        desktopLightTemplate: _.template(DesktopLightTemplate),
        mobileTemplate: _.template(MobileTemplate),

        initialize: function () {
            this.listenTo(this.collection, {
                "change": function () {
                    console.log(42);
                }
            });
            // console.log(this.collection);
            // this.collection = Radio.request("ModelList", "getCollection");
            this.render();
        },

        renderTopMenu: function (isMobile) {
            var rootModels = this.collection.where({parentId: "root"});
                _.each(rootModels, function (model) {
                    this.addViews(model, isMobile);
                }, this);
        },

        render: function () {
            var isMobile = Radio.request("Util", "isViewMobile");

            $("body").append(this.$el.html(this.template()));

            if (isMobile) {
                $("div.collapse.navbar-collapse ul").removeClass("menubarlgv nav navbar-nav");
                $("div.collapse.navbar-collapse ul").addClass("list-group tree-mobile");
            }
            else {
                $("div.collapse.navbar-collapse ul").addClass("menubarlgv nav navbar-nav");
                $("div.collapse.navbar-collapse ul").removeClass("list-group tree-mobile");
            }
            this.renderTopMenu(isMobile);

            // if (isMobile) {
            //     $("body").append(this.$el.append(this.mobileTemplate()));
            // }
            // else {
            //     var treeType = Radio.request("Parser", "getPortalConfig").Baumtyp;
            //
            //     if (treeType === "light") {
            //         // Use light Template
            //         $("body").append(this.$el.append(this.desktopLightTemplate()));
            //     }
            //     else {
            //         // Use complex Template
            //         $("body").append(this.$el.append(this.desktopComplexTemplate()));
            //     }
            // }
            Radio.trigger("MenuBar", "switchedMenu");
        },
        /**
         * Ordnet den Models die richtigen Views zu.
         * @param {Backbone.Model} model - itemModel | layerModel | folderModel
         */
        addViews: function (model, isMobile) {
            var nodeView;

            switch (model.getType()){
                case "folder": {
                    // Model für einen Ordner
                    nodeView = isMobile ? new MobileFolderView({model: model}) : new DesktopFolderView({model: model});
                    break;
                }
                case "layer": {
                    // Model für ein Layer
                    nodeView = isMobile ? new MobileLayerView({model: model}) : new DesktopLayerView({model: model});
                    break;
                }
                case "tool": {
                    // Model für Tools/Links/andere Funktionen
                    nodeView = isMobile ? new MobileToolView({model: model}) : new DesktopToolView({model: model});
                    break;
                }
            }
            $("div.collapse.navbar-collapse ul").append(nodeView.render().el);
        }
    });

    return Menu;
});
