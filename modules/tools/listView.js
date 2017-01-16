define([

    "modules/tools/list",
    "modules/tools/view",
    "modules/core/util"
], function (TreeList, ToolView, Util) {

    var ToolListView = Backbone.View.extend({
        collection: new TreeList(),
        tagName: "ul",
        className: "dropdown-menu",
        initialize: function () {
            this.listenTo(Radio.channel("MenuBar"), {
                "switchedMenu": this.render
            });

            this.render();
        },
        render: function () {
            var isMobile = Radio.request("MenuBar", "isMobile");

            if (isMobile === false) {
                $(".dropdown-tools").append(this.$el.html(""));
                this.collection.forEach(this.addTool, this);
                // löscht den letzten divider in der Toolliste
                $(".dropdown-tools > .dropdown-menu li:last-child").remove();
            }
        },
        addTool: function (tool) {
            if (!((tool.attributes.name === "draw" || tool.attributes.name === "measure") && Util.isAny())) {
                var toolView = new ToolView({model: tool});

                this.$el.append(toolView.render().el);
                this.$el.append("<li class='divider'></li>");
            }
        }
    });

    return ToolListView;
});
