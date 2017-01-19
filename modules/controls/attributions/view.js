define([
        "text!modules/controls/attributions/templateShow.html",
    "text!modules/controls/attributions/templateHide.html",
    "modules/controls/attributions/model",

], function () {

    var         TemplateShow = require("text!modules/controls/attributions/templateShow.html"),
        TemplateHide = require("text!modules/controls/attributions/templateHide.html"),
        Attributions = require("modules/controls/attributions/model"),

        AttributionsView;

    AttributionsView = Backbone.View.extend({
        model: new Attributions(),
        className: "attributions-view",
        templateShow: _.template(TemplateShow),
        templateHide: _.template(TemplateHide),
        events: {
            "click .attributions-button": "toggleIsContentVisible"
        },
        initialize: function () {
            var channel = Radio.channel("AttributionsView");

            this.listenTo(channel, {
                "renderAttributions": this.renderAttributions
            });

            this.listenTo(this.model, {
                "change:isContentVisible": this.renderAttributions,
                "change:modelList": this.renderAttributions,
                "change:isVisibleInMap": this.toggleIsVisibleInMap
            });

            this.render();

            if (Radio.request("Util", "isAny") === true) {
                this.toggleIsContentVisible();
            }

        },

        render: function () {
            var attr = this.model.toJSON();

            $("body").append(this.$el.html(this.templateShow(attr)));
            if (this.model.getIsVisibleInMap() === true) {
                this.$el.show();
                this.$el.addClass("attributions-background-color");
            }
            else {
                this.$el.hide();
            }
        },

        renderAttributions: function () {
            var attr = this.model.toJSON();

            if (this.model.getIsContentVisible() === true) {
                this.$el.html(this.templateShow(attr));
                this.$el.addClass("attributions-background-color");
            }
            else {
                this.$el.html(this.templateHide(attr));
                this.$el.removeClass("attributions-background-color");
            }
        },

        toggleIsContentVisible: function () {
            this.model.toggleIsContentVisible();
        },

        toggleIsVisibleInMap: function () {
            this.$el.toggle();
        }
    });

    return AttributionsView;
});
