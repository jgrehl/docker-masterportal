define(function (require) {

    var Theme = require("modules/tools/gfi/themes/model"),
        SchulInfoTheme;

    SchulInfoTheme = Theme.extend({
        defaults: _.extend({}, Theme.prototype.defaults, {
            themeConfig: [{
                name: "Grundsätzliche Informationen",
                isSelected: true,
                attributes: [
                    "schulname",
                    "schulform",
                    "schultyp",
                    // "Zusatzinformation zur Schulform", ?? SD
                    "schwerpunktschule",
                    "adresse_strasse_hausnr",
                    "adresse_ort",
                    "stadtteil",
                    "bezirk",
                    "schul_telefonnr",
                    "schul_email",
                    "schulportrait",
                    "schul_homepage",
                    "name_schulleiter",
                    "zustaendiges_rebbz",
                    "rebbz_homepage",
                    "schulaufsicht",
                    "offenetuer"]
            },
            {
                name: "Schulgröße",
                attributes: [
                    "anzahl_schueler",
                    "zuegigkeit_kl_1",
                    "zuegigkeit_kl_5"
                ]
            },
            {
                name: "Abschlüsse",
                attributes: [
                    "abschluss"/*,
                    "schulentlassene_oa_anteil",
                    "schulentlassene_mit_esa_anteil",
                    "schulentlassene_mit_msa_anteil",
                    "schulentlassenen_mit_fhr_anteil"*/
                    ]
            },
            {
                name: "weitere Informationen",
                attributes: [
                    "foerderart",
                    "auszeichnung",
                    "schuelerzeitung",
                    "schulische_ausrichtung",
                    "schulpartnerschaft",
                    "schulinspektion_link",
                    "schulportrait",
                    "einzugsgebiet",
                    "schulwahl_wohnort"
                    ]
            },
            {
                name: "Sprachen",
                attributes: [
                    "fremdsprache_mit_klasse",
                    "bilingual",
                    "sprachzertifikat"]
            },
            {
                name: "Ganztag",
                attributes: [
                    "ganztagsform",
                    "kernzeitbetreuung",
                    "ferienbetreuung_anteil",
                    "kernunterricht"]
            },
            {
                name: "Mittagsversorgung",
                attributes: [
                    "mittagspause",
                    "kantine_vorh",
                    "wahlmoeglichkeit_essen",
                    "vegetarisch",
                    "nutzung_kantine_anteil",
                    "kiosk_vorh"]
            }]
        }),
        initialize: function () {
            this.listenTo(this, {
                "change:isReady": this.parseGfiContent
            });
        },

        getVectorGfi: function () {
            var gfiContent = _.pick(this.get("feature").getProperties(), _.flatten(_.pluck(this.get("themeConfig"), "attributes")));

            gfiContent = this.getManipulateDate([gfiContent]);
            this.setGfiContent(gfiContent);
            this.setIsReady(true);
        },

        /**
         * Ermittelt alle Namen(=Zeilennamen) der Eigenschaften der Objekte
         */
        parseGfiContent: function () {
            if (!_.isUndefined(this.getGfiContent()[0])) {

                var gfiContent = this.getGfiContent()[0],
                    featureInfos = [];

                featureInfos = this.createFeatureInfos(gfiContent, this.get("themeConfig"));
                this.setFeatureInfos(featureInfos);
                this.determineSelectedContent(featureInfos);
            }
        },
        /**
         * categorizes gfiContent according to categories in themeConfig
         * @param  {[type]} gfiContent  [description]
         * @param  {[type]} themeConfig [description]
         * @return {[type]}             [description]
         */
        createFeatureInfos: function (gfiContent, themeConfig) {
            var featureInfos = [];

            if (!_.isUndefined(themeConfig)) {

            _.each(themeConfig, function (kategory) {
                    var kategoryObj = {
                        name: kategory.name,
                        isSelected: kategory.isSelected ? kategory.isSelected : false,
                        attributes: []};

                    _.each(kategory.attributes, function (attribute) {
                        var isAttributeFound = this.checkForAttribute(gfiContent, attribute);

                        if (isAttributeFound) {
                                kategoryObj.attributes.push({
                                    attrName: _.isUndefined(this.get("gfiAttributes")[attribute]) ? attribute : this.get("gfiAttributes")[attribute],
                                    attrValue: this.beautifyAttribute(gfiContent[attribute])
                                });
                        }
                    }, this);
                    featureInfos.push(kategoryObj);
                }, this);
            }
            return featureInfos;
        },
        beautifyAttribute: function (attribute) {
            if (attribute.indexOf("|") !== -1) {
                attribute = attribute.split("|");
            }
            if (attribute === "true" || attribute === "ja") {
                attribute = "Ja";
            }
            if (attribute === "false" || attribute === "nein") {
                attribute = "Nein";
            }
            return attribute;
        },
        /**
         * determines Selected Content to show in .gfi-content
         * @param  {[type]} featureInfos [description]
         * @return {[type]}              [description]
         */
        determineSelectedContent: function (featureInfos) {
            var selectedContent = _.filter(featureInfos, function (featureInfo) {
                return featureInfo.isSelected;
            })[0];

            this.setSelectedContent(selectedContent);
        },
        /**
         * checks if attribute is in gfiContent
         * @param  {[type]} gfiContent [description]
         * @param  {[type]} attribute  [description]
         * @return {[type]}            [description]
         */
        checkForAttribute: function (gfiContent, attribute) {
            var isAttributeFound = false;

            if (!_.isUndefined(gfiContent[attribute])) {
                isAttributeFound = true;
            }

            return isAttributeFound;
        },
        /**
         * updates featureInfos.
         * @param  {[type]} newName [description]
         * @return {[type]}                 [description]
         */
        updateFeatureInfos: function (newName) {
            var featureInfos = this.get("featureInfos");

            featureInfos = this.setIsSelected(newName, featureInfos);
            this.setFeatureInfos(featureInfos);
            this.determineSelectedContent(featureInfos);
        },
        /**
         * setsFeature selected where feature.name === newName
         * @param {[type]} newName      [description]
         * @param {[type]} featureInfos [description]
         */
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
        /**
         * checks is newName is in featureInfos
         * @param  {[type]}  newName      [description]
         * @param  {[type]}  featureInfos [description]
         * @return {Boolean}              [description]
         */
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
