define([

    "modules/window/model",
    "text!modules/window/templateMax.html",
    "text!modules/window/templateMin.html",
    "eventbus",
    "jqueryui/widgets/draggable"
], function (Window, templateMax, templateMin, EventBus) {

    var WindowView = Backbone.View.extend({
        id: "window",
        className: "tool-window ui-widget-content",
        model: Window,
        templateMax: _.template(templateMax),
        templateMin: _.template(templateMin),
        initialize: function () {
            this.model.on("change:isVisible change:isCollapsed change:winType", this.render, this);
            this.$el.draggable({
                containment: "#map",
                handle: ".header",
                stop: function (event, ui) {
                    ui.helper.css({"height": "", "width": ""});
                }
            });
            this.$el.css({
                "max-height": $("#lgv-container").height() - 100 // 100 fixer Wert für navbar &co.
            });
            $(window).resize($.proxy(function () {
                this.$el.css({
                    "max-height": $("#lgv-container").height() - 100 // 100 fixer Wert für navbar &co.
                });
            }, this));
        },
        events: {
            "click .glyphicon-minus": "minimize",
            "click .header-min > .title": "maximize",
            "click .glyphicon-remove": "hide"
        },
        render: function () {
            var attr = this.model.toJSON();

            if (this.model.get("isVisible") === true) {
                if (this.model.get("isCollapsed") === true) {
                    $("#lgv-container").append(this.$el.html(this.templateMin(attr)));
                    this.$el.css({"top": "", "bottom": "0", "left": "0", "margin-bottom": "60px"});
                }
                else {
                    $("#lgv-container").append(this.$el.html(this.templateMax(attr)));
                    this.$el.css({"top": this.model.get("maxPosTop"), "bottom": "", "left": this.model.get("maxPosLeft"), "margin-bottom": "30px"});
                }
                this.model.sendParamsToWinCotent();
                this.$el.show("slow");
                this.setMaxHeight();
            }
            else {
                this.$el.hide("slow");
            }
        },
        setMaxHeight: function () {
            var height = $("#lgv-container").height() - 130;

            $(".win-body").css("max-height", height);
        },
        minimize: function () {
            this.model.set("maxPosTop", this.$el.css("top"));
            this.model.set("maxPosLeft", this.$el.css("left"));
            this.model.setCollapse(true);
        },
        maximize: function () {
            this.model.setCollapse(false);
        },
        hide: function () {
            var toolModel = Radio.request("ModelList", "getModelByAttributes", {id: this.model.get("winType")});

            if (toolModel) {
                toolModel.setIsActive(false);
            }
            if (this.model.get("winType") === "download") {
                Radio.request("ModelList", "getModelByAttributes", {id: "draw"}).setIsActive(false);
            }
            this.$el.hide("slow");
            this.model.setVisible(false);
            this.model.sendParamsToWinCotent();
            Radio.trigger("ModelList", "setModelAttributesById", "gfi", {isActive: true});
        }
    });

    return WindowView;
    });
