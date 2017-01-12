define([
    "backbone",
    "text!modules/title/template.html",
    "backbone.radio"
], function (Backbone, TitleTemplate, Radio) {

    var TitleView = Backbone.View.extend({
        className: "visible-lg-block portal-title",
        id: "portalTitle",
        template: _.template(TitleTemplate),
        initialize: function (title) {
            var channel = Radio.channel("Title");

            channel.on({
                "setSize": this.setSize
            }, this);

            $("#lgv-container").on("resize", this.setSize);
            this.setLogo();
            this.render(title);
            this.setSize();
        },

        setSize: function () {
            var rootWidth = $("#root").width(),
                searchbarWidth = $("#searchbar").width(),
                width = $("#lgv-container").width() - rootWidth - searchbarWidth - 35; // 35px toleranz wegen  passing und margin von #root, #searchbar und #portalTitle

            $("#portalTitle").width(width);
        },

        render: function (portalTitle) {
            this.$el.html(this.template({
                title: portalTitle,
                logo: Radio.request("Util", "getPath", this.getLogo()),
                logoLink: Radio.request("Parser", "getPortalConfig").LogoLink || "http://geoinfo.hamburg.de",
                logoTooltip: Radio.request("Parser", "getPortalConfig").LogoToolTip || "Landesbetrieb Geoinformation und Vermessung"
            }));

            $(".navbar-collapse").append(this.$el);
        },

        setLogo: function () {
            var logo = Radio.request("Parser", "getPortalConfig").PortalLogo,
                result = "";

            if (logo === "none") {
               result = null;
            }
            else if (_.isUndefined(logo)) {
                result = "../img/hh-logo.png";
            }
            else {
                result = logo;
            }
            this.logo = result;
        },

        getLogo: function () {
            return this.logo;
        }
    });

    return TitleView;
});
