define([
    "backbone",
    "modules/coordpopup/model",
    "text!modules/coordpopup/template.html"
], function (Backbone, CoordPopup, CoordPopupTemplate) {

    var CoordPopupView = Backbone.View.extend({
        model: CoordPopup,
        id: "coord-popup",
        template: _.template(CoordPopupTemplate),
        events: {
            "click .glyphicon-remove": "destroy"
        },
        initialize: function () {
            $("#lgv-container").append("<div id='popup'></div>");
            this.listenTo(this.model, "change:coordinateGeo", this.render);
        },
        render: function () {
            var attr = this.model.toJSON();

            this.$el.html(this.template(attr));
            this.model.getElement().popover({
                placement: function () {
                    if (this.getPosition().top > window.innerWidth / 2) {
                        return "top";
                    }
                    else {
                        return "bottom";
                    }
                },
                html: true,
                content: this.$el
            });
            this.model.showPopup();
        },
        destroy: function () {
            this.model.destroyPopup();
        }
    });

    return CoordPopupView;
});
