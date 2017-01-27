define([

    "config"
], function (Config) {

    var ToggleControlView = Backbone.View.extend({
        className: "row",
        template: _.template("<div class='toggleButton col-md-1' title='Menü ausblenden'><span class='glyphicon glyphicon-chevron-up'></span></div>"),
        events: {
            "click .glyphicon-chevron-up, .glyphicon-chevron-down": "toggleNavigation"
        },
        initialize: function () {
            this.render();
        },
        render: function () {
            this.$el.html(this.template);
            if (Config.isMenubarVisible === false) {
                this.toggleNavigation();
            }
        },
        toggleNavigation: function () {
            $(".toggleButton > span").toggleClass("glyphicon-chevron-up glyphicon-chevron-down");
            if ($(".toggleButton > span").hasClass("glyphicon-chevron-up") === true) {
                $(".controls-view").css("top", "50px");
                $(".toggleButton").attr("title", "Menü ausblenden");
                $("nav").show();
            }
            else {
                $(".controls-view").css("top", "0px");
                $(".toggleButton").attr("title", "Menü einblenden");
                $("nav").hide();
            }
        }
    });

    return ToggleControlView;
});
