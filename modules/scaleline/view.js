define(function (require) {
    var ScaleLine = require("modules/scaleline/model"),
        ScaleLineTemplate = require("text!modules/scaleline/template.html"),
        ScaleLineView;

    ScaleLineView = Backbone.View.extend({
        initialize: function () {
            this.listenTo(this.model, "change:scaleLineValue", this.render);
            this.render();
        },
        model: ScaleLine,
        className: "scale-line",
        template: _.template(ScaleLineTemplate),
        render: function () {
            var attr = this.model.toJSON();

            this.$el.html(this.template(attr));
            document.getElementsByClassName("footer")[0].appendChild(this.el);
            this.$el.css("right", 0);
            return this;
        }
    });

    return ScaleLineView;
});
