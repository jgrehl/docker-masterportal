define([
        "text!modules/gfipopup/themes/reisezeiten/template.html",
    "modules/gfipopup/themes/reisezeiten/model",
    "eventbus"
], function (Template, Model, EventBus) {
    "use strict";
    var RoutingView = Backbone.View.extend({
        template: _.template(Template),
        /**
         * Wird aufgerufen wenn die View erzeugt wird.
         */
        events: {
            "remove": "destroy",
            "click .showroute": "startShowingRoute"
        },
        initialize: function (response) {
            this.model = new Model(response);

            this.render();
        },
        startShowingRoute: function (evt) {
            this.model.showRoute(evt.currentTarget.id);
            EventBus.trigger("closeGFIParams");
        },
        /**
         *
         */
        render: function () {
            var attr = this.model.toJSON();

            this.$el.html(this.template(attr));
        },
        /**
         * Removed das Routing-Objekt vollständig.
         * Wird beim destroy des GFI für alle Child-Objekte aufgerufen.
         */
        destroy: function () {
            this.unbind();
            this.model.destroy();
        }
    });
    return RoutingView;
});
