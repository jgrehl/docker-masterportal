define([
    "jquery",
    "text!modules/tools/searchByCoord/template.html",
    "modules/tools/searchByCoord/model"
], function ($, SearchByCoordTemplate, SearchByCoord) {

    var SearchByCoordView = Backbone.View.extend({
        model: SearchByCoord,
        className: "win-body",
        template: _.template(SearchByCoordTemplate),
        events: {
            "change #coordSystemField": "setCoordSystem",
            "click button": "setCoordinates"
        },
        initialize: function () {
            this.listenTo(this.model, {
                "change:isCollapsed change:isCurrentWin": this.render,
                    "change:coordSystem": this.setFocusToCoordSystemInput
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
        setCoordSystem: function () {
            this.model.setCoordSystem($("#coordSystemField").val());
        },
        setCoordinates: function (evt) {
            if (evt.keyCode === 13) {
                this.model.validateCoordinates();
            }
            this.model.setCoordinates($("#coordinatesEastingField").val(),$("#coordinatesNorthingField").val());
        },
        setFocusToCoordSystemInput: function () {
            $("#coordSystemField").focus();
            this.render();
        },
        validateCoords: function () {
            this.model.validateCoordinates();
        }
    });

    return SearchByCoordView;
});
