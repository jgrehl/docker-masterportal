define([

    "eventbus",
    "config"
], function (EventBus, Config) {
    "use strict";
    var SearchbarModel = Backbone.Model.extend({
        defaults: {
            placeholder: "Suche",
            recommandedListLength: 5,
            quickHelp: false,
            searchString: "", // der aktuelle String in der Suchmaske
            hitList: [],
            minChars: "",
            // Ist die Suchbar sichtbar oder nicht
            isVisible: true
            // isHitListReady: true
        },
        /**
        *
        */
        initialize: function () {
            if (Config.quickHelp) {
                this.set("quickHelp", Config.quickHelp);
            }

            var channel = Radio.channel("Searchbar");

            channel.on({
                "hide": this.hideSearchbar,
                "show": this.showSearchbar
            }, this);


            EventBus.on("createRecommendedList", this.createRecommendedList, this);
            EventBus.on("searchbar:pushHits", this.pushHits, this);

            if (_.isUndefined(Radio.request("ParametricURL", "getInitString")) === false) {
                this.setInitSearchString(Radio.request("ParametricURL", "getInitString"));
            }

        },

        hideSearchbar: function () {
            this.setIsVisible(false);
            // this.$el.hide();
            // $("#searchForm").hide();
        },
        showSearchbar: function () {
            this.setIsVisible(true);
            // this.$el.show();
            // $("#searchForm").show();
        },
        setInitSearchString: function (value) {
            this.set("initSearchString", value);
        },

        getInitSearchString: function () {
            return this.get("initSearchString");
        },

        /**
        * aus View gaufgerufen
        */
        setSearchString: function (value, eventType) {
            var splitAdress = value.split(" ");

            // für Copy/Paste bei Adressen
            if (splitAdress.length > 1 && splitAdress[splitAdress.length - 1].match(/\d/) && eventType === "paste") {
                var houseNumber = splitAdress[splitAdress.length - 1],
                    streetName = value.substr(0, value.length - houseNumber.length - 1);

                this.set("searchString", streetName);
                EventBus.trigger("setPastedHouseNumber", houseNumber);
            }
            else {
                this.set("searchString", value);
            }
            this.set("hitList", []);
            EventBus.trigger("searchbar:search", this.get("searchString"));
            $(".dropdown-menu-search").show();
        },
        /**
         * Hilfsmethode um ein Attribut vom Typ Array zu setzen.
         * {String} attribute - Das Attribut das gesetzt werden soll
         * {whatever} value - Der Wert des Attributs
         */
        pushHits: function (attribute, value) {
            var tempArray = _.clone(this.get(attribute));

            tempArray.push(value);
            this.set(attribute, _.flatten(tempArray));
        },
        /**
        *
        */
        createRecommendedList: function () {

            var max = this.get("recommandedListLength"),
                recommendedList = [];

            // if (this.get("hitList").length > 0 && this.get("isHitListReady") === true) {
            //     this.set("isHitListReady", false);
                if (this.get("hitList").length > max) {
                    var hitList = this.get("hitList"),
                        foundTypes = [],
                        singleTypes = _.reject(hitList, function (hit) {
                            if (_.contains(foundTypes, hit.type) === true || foundTypes.length === max) {
                                return true;
                            }
                            else {
                                foundTypes.push(hit.type);
                            }
                        }),
                        usedNumbers = [],
                        randomNumber;

                    while (singleTypes.length < max) {
                        randomNumber = _.random(0, hitList.length - 1);
                        if (_.contains(usedNumbers, randomNumber) === false) {
                            singleTypes.push(hitList[randomNumber]);
                            usedNumbers.push(randomNumber);
                            singleTypes = _.uniq(singleTypes);
                        }
                    }
                    recommendedList = singleTypes;
                }
                else {
                    recommendedList = this.get("hitList");
                }
                this.set("recommendedList", _.sortBy(recommendedList, "name"));
                // this.set("isHitListReady", true);
            // }
        },

        /**
         * Setter für das Attribut "isVisible".
         * @param {boolean} value
         */
        setIsVisible: function (value) {
            this.set("isVisible", value);
        },

        /**
         * Getter für das Attribut "isVisible".
         * @return {boolean}
         */
        getIsVisible: function () {
            return this.get("isVisible");
        }
    });

    return new SearchbarModel();
});
