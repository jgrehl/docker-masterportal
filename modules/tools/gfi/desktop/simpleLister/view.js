define(function (require) {

    var $ = require("jquery"),
        DesktopView = require("modules/tools/gfi/view"),
        Radio = require("backbone.radio"),
        Template = require("text!modules/tools/gfi/desktop/simpleLister/template.html"),
        GFISimpleListerView;

    GFISimpleListerView = DesktopView.extend({
        id: "simple-lister",
        template: _.template(Template),
        events: {
            "click p:first-child": function () {
                this.model.setIsVisible(false);
                Radio.trigger("MouseHover", "styleDeselGFI");
                Radio.trigger("SimpleLister", "renderContent");
                Radio.trigger("SimpleLister", "setIsVisible", true);
            }
        },

        /**
         * Zeichnet das Template
         */
        render: function () {
            var theme = this.model.getTheme(),
                street = theme.getFeature().get("str"),
                housenumber = theme.getFeature().get("hsnr");

            this.$el.html(this.template({street: street, housenumber: housenumber}));
            this.delegateEvents();
        },

        /**
         * Fügt das GFI an den SimpleLister oder eben nicht
         */
        toggle: function () {
            if (this.model.getIsVisible() === true) {
                Radio.trigger("MMLFilter", "hideFilter");
                Radio.trigger("SimpleLister", "setIsVisible", true);
                $("#simple-lister-table").html(this.$el);
                if (this.model.getZoomToFeature()) {
                    // take first coord of feature. The feature is is the model's theme.
                    var coord = this.model.getTheme().getFeature().getGeometry().getFirstCoordinate();

                    Radio.trigger("MapView", "setCenter", coord, 8);
                }
            }
            else {
                Radio.trigger("SimpleLister", "renderContent");
                Radio.trigger("SimpleLister", "setIsVisible", false);
            }
        },

        removeView: function () {
            this.remove();
        }
    });

    return GFISimpleListerView;
});
