define([
    "backbone",
    "backbone.radio"
], function (Backbone, Radio) {

    var ControlsView = Backbone.View.extend({
        className: "controls-view",
        initialize: function () {
            this.render();

            this.$el.on({
                click: function (e) {
                    e.stopPropagation();
                }
            });
        },
        render: function () {
            var result = Radio.request("ParametricURL", "getResult");
            if (!_.has(result, "STYLE") || _.values(_.pick(result, "STYLE"))[0].toUpperCase() !== "SIMPLE") {
                $("#map .ol-overlaycontainer-stopevent").append(this.$el);
            }
            this.renderSubViews();
        },

        renderSubViews: function () {
            this.$el.append("<div class='control-view-top-right'></div>");
            this.$el.append("<div class='control-view-bottom-right'></div>");
            this.$el.append("<div class='control-view-bottom-left'></div>");
        },

        addRowTR: function (id) {
            this.$el.find(".control-view-top-right").append("<div class='row controls-row-right' id='" + id + "'></div>");
            return this.$el.find(".control-view-top-right").children().last();
        },

        addRowBR: function (id) {
            this.$el.find(".control-view-bottom-right").append("<div class='row controls-row-right' id='" + id + "'></div>");
            return this.$el.find(".control-view-bottom-right").children().last();
        },

        addRowBL: function (id) {
            this.$el.find(".control-view-bottom-left").append("<div class='row controls-row-left' id='" + id + "'></div>");
            return this.$el.find(".control-view-bottom-left").children().last();
        }
    });

    return ControlsView;
});
