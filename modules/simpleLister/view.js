define([
    "text!modules/simpleLister/template.html",
    "modules/simpleLister/model",
    "openlayers"

], function () {

    var Template = require("text!modules/simpleLister/template.html"),
        SimpleLister = require("modules/simpleLister/model"),
        SimpleListerView;

    SimpleListerView = Backbone.View.extend({
        model: new SimpleLister(),
        className: "simple-lister-view",
        template: _.template(Template),
        events: {
            "click .simple-lister-button": "toggleSimpleList",
            "click #div-simpleLister-extentList": "appendMoreFeatures",
            "mouseenter .entry": "mouseenterEntry",
            "mouseleave .entry": "mouseleaveEntry",
            "click .entry": "triggerGFI"
        },

        initialize: function () {
            var channel = Radio.channel("SimpleLister");

            channel.on({
                "collapse": this.collapse
            }, this);
            this.listenTo(this.model, {
                "newFeaturesInExtent": this.newFeaturesInExtent,
                "appendFeaturesInExtent": this.appendFeaturesInExtent,
                "render": this.render,
                "show": this.show
            });

            this.render();
        },

        render: function () {
            var attr = this.model.toJSON();

            $("#lgv-container").append(this.$el.html(this.template(attr)));
        },
        collapse: function () {
            if (this.$el.find(".glyphicon-triangle-right").length === 0) {
                this.toggleSimpleList();
            }
        },
        triggerGFI: function (evt) {
            this.model.triggerGFI(parseInt(evt.currentTarget.id, 10));
        },
        appendMoreFeatures: function () {
            this.model.appendFeatures();
        },

        show: function () {
            var glyphiconDom = $(".simple-lister-button > span");

            glyphiconDom.removeClass("glyphicon-triangle-right").addClass("glyphicon-triangle-left");
            $("#simple-lister-table").show();
            this.$el.css({width: "41%"});
            // $("#searchbarInMap").css({left: "calc(42% + 43px)"});
            this.model.getLayerFeaturesInExtent();
        },

        hide: function () {
            var glyphiconDom = $(".simple-lister-button > span");

            glyphiconDom.removeClass("glyphicon-triangle-left").addClass("glyphicon-triangle-right");
            $("#simple-lister-table").hide();
            this.$el.css({width: "0%"});
            // $("#searchbarInMap").css({left: "43px"});
        },

        newFeaturesInExtent: function () {
            var features = this.model.getFeaturesInExtent();

            $(".entries").empty();

            _.each(features, function (feature) {
                this.addEntry(feature);
            }, this);

            // toggle ggf. AppendFeatures Button
            this.updateAppendFeaturesButton();

            // update Heading
            this.updateListHeading();
        },

        appendFeaturesInExtent: function () {
            var features = this.model.getFeaturesInExtent(),
                lastEntry = $(".entry").last()[0],
                lastId = lastEntry.id,
                indexLastId = _.findIndex(features, function (feat) {
                    var featId = feat.id.toString();

                    return featId === lastId;
                }),
                restFeatures = indexLastId !== -1 ? _.rest(features, indexLastId + 1) : null;

            _.each(restFeatures, function (feature) {
                this.addEntry(feature);
            }, this);

            // toggle ggf. AppendFeatures Button
            this.updateAppendFeaturesButton();

            // update Heading
            this.updateListHeading();
        },

        updateListHeading: function () {
            var totalFeaturesInPage = this.model.getTotalFeaturesInPage(),
                totalFeatures = this.model.getTotalFeatures(),
                headingtext = "1 - " + totalFeaturesInPage + " von " + totalFeatures + " Einträgen",
                errortext = this.model.getErrortxt(),
                heading = totalFeaturesInPage === 0 ? errortext : headingtext;

            $(".heading").text(heading);
        },

        updateAppendFeaturesButton: function () {
            var totalFeaturesInPage = this.model.getTotalFeaturesInPage(),
                totalFeatures = this.model.getTotalFeatures(),
                ele;

            $("#div-simpleLister-extentList").remove();
            if (totalFeaturesInPage < totalFeatures) {
                ele = "<div id='div-simpleLister-extentList' title='Liste erweitern'><span id='div-simpleLister-extentList-text'>Liste erweitern</span></div>";

                $(".entries").append(ele);
            }
        },

        addEntry: function (feat) {
            var div1 = "<div id='" + feat.id + "' class='entry'>",
                div2 = "<div class='address'>" + feat.properties.str + " " + feat.properties.hsnr + "</div>",
                div3 = "<div class='category'>" + feat.properties.kat_text + "</div>",
                div4 = "<div class='description'>",
                div5 = feat.properties.beschr.length > 50 ? feat.properties.beschr.substring(0, 50) + "..." : feat.properties.beschr,
                div6 = "</div>",
                div7 = "</div>",
                div8 = "<div class='line'></div>",
                ele = div1.concat(div2, div3, div4, div5, div6, div7, div8);

            $(".entries").append(ele);
        },

        toggleSimpleList: function () {
            var glyphiconDom = this.$el;

            Radio.trigger("MmlFilter", "collapse");
            if (glyphiconDom.find(".glyphicon-triangle-right").length > 0) {
                this.show();
                $(".ol-viewport").css({
                    "width": "59%",
                    "float": "right"
                });
            }
            else {
                this.hide();
                $(".ol-viewport").css({
                    "width": "100%",
                    "float": ""
                });
            }
            Radio.trigger("Map", "updateSize");
        },
        /**
         * Hebt Zeilen mit dieser id hervor
         */
        highlightItemInList: function (id) {
            $("#simple-lister-table").find("#" + id.toString()).each(function (index, item) {
                $(item).addClass("simple-lister-highlight");
            });
        },

        /**
         * Aufhebung der Hervorhebung von Zeilen mit dieser id
         */
        lowlightItemInList: function (id) {
            $("#simple-lister-table").find("#" + id.toString()).each(function (index, item) {
                $(item).removeClass("simple-lister-highlight");
            });
        },

        /**
         * Starten des Triggers für MouseHover
         */
        mouseenterEntry: function (evt) {
            var id = evt.target.id ? evt.target.id : $(evt.target).parent()[0].id;

            this.highlightItemInList(id);
            this.model.triggerMouseHoverById(id);
        },

        /**
         * Starten des Triggers für Mouseleave
         */
        mouseleaveEntry: function (evt) {
            var id = evt.target.id ? evt.target.id : $(evt.target).parent()[0].id;

            this.lowlightItemInList(id);
            this.model.triggerMouseHoverLeave(id);
        }
    });

    return SimpleListerView;
});
