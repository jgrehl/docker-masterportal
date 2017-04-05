define(function (require) {
    var GAZModel = require("modules/searchbar/gaz/model"),
        SpecialWFSModel = require("modules/searchbar/specialWFS/model"),
        VisibleWFSModel = require("modules/searchbar/visibleWFS/model"),
        BKGModel = require("modules/searchbar/bkg/model"),
        TreeModel = require("modules/searchbar/tree/model"),
        LayerSearch = require("modules/searchbar/layer/model"),
        SearchbarTemplate = require("text!modules/searchbar/template.html"),
        SearchbarTemplateMML = require("text!modules/searchbar/template_mml.html"),
        SearchbarTemplateMMLMobil = require("text!modules/searchbar/template_mmlMobil.html"),
        SearchbarRecommendedListTemplate = require("text!modules/searchbar/templateRecommendedList.html"),
        SearchbarHitListTemplate = require("text!modules/searchbar/templateHitList.html"),
        Searchbar = require("modules/searchbar/model"),
        EventBus = require("eventbus"),
        SearchbarView;

    SearchbarView = Backbone.View.extend({
        // Konstanten
        constants: {
            "enter": 13,
            "arrowUp": 38,
            "arrowDown": 40,
            "ctrl": 17
        },
        model: Searchbar,
        id: "searchbar", // wird ignoriert, bei renderToDOM
        className: "navbar-form col-xs-9", // wird ignoriert, bei renderToDOM
        searchbarKeyNavSelector: "#searchInputUL",
        template: _.template(SearchbarTemplate),
        /**
        * @memberof config
        * @type {Object}
        * @description Konfiguration für die Suchfunktion. Workaround für IE9 implementiert.
        * @property {Object} [visibleWFS] Konfigurationsobjekt für die client-seitige Suche auf bereits geladenen WFS-Layern. Weitere Konfiguration am Layer, s. searchField in {@link config#layerIDs}.
        * @property {integer} [visibleWFS.minChars=3] - Mindestanzahl an Characters, bevor eine Suche initiiert wird.
        * @property {Object} [tree] - Das Konfigurationsobjekt der Tree-Suche, wenn Treesuche gewünscht.
        * @property {integer} [tree.minChars=3] - Mindestanzahl an Characters, bevor eine Suche initiiert wird.
        * @property {Objekt} [specialWFS] - Das Konfigurationsarray für die specialWFS-Suche
        * @property {integer} [specialWFS.minChars=3] - Mindestanzahl an Characters, bevor eine Suche initiiert wird.
        * @property {Object[]} specialWFS.definitions - Definitionen der SpecialWFS.
        * @property {Object} specialWFS.definitions[].definition - Definition eines SpecialWFS.
        * @property {string} specialWFS.definitions[].definition.url - Die URL, des WFS
        * @property {string} specialWFS.definitions[].definition.data - Query string des WFS-Request
        * @property {string} specialWFS.definitions[].definition.name - Name der speziellen Filterfunktion (bplan|olympia|paralympia)
        * @property {Object} bkg - Das Konfigurationsobjet der BKG Suche.
        * @property {integer} [bkg.minChars=3] - Mindestanzahl an Characters, bevor eine Suche initiiert wird.
        * @property {string} bkg.bkgSuggestURL - URL für schnelles Suggest.
        * @property {string} [bkg.bkgSearchURL] - URL für ausführliche Search.
        * @property {float} [bkg.extent=454591, 5809000, 700000, 6075769] - Koordinatenbasierte Ausdehnung in der gesucht wird.
        * @property {integer} [bkg.suggestCount=20] - Anzahl der über suggest angefragten Vorschläge.
        * @property {string} [bkg.epsg=EPSG:25832] - EPSG-Code des verwendeten Koordinatensystems.
        * @property {string} [bkg.filter=filter=(typ:*)] - Filterstring
        * @property {float} [bkg.score=0.6] - Score-Wert, der die Qualität der Ergebnisse auswertet.
        * @property {Object} [gazetteer] - Das Konfigurationsobjekt für die Gazetteer-Suche.
        * @property {string} gazetteer.url - Die URL.
        * @property {boolean} [gazetteer.searchStreets=false] - Soll nach Straßennamen gesucht werden? Vorraussetzung für searchHouseNumbers. Default: false.
        * @property {boolean} [gazetteer.searchHouseNumbers=false] - Sollen auch Hausnummern gesucht werden oder nur Straßen? Default: false.
        * @property {boolean} [gazetteer.searchDistricts=false] - Soll nach Stadtteilen gesucht werden? Default: false.
        * @property {boolean} [gazetteer.searchParcels=false] - Soll nach Flurstücken gesucht werden? Default: false.
        * @property {integer} [gazetteer.minCharacters=3] - Mindestanzahl an Characters im Suchstring, bevor Suche initieert wird. Default: 3.
        * @property {string} [config.renderToDOM=searchbar] - Die id des DOM-Elements, in das die Searchbar geladen wird.
        * @property {string} [config.recommandedListLength=5] - Die Länge der Vorschlagsliste.
        * @property {boolean} [config.quickHelp=false] - Gibt an, ob die quickHelp-Buttons angezeigt werden sollen.
        * @property {string} [config.placeholder=Suche] - Placeholder-Value der Searchbar.
        */
        initialize: function (config) {
            // https://developer.mozilla.org/de/docs/Web/API/Window/matchMedia
            // var mediaQueryOrientation = window.matchMedia("(orientation: portrait)"),
            //     mediaQueryMinWidth = window.matchMedia("(min-width: 768px)"),
            //     mediaQueryMaxWidth = window.matchMedia("(max-width: 767px)"),
            //     that = this;
            //
            // // Beim Wechsel der orientation landscape/portrait wird die Suchleiste neu gezeichnet
            // mediaQueryOrientation.addListener(function () {
            //     that.render();
            // });
            // // Beim Wechsel der Navigation(Burger-Button) wird die Suchleiste neu gezeichnet
            // mediaQueryMinWidth.addListener(function () {
            //     that.render();
            // });
            // mediaQueryMaxWidth.addListener(function () {
            //     that.render();
            // });
            this.config = config;
            if (config.recommandedListLength) {
                this.model.set("recommandedListLength", config.recommandedListLength);
            }
            if (config.quickHelp) {
                this.model.set("quickHelp", config.quickHelp);
            }
            if (config.placeholder) {
                this.model.set("placeholder", config.placeholder);
            }
            this.className = "navbar-form col-xs-9";

            EventBus.on("searchInput:setFocus", this.setFocus, this);
            EventBus.on("searchInput:deleteSearchString", this.deleteSearchString, this);

            // this.listenTo(this.model, "change:searchString", this.render);
            this.listenTo(this.model, {
                "change:recommendedList": this.renderRecommendedList,
                "change:isVisible": this.toggle
            });

            this.listenTo(Radio.channel("MenuLoader"), {
                "ready": function () {
                    this.render();
                    if ($("#map").width() >= 768) {
                        $("#searchInput").width($("#map").width() - $(".desktop").width() - 150);
                    }
                }
            });

            this.listenTo(Radio.channel("Util"), {
                "isViewMobileChanged": function () {
                    this.render();
                }
            });

            if ($("#main-nav").length > 0) {
                this.render();
            }
            if (config.renderToDOM) {
                if (config.renderToDOM === "#searchbarInMap") {
                    $(".ol-overlaycontainer-stopevent").append("<div id=\"searchbarInMap\" class=\"navbar-form \"></div");
                }
                this.setElement(config.renderToDOM);
                this.render();
            }
            else {
                // Hack für flexible Suchleiste
                $(window).on("resize", function () {
                    if ($("#map").width() >= 768) {
                        $("#searchInput").width($("#map").width() - $(".desktop").width() - 150);
                    }
                });
                if ($("#map").width() >= 768) {
                    $("#searchInput").width($("#map").width() - $(".desktop").width() - 150);
                }
            }
            if (navigator.appVersion.indexOf("MSIE 9.") !== -1) {
                $("#searchInput").val(this.model.get("placeholder"));
            }
            $("#searchInput").blur();
            // bedarfsweises Laden der Suchalgorythmen
            if (_.has(config, "gazetteer") === true) {
                // require(["modules/searchbar/gaz/model"], function (GAZModel) {
                    new GAZModel(config.gazetteer);
                // });
            }
            if (_.has(config, "specialWFS") === true) {
                // require(["modules/searchbar/specialWFS/model"], function (SpecialWFSModel) {
                    new SpecialWFSModel(config.specialWFS);
                // });
            }
            if (_.has(config, "visibleWFS") === true) {
                // require(["modules/searchbar/visibleWFS/model"], function (VisibleWFSModel) {
                    new VisibleWFSModel(config.visibleWFS);
                // });
            }
            if (_.has(config, "bkg") === true) {
                // require(["modules/searchbar/bkg/model"], function (BKGModel) {
                    new BKGModel(config.bkg);
                // });
            }
            if (_.has(config, "tree") === true) {
                // require(["modules/searchbar/tree/model"], function (TreeModel) {
                    new TreeModel(config.tree);
                // });
            }
            if (_.has(config, "layer") === true) {
                // require(["modules/searchbar/layer/model"], function (LayerSearch) {
                    new LayerSearch(config.layer);
                // });
            }
            this.listenTo(Radio.channel("DragMarker"), {
                "newAddress": this.newDragMarkerAddress
            }, this);
        },
        events: {
            "paste": "sthPasted",
            "keyup #searchInput.active": function (event) {
                _.debounce (this.setSearchString(event), 100);
            },
            "focusin input": "toggleStyleForRemoveIcon",
            "focusout input": "toggleStyleForRemoveIcon",
            "click .form-control-feedback": "deleteSearchString",
            "click .btn-search": "renderHitList",
            "click #mmlOrientaiton": function () {
                Radio.trigger("Orientation", "getOrientation");
            },
            "click .list-group-item.hit": "hitSelected",
            "click .list-group-item.results": "renderHitList",
            "mouseover .list-group-item.hit": "showMarker",
            "mouseleave .list-group-item.hit": "hideMarker",
            "click .list-group-item.type": function (e) {
                // fix für Firefox
                var event = e || window.event;

                this.collapseHits($(event.target));
            },
            "click .btn-search-question": function () {
                EventBus.trigger("showWindowHelp", "search");
            },
            "keydown": "navigateList",
            "click ": function () {
                this.clearSelection();
            }
        },
        /**
        *
        */
        render: function () {
            var attr = this.model.toJSON(),
                config = Radio.request("Parser", "getPortalConfig");

            attr.markerIcon = config.controls.orientation.markerIcon;
            this.removeMobilDesktopClass();
            if (this.config.searchbarTemplate === "mml" && Radio.request("Util", "isViewMobile")) {
                this.template = _.template(SearchbarTemplateMMLMobil);
            }
            else if (this.config.searchbarTemplate === "mml") {
                this.template = _.template(SearchbarTemplateMML);
                this.renderWhere();
            }
            else {
                this.renderWhere();
            }
            this.$el.html(this.template(attr));
            if (window.location.protocol !== "https:" || _.isUndefined(config.controls.orientation) === true || config.controls.orientation === false) {
                $("#mmlOrientaiton").remove();
                $("#geolocation_marker").remove();
                $("#mmlMobilRemove").css({"right": "70px"});
            }
            if (this.model.get("searchString").length !== 0) {
                $("#searchInput:focus").css("border-right-width", "0");
            }
            this.delegateEvents(this.events);
            Radio.trigger("Title", "setSize");
        },

        /**
        * Über die Config kann die Searchbar in ein anderes DOM gerendert werden.
        */
        renderWhere: function () {
            if (this.config.renderToDOM === "#searchbarInMap") {
                $(this.config.renderToDOM).append(this.$el); // rendern am DOM, das übergeben wird
            }
            else {
                if ($("#map").width() <= 768) {
                    $(".navbar-toggle").before(this.$el); // vor dem toggleButton
                }
                else {
                    $(".navbar-collapse").append(this.$el); // rechts in der Menuebar
                }
            }
        },

        /**
        * Hier wird speziell für mml die Klasse hinzugefügt/entfernt für Mobil/Desktop.
        **/
        removeMobilDesktopClass: function () {
            if (Radio.request("Util", "isViewMobile")) {
                    $("#searchbarInMap").addClass("searchbarInMapMobil");
                    $("#searchbarInMap").removeClass("searchbarInMap");
            }
            else {
                    $("#searchbarInMap").addClass("searchbarInMap");
                    $("#searchbarInMap").removeClass("searchbarInMapMobil");
            }
        },

        /**
        * @description Methode, um den Searchstring über den Eventbus zu steuern ohne Event auszulösen
        * @param {string} searchstring - Der einzufügende Searchstring
        */
        setSearchbarString: function (searchstring) {
            $("#searchInput").val(searchstring);
        },
        /**
        * @description Verbirgt die Menubar
        */
        hideMenu: function () {
            $(".dropdown-menu-search").hide();
        },
        /**
        *
        */
        renderRecommendedList: function () {
            // if (this.model.get("isHitListReady") === true) {
                var attr = this.model.toJSON(),
                    // sz, will in lokaler Umgebung nicht funktionieren, daher erst das Template als Variable
                    // $("ul.dropdown-menu-search").html(_.template(SearchbarRecommendedListTemplate, attr));
                    template = _.template(SearchbarRecommendedListTemplate);

                $("ul.dropdown-menu-search").css("max-width", $("#searchForm").width());
                $("ul.dropdown-menu-search").html(template(attr));
            // }
            // Wird gerufen
            if ((this.model.getInitSearchString() !== undefined &&
                this.model.get("hitList").length === 1) ||
                this.model.get("pasted") === true
            ) { // workaround für die initiale Suche von B-Plänen
                this.hitSelected();
            }
            this.model.unset("initSearchString", true);
        },
        /**
        *
        */
        renderHitList: function (evt) {
            var attr,
                template;

            // if (this.model.get("isHitListReady") === true) {
                if (evt.type !== "click" || this.model.get("hitList").length === 1) {
                    this.hitSelected(evt); // erster und einziger Eintrag in Liste
                }
                else if (evt.currentTarget.className !== "list-group-item results" && _.findWhere(this.model.get("hitList"), {name: $("#searchInput").val()})) {
                  this.hitSelected(evt);
                }
                else {
                    this.model.set("typeList", _.uniq(_.pluck(this.model.get("hitList"), "type")));
                    attr = this.model.toJSON(),
                    // sz, will in lokaler Umgebung nicht funktionieren, daher erst das Template als Variable
                    // $("ul.dropdown-menu-search").html(_.template(SearchbarHitListTemplate, attr));
                        template = _.template(SearchbarHitListTemplate);

                    $("ul.dropdown-menu-search").html(template(attr));
                }
            // }
        },
        /*
         * Methode, um den Focus über den EventBus in SearchInput zu legen
         */
        setFocus: function () {
            $("#searchInput").focus();
        },
        /**
        * Wird ausgeführt, wenn ein Eintrag ausgewählt oder bestätigt wurde.
        */
        hitSelected: function (evt) {
            var hit,
                hitID;

            // Ermittle Hit
            if (_.has(evt, "cid")) { // in diesem Fall ist evt = model
              hit = _.values(_.pick(this.model.get("hitList"), "0"))[0];
            }
            else if (_.has(evt, "currentTarget") === true && evt.currentTarget.id && evt.type !== "keyup") {
              hitID = evt.currentTarget.id;
              hit = _.findWhere(this.model.get("hitList"), {id: hitID});
            }
            else if (this.model.get("pasted") === true && this.model.get("hitList").length > 1) { // Für Straßensuche direkt über paste
              hit = _.findWhere(this.model.get("hitList"), {name: $("#searchInput").val()});
            }
            else if (_.isUndefined(evt) === false &&
              (this.model.get("hitList")[0].name.toLowerCase() === evt.target.value ||
              this.model.get("hitList")[0].name === evt.target.value)
            ) { // wenn der erste Eintrag zu dem suchstring passt nicht case sensitive und über keyup event
              hit = this.model.get("hitList")[0];
            }
            else if (evt.type === "click") { // bei direkter auswahl per click
              hit = this.model.get("hitList")[0];
            }
            // 1. Schreibe Text in Searchbar
            if (hit) {
                this.setSearchbarString(hit.name);
                // 2. Verberge Suchmenü
                if (this.model.get("pasted") === false) {

                    this.hideMenu();
                }
                // 3. Zoome ggf. auf Ergebnis
                EventBus.trigger("mapHandler:zoomTo", hit);
                // 4. Triggere Treffer über Eventbus
                // Wird benötigt für IDA und sgv-online, ...
                    EventBus.trigger("searchbar:hit", hit);
                // 5. Beende Event
                    if (evt) {
                        evt.stopPropagation();
                    }
                else {
                    this.model.set("pasted", false);
                }
            }
        },
        navigateList: function (e) {
            var selected = {},
            firstListElement = {},
            // fix für Firefox
            event = e || window.event;

            // fix für Konflikt mit externer cit-seite.
            if (event.keyCode === 13) {
                event.stopPropagation();
                event.preventDefault();
            }

            if (event.keyCode === 38 || event.keyCode === 40 || event.keyCode === 13) {
                selected = this.getSelectedElement(),
                firstListElement = this.getFirstElement();
            }

            if (selected.length === 0) {
                firstListElement.addClass("selected");
            }
            else {
                // uparrow
                if (event.keyCode === 38) {
                      this.prevElement(selected);
                }
                // down arrow
                if (event.keyCode === 40) {
                    this.nextElement(selected);
                }
                if (event.keyCode === 13 && this.model.get("hitList").length > 1) {
                    if (this.isFolderElement(selected)) {
                        this.collapseHits(selected);
                    }
                    else {
                        $("#searchInput").addClass("active");
                        selected.click();
                    }
                }
                else if (event.keyCode === 13 && _.isUndefined(selected) === false) {
                    $("#searchInput").addClass("active");
                    selected.click();
                }
            }
        },
        getSelectedElement: function () {
            return this.$el.find(this.searchbarKeyNavSelector + " .selected");
        },

        clearSelection: function () {
            this.getSelectedElement().removeClass("selected");
        },
        isLastElement: function (element) {
            return element.is(":last-child");
        },
        isFirstElement: function (element) {
            return element.is(":first-child");
        },
        isChildElement: function (element) {
            return (element.parent().prev().hasClass("type"));
        },

       getFirstChildElement: function (selected) {
            return selected.next().children().first();
        },
        isFolderElement: function (element) {
            return element.hasClass("type");
        },

        scrollToNext: function (li) {
            var parent = li.parent(),
            pos = parent.scrollTop(),
            scrollHeight = pos + li.outerHeight(true);

            parent.scrollTop(scrollHeight);
        },
        scrollToPrev: function (li) {
            var parent = li.parent(),
            pos = parent.scrollTop(),
            scrollHeight = pos - li.outerHeight(true);

            parent.scrollTop(scrollHeight);
        },
        resetScroll: function (element) {
            element.scrollTop(0);
        },

        nextElement: function (selected) {
            var next = {};

            selected.removeClass("selected");

            if (this.isFolderElement(selected) && selected.hasClass("open")) {
                next = this.getFirstChildElement(selected);
                this.resetScroll(selected.nextAll("div:first"));
            }
            else {
                if (this.isLastElement(selected)) {
                    if (this.isChildElement(selected)) {
                        if (this.isLastElement(selected.parent())) {
                           this.getFirstElement().addClass("selected");
                           return;
                        }
                        else {
                            next = this.getNextElement(selected.parent());
                            this.scrollToNext(selected);
                        }
                    }
                    else {
                        this.getFirstElement().addClass("selected");
                        return;
                    }
                }
                else {
                    next = this.getNextElement(selected);
                    this.scrollToNext(selected);
                }
            }
            next.addClass("selected");

        },

        getNextElement: function (selected) {
            return selected.nextAll("li:first");
        },

        prevElement: function (selected) {
            var prev = {};

            selected.removeClass("selected");

            if (this.isFirstElement(selected)) {
                if (this.isChildElement(selected)) {
                    // child
                    prev = selected.parent().prevAll("li:first");
                    this.resetScroll(selected.parent());
                }
                else {
                    // Folder
                    $("#searchInput").addClass("active");
                    return;
                }
            }
            else {
                prev = selected.prevAll("li:first");
                if (this.isFolderElement(selected)) {
                    this.resetScroll(selected.prevAll("div:first"));
                }
                else {
                    this.scrollToPrev(selected);
                }
            }
            prev.addClass("selected");
        },
        getFirstElement: function () {
            return this.$el.find(this.searchbarKeyNavSelector + " li").first();
        },
        getLastElement: function () {
            return this.$el.find(this.searchbarKeyNavSelector + " li").last();
        },

        /**
        *
        */
        setSearchString: function (evt) {
            var that,
                el;

            if (evt.target.value.length === 0) {
                // suche zurücksetzten, wenn der nletzte Buchstabe gelöscht wurde
                this.deleteSearchString();
            }
            else {
                if (evt.type === "paste") {
                    that = this;

                    // Das Paste Event tritt auf, bevor der Wert in das Element eingefügt wird
                    setTimeout(function () {
                        that.model.setSearchString(evt.target.value, evt.type);
                    }, 0);
                }
                else if (evt.keyCode === this.constants.arrowDown) {
                    el = $("#searchInput:focus");

                    if (el.size() !== 0) {
                        $("#searchInput").removeClass("active");
                    }
                }
                else if (evt.keyCode !== 17 &&
                        evt.keyCode !== this.constants.arrowUp &&
                        evt.keyCode !== this.constants.arrowDown &&
                        !(this.getSelectedElement("#searchInputUL").length > 0 &&
                        this.getSelectedElement("#searchInputUL").hasClass("type"))
                ) {
                    if (evt.key === "Enter" || evt.keyCode === this.constants.enter) {
                        if (_.findWhere(this.model.get("hitList"), {name: evt.target.value}) ||
                            this.model.get("hitList").length === 1) {
                            this.hitSelected(evt); // erster und einziger Eintrag in Liste
                        }
                        else {
                            this.renderHitList(evt);
                        }
                    }
                    else {
                        this.model.setSearchString(evt.target.value); // evt.target.value = Wert aus der Suchmaske
                    }
                }

                // Der "x-Button" in der Suchleiste
                if (evt.target.value.length > 0) {
                    $("#searchInput + span").show();
                }
                else {
                    $("#searchInput + span").hide();
                }
            }
        },
        collapseHits: function (target) {
            $(".list-group-item.type + div").hide("slow"); // schließt alle Reiter
            if (target.next().css("display") === "block") {
                target.next().hide("slow");
                target.removeClass("open");
            }
            else {
                target.next().show("slow");
                target.addClass("open");
                target.siblings().removeClass("open");
            }
        },
        /**
        *
        */
        toggleStyleForRemoveIcon: function (evt) {
            if (evt.type === "focusin") {
                if (navigator.appVersion.indexOf("MSIE 9.") !== -1) {
                    if ($("#searchInput").val() === this.model.get("placeholder")) {
                        $("#searchInput").val("");
                    }
                }
                $(".btn-deleteSearch").css("border-color", "#66afe9");
            }
            else if (evt.type === "focusout") {
                if (navigator.appVersion.indexOf("MSIE 9.") !== -1) {
                    if ($("#searchInput").val() === "") {
                        $("#searchInput").val(this.model.get("placeholder"));
                    }
                }
                $(".btn-deleteSearch").css("border-color", "#cccccc");
            }
        },
        /**
        *
        */
        deleteSearchString: function () {
            this.model.setSearchString("");
            $("#searchInput").val("");
            $("#searchInput + span").hide();
            this.focusOnEnd($("#searchInput"));
            this.hideMarker();
            EventBus.trigger("mapHandler:clearMarker", this);
            this.clearSelection();
            // Suchvorschläge löschen
            $("#searchInputUL").html("");

        },
        /**
        *
        */
        showMarker: function (evt) {
            var hitID = evt.currentTarget.id,
                hit = _.findWhere(this.model.get("hitList"), {id: hitID});

            if (hit.type === "Adresse" || hit.type === "Stadtteil" || hit.type === "Olympiastandort" || hit.type === "Paralympiastandort") {
                EventBus.trigger("mapHandler:showMarker", hit.coordinate);
            }
        },
        /**
        *
        */
        hideMarker: function () {
            if ($(".dropdown-menu-search").css("display") === "block") {
                EventBus.trigger("mapHandler:hideMarker", this);
            }
        },

        /**
        * Platziert den Cursor am Ende vom String
        * @param {Element} element - Das Dom-Element
        */
        focusOnEnd: function (element) {
            var strLength = element.val().length * 2;

            element.focus();
            element[0].setSelectionRange(strLength, strLength);
        },

        /**
        * Wird auf Paste ausgeführt. Timeout dient dafür, dass in der Variable auch wirklich der Wert steht
        */
        sthPasted: function (evt) {
            var pasteString,
            that = this;

            this.model.set("pasted", true);
            setTimeout(function () {
                pasteString = evt.target.value;
                that.model.setSearchString(pasteString, evt.type);
            }, 100);
        },

        /**
         * Abhängig vom Attribut "isVisible" wird
         * die Searchbar angezeigt oder versteckt.
         */
        toggle: function () {
            if (this.model.getIsVisible() === false) {
                this.$el.hide();
            }
            else {
                this.$el.show();
            }
        },
        /*
        * Schreibt die gefunde Adresse vom ReverseGeocoder ins Suchfenster
        */
        newDragMarkerAddress: function (response) {
            if (!response.error) {
                this.model.set("searchString", response.streetname + " " + response.housenumber + response.housenumberaffix);
                this.render();
                $("#searchInput + span").show();
            }
            else {
                this.model.set("searchString", "");
            }
            $("#searchInput").blur();
        }
    });

    return SearchbarView;
});
