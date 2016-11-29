define([
    "backbone",
    "text!modules/legend/template.html",
    "text!modules/legend/templateMobile.html",
    "modules/legend/model",
    "eventbus",
    "backbone.radio",
    "jqueryui/widgets/draggable"
], function (Backbone, LegendTemplate, LegendTemplateMobile, Legend, EventBus, Radio) {

    var LegendView = Backbone.View.extend({
        model: new Legend(),
        // className: "legend-win",
        template: _.template(LegendTemplate),
        templateMobile: _.template(LegendTemplateMobile),
        events: {
            "click .glyphicon-remove": "toggle"
        },
        initialize: function () {
            $(window).resize(function () {
                if ($(".legend-win-content").height() !== null) {
                    $(".legend-win-content").css("max-height", ($(window).height() * 0.7));
                }
            });

            this.listenTo(this.model, {
                "change:legendParams": this.paramsChanged
            });

            this.listenTo(EventBus, {
                "toggleLegendWin": this.toggle
            });

            this.listenTo(Radio.channel("Util"), {
                "isViewMobileChanged": this.render
            });

            this.render();
        },

        paramsChanged: function () {
            Radio.trigger("Layer", "updateLayerInfo", "Erreichbare Arbeitsplaetze in 30min");
            this.render();
        },
        render: function () {

            var isViewMobile = Radio.request("Util", "isViewMobile"),
                attr = this.model.toJSON();

            if (isViewMobile === true) {
                this.$el.attr("id", "base-modal-legend");
                this.$el.attr("class", "modal bs-example-modal-sm legend fade in");
                this.$el.html(this.templateMobile(attr));
                this.$el.modal({
                    backdrop: "static",
                    show: false
                });
            }
            else {
                this.$el.attr("id", "");
                this.$el.attr("class", "legend-win");
                this.$el.html(this.template(attr));
                $("body").append(this.$el.html(this.template(attr)));
                $(".legend-win-content").css("max-height", ($(window).height() * 0.7));
                this.$el.draggable({
                    containment: "#map",
                    handle: ".legend-win-header"
                });
            }
        },

        toggle: function () {
            var isViewMobile = Radio.request("Util", "isViewMobile"),
                legendModel = Radio.request("ModelList", "getModelByAttributes", {id: "legend"});

            this.render();
            if (isViewMobile === true) {

                this.$el.modal("toggle");
            }
            else {
                this.$el.toggle();
            }

            if (this.$el.css("display") === "block") {
                legendModel.setIsActive(true);
            }
            else {
                legendModel.setIsActive(false);
            }
        }
    });

    return LegendView;
});
