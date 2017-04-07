define(function (require) {

    var $ = require("jquery"),
        Animation = require("modules/tools/animation/model"),
        AnimationTemplate = require("text!modules/tools/animation/template.html"),
        AnimationView;

    AnimationView = Backbone.View.extend({
        model: new Animation(),
        tagName: "form",
        id: "animation-tool",
        className: "win-body",
        template: _.template(AnimationTemplate),
        events: {
            "click .start": "start",
            "click .reset": "reset",
            "change #select-kreis": "setKreis",
            "change #select-gemeinde": "setGemeinde",
            "change input[type=radio]": "setDirection"
        },
        initialize: function () {
            this.listenTo(this.model, {
                // ändert sich der Fensterstatus wird neu gezeichnet
                "change:isCollapsed change:isCurrentWin": this.render,
                // ändert sich eins dieser Attribute wird neu gezeichnet
                "change:gemeinden change:gemeinde change:direction change:animating change:pendlerLegend": this.render
            });
        },
        render: function () {
            var attr = this.model.toJSON();

            if (this.model.get("isCurrentWin") === true && this.model.get("isCollapsed") === false) {
                this.$el.html("");
                $(".win-heading").after(this.$el.html(this.template(attr)));
                this.delegateEvents();
            }
            else {
                this.undelegateEvents();
            }
        },
        start: function () {
            this.model.prepareAnimation();
        },
        reset: function () {
            this.model.stopAnimation();
        },

        setKreis: function (evt) {
            this.model.setKreis(evt.target.value);
        },

        setGemeinde: function (evt) {
            this.model.setGemeinde(evt.target.value);
        },

        setDirection: function (evt) {
            this.model.setDirection(evt.target.value);
        }
    });

    return AnimationView;
});
