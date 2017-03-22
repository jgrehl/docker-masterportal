define([
    "text!modules/mmlFilter/templateMobile.html",
    "modules/mmlFilter/model",
    "bootstrap/collapse",
    "bootstrap/modal"

], function () {

    var Template = require("text!modules/mmlFilter/templateMobile.html"),
        Model = require("modules/mmlFilter/model"),
        Radio = require("backbone.radio"),

        MobileMMLFilterView;

    MobileMMLFilterView = Backbone.View.extend({
        model: new Model(),
        className: "modal fade unselectable mmlFilter",
        id: "div-mmlFilter-content-mobile",
        template: _.template(Template),
        events: {
            "click #div-mmlFilter-reset-mobile": "resetKategorien",
            "click #div-mmlFilter-execute-mobile": "executeFilter",
            "click .input-mmlFilter-filter-time": "toggleTimeMode",
            "click .div-mmlFilter-panel-heading-mobile": "singleShowTargetFilter"
        },

        initialize: function () {
            var channel = Radio.channel("MMLFilter");

            channel.on({
                "toggleFilter": this.toggleFilterWindow
            }, this);

            this.render();
        },

        render: function () {
            var attr = this.model.toJSON();

            $(".ol-overlaycontainer-stopevent").append(this.$el.html(this.template(attr)));
            this.$el.modal({
                backdrop: "static",
                show: false
            });
        },

        singleShowTargetFilter: function (evt) {
            var currentTarget = $(evt.currentTarget),
                currentTargetId = currentTarget.parent().children()[1].id,
                parentTarget = $("#div-mmlFilter-modal-dialog");

            parentTarget.find(".in").each(function (index, target) {
                if (target.id !== currentTargetId) {
                    $(target).prev().find(".glyphicon-triangle-top").removeClass("glyphicon-triangle-top").addClass("glyphicon-triangle-bottom");
                    $(target).removeClass("in");
                }
            });

            $("#" + currentTargetId).addClass("in");
            $("#" + currentTargetId).prev().find(".glyphicon-triangle-bottom").removeClass("glyphicon-triangle-bottom").addClass("glyphicon-triangle-top");
        },

        // schaltet Filterwindow sichtbar/unsichtbar
        toggleFilterWindow: function () {
            $("#div-mmlFilter-content-mobile").modal("toggle");
        },

        toggleTimeMode: function (evt) {
            var timeModeId = evt.target.id,
                isUserdefined = timeModeId === "userdefined" ? true : false;

            $(evt.target).parent().find(".row").each(function (index, row) {
                if (isUserdefined) {
                    $(row).show();
                }
                else {
                    $(row).hide();
                }
            });
        },

        resetKategorien: function () {
            $(".div-mmlFilter-filter-kategorien").children(":checkbox").each(function (index, kategorie) {
                $(kategorie).prop("checked", false);
            });
        },

        executeFilter: function () {
            var selectedKat = [],
                selectedStatus = [],
                selectedTimeId = $("input[name='zeitraum']:checked").val(),
                date = new Date(),
                daysDiff = selectedTimeId === "7days" ? 7 : selectedTimeId === "30days" ? 30 : 0,
                timeDiff = daysDiff * 24 * 3600 * 1000,
                fromDate = selectedTimeId !== "userdefined" ? new Date(date - (timeDiff)).toISOString().split("T")[0] : $("#fromDate").val(),
                toDate = selectedTimeId !== "userdefined" ? date.toISOString().split("T")[0] : $("#toDate").val();

            $(".div-mmlFilter-filter-kategorien").children(":checked").each(function (index, kategorie) {
                selectedKat.push(kategorie.id);
            });

            $(".div-mmlFilter-filter-status").children(":checked").each(function (index, status) {
                selectedStatus.push(status.id);
            });
            console.log(selectedKat);
            console.log(selectedStatus);
            console.log(fromDate);
            console.log(toDate);
        }
    });

    return MobileMMLFilterView;
});
