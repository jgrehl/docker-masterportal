define(function (require) {
    require("bootstrap");

    var $ = require("jquery"),
        DesktopView = require("modules/tools/gfi/view"),
        Template = require("text!modules/tools/gfi/desktop/template.html"),
        GFIAttachedView;

    GFIAttachedView = DesktopView.extend({
        className: "gfi gfi-attached",
        template: _.template(Template),
        /**
         * Zeichnet das Template und erstellt das Bootstrap Popover
         */
        render: function () {
            var attr = this.model.toJSON();

            this.$el.html(this.template(attr));
            $(this.model.getOverlayElement()).popover({
                content: this.$el,
                html: true,
                placement: function () {
                    if (this.getPosition().top > window.innerHeight / 2) {
                        return "top";
                    }
                    else {
                        return "bottom";
                    }
                }
            });
        },

        /**
         * Hängt ein DOM-Element an den body
         * Wird für das ol.Overlay benötigt
         */
        renderDomElementToBody: function () {
            $("body").append("<div id='gfipopup'></div>");
        },

        /**
         * Blendet das Popover ein oder aus
         */
        toggle: function () {
            if (this.model.getIsVisible() === true) {
                $(this.model.getOverlayElement()).popover("show");
                if (this.model.getZoomToFeature()) {
                    Radio.trigger("MapView", "setCenter", this.model.getCoordinate());
                }
            }
            else {
                $(this.model.getOverlayElement()).popover("hide");
            }
        },

        removeView: function () {
            $(this.model.getOverlayElement()).popover("destroy");
            $("#gfipopup").remove();
            this.remove();
        }
    });

    return GFIAttachedView;
});
