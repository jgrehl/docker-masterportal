
define(function (require) {

    var Template = require("text!modules/menu/table/categories/Templates/template.html"),
        CategoryView;

    CategoryView = Backbone.View.extend({
        events: {
            "click": "toggleCategoryMenu"
        },
        initialize: function () {
            this.listenTo(Radio.channel("TableMenu"), {
                "hideMenuElementCategory": this.hideCategoryMenu
            });

            this.$el.on("show.bs.collapse", function () {
                Radio.request("TableMenu", "setActiveElement", "Category");
            });
        },
        render: function () {
            this.$el.html(this.template());
            if (Radio.request("TableMenu", "getActiveElement") === "Category") {
                this.$(".table-nav-cat-panel").collapse("show");
            }
            return this.$el;
        },
        id: "table-category-list",
        className: "table-category-list table-nav",
        template: _.template(Template),
        toggleCategoryMenu: function () {
            if (this.$(".table-nav-cat-panel").hasClass("in")) {
                this.hideCategoryMenu();
            }
            else {
                this.showCategoryMenu();
            }
        },
        hideCategoryMenu: function () {
            this.$(".table-nav-cat-panel").removeClass("in");
            this.$(".table-category-list").removeClass("table-category-active");
        },
        showCategoryMenu: function () {
            this.$(".table-category-list").addClass("table-category-active");
            this.$(".table-nav-cat-panel").addClass("in");
            Radio.request("TableMenu", "setActiveElement", "Category");
        }
    });

    return CategoryView;
});
