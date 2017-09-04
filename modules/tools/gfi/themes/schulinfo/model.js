define(function (require) {

    var Theme = require("modules/tools/gfi/themes/model"),
        SchulInfoTheme;

    SchulInfoTheme = Theme.extend({
        defaults: {
            themeConfig: {
                kategories: [{
                    name: "Grundsätzliche Informationen",
                    isSelected: true,
                    attributes: [
                        "Name",
                        "Schulform",
                        "Zusatzinformation zur Schulform",
                        "Schwerpunktschule",
                        "Standort",
                        "Adresse",
                        "Stadtteil",
                        "Bezirk",
                        "Telefon",
                        "Email",
                        "Schulportrait",
                        "Homepage",
                        "Schulleitung",
                        "Zustaendiges ReBBZ",
                        "Schulaufsicht",
                        "Tag d. offenen Tür"]
                },
                {
                    name: "Schulgröße",
                    attributes: [
                        "Schülerzahl",
                        "Parallelklassen (Kl. 1)",
                        "Parallelklassen (Kl. 5)"
                    ]
                },
                {
                    name: "Abschlüsse",
                    attributes: [
                        "Abschluss",
                        "Schulentlassene ohne Abschluss (%)",
                        "Schulentlassene mit ESA (%)",
                        "Schulentlassene mit ESA (%)",
                        "Schulentlassene mit FHR oder Abitur (%)"]
                },
                {
                    name: "weitere Informationen",
                    attributes: [
                        "Auszeichnung",
                        "Schülerzeitung",
                        "Ausrichtung",
                        "Schulpartnerschaft",
                        "Schulinspektion",
                        "Schulportrait",
                        "Einzugsgebiet",
                        "Schulwahl Wohnort"
                        ]
                },
                {
                    name: "Sprachen",
                    attributes: [
                        "Fremdsprachen",
                        "Bilingual",
                        "Sprachzertifikat"]
                },
                {
                    name: "Ganztag",
                    attributes: [
                        "Ganztagsform",
                        "Kernzeitbetreuung",
                        "Anteil Ferienbetreuung",
                        "Kernunterricht"]
                },
                {
                    name: "Mittagsversorgung",
                    attributes: [
                        "Mittagspause",
                        "Kantine",
                        "Wahlmöglichkeit Essen",
                        "Vegetarisch",
                        "Nutzung Kantine",
                        "Kiosk"]
                }]
            }
        },
        initialize: function () {
            this.listenTo(this, {
                "change:isReady": this.parseGfiContent
            });
        },
        /**
         * Ermittelt alle Namen(=Zeilennamen) der Eigenschaften der Objekte
         */
        parseGfiContent: function () {
            if (!_.isUndefined(this.getGfiContent()[0])) {

                var gfiContent = this.getGfiContent()[0],
                    themeConfig = this.get("themeConfig"),
                    featureInfos = [];

                featureInfos = this.createFeatureInfos(gfiContent, themeConfig);
                this.setFeatureInfos(featureInfos);
                this.determineSelectedContent(featureInfos);
            }
        },
        createFeatureInfos: function (gfiContent, themeConfig) {
            var featureInfos = [];

            if (!_.isUndefined(themeConfig)) {

            _.each(themeConfig.kategories, function (kategory) {
                    var kategoryObj = {
                        name: kategory.name,
                        isSelected: kategory.isSelected ? kategory.isSelected : false,
                        attributes: []};

                    _.each(kategory.attributes, function (attribute) {
                        var isAttributeFound = this.checkForAttribute(gfiContent, attribute);

                        if (isAttributeFound) {
                            kategoryObj.attributes.push({
                                attrName: attribute,
                                attrValue: gfiContent[attribute]});
                        }
                    }, this);
                    featureInfos.push(kategoryObj);
                }, this);
            }

            return featureInfos;
        },
        determineSelectedContent: function (featureInfos) {
            var selectedContent = _.filter(featureInfos, function (featureInfo) {
                return featureInfo.isSelected;
            })[0];

            this.setSelectedContent(selectedContent);
        },
        checkForAttribute: function (gfiContent, attribute) {
            var isAttributeFound = false;

            if (!_.isUndefined(gfiContent[attribute])) {
                isAttributeFound = true;
            }

            return isAttributeFound;
        },
        updateFeatureInfos: function (newSelectedName) {
            var featureInfos = this.get("featureInfos");

            featureInfos = this.setIsSelected(newSelectedName, featureInfos);
            this.setFeatureInfos(featureInfos);
            this.determineSelectedContent(featureInfos);
        },
        setIsSelected: function (newName, featureInfos) {
            var newNameFound = false;

            newNameFound = this.isNewNameInFeatureInfos(newName, featureInfos);
            if (newNameFound) {
                _.each(featureInfos, function (featureInfo) {
                    if (featureInfo.name === newName) {
                        featureInfo.isSelected = true;
                    }
                    else {
                        featureInfo.isSelected = false;
                    }
                });
            }
            return featureInfos;
        },
        isNewNameInFeatureInfos: function (newName, featureInfos) {
            var newNameFound = false,
                filterArray;

            filterArray = _.filter(featureInfos, function (featureObject) {
                if (featureObject.name === newName) {
                    return true;
                }
                else {
                    return false;
                }
            });
            if (filterArray.length > 0) {
                newNameFound = true;
            }
            return newNameFound;
        },
        // setter for selectedContent
        setSelectedContent: function (value) {
            this.set("selectedContent", value);
        },
        // setter for featureInfos
        setFeatureInfos: function (value) {
            this.set("featureInfos", value);
        }
    });

    return SchulInfoTheme;
});
