define(function (require) {
    var TemplateMobile = require("text!modules/layerinformation/templateMobile.html"),
        LayerInformationViewMobile;

    require("bootstrap/tab");
    require("bootstrap/modal");

    LayerInformationViewMobile = Backbone.View.extend({
        className: "modal fade layerinformation",
        template: _.template(TemplateMobile),
        events: {
            // Das Event wird ausgelöst, sobald das Modal verborgen ist
            "hidden.bs.modal": "setIsVisibleToFalse"
        },

        initialize: function () {
            this.listenTo(this.model, {
                // model.fetch() feuert das Event sync, sobald der Request erfoglreich war
                "sync": this.render,
                "removeView": this.remove
            });
        },

        render: function () {
            var attr = this.model.toJSON();

            this.$el.html(this.template(attr));
            this.$el.modal("show");
            return this;
        },

        setIsVisibleToFalse: function () {
            this.model.setIsVisible(false);
        }
    });

    return LayerInformationViewMobile;
});
