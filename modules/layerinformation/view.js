define([

    "modules/layerinformation/model",
    "text!modules/layerinformation/template.html",
    "jqueryui/widgets/draggable"
], function (Layerinformation, LayerInformationTemplate) {

    var LayerInformationView = Backbone.View.extend({
        model: new Layerinformation(),
        className: "layerinformation-win",
        template: _.template(LayerInformationTemplate),
        events: {
            "click .glyphicon-remove": "hide",
            "click .glyphicon-minus": "minimize",
            "click .glyphicon-print": "print"
        },

        initialize: function () {
            this.listenTo(this.model, {
                "sync": this.render
            });
            this.$el.on({
                click: function (e) {
                    e.stopPropagation();
                }
            });
        },

        render: function () {
            var attr = this.model.toJSON();

            $("body").append(this.$el.html(this.template(attr)));
            this.$el.draggable({
                containment: "#map",
                handle: ".header > .title"
            });
            this.$el.show();
        },

        hide: function () {
            Radio.trigger("Layer", "setLayerInfoChecked", false);
            this.$el.hide();
        }
    });

    return LayerInformationView;
});
