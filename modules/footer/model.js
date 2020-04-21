let translateFooter = false;

const FooterModel = Backbone.Model.extend(/** @lends FooterModel.prototype */{
    defaults: {
        urls: [
            {
                "bezeichnung": "Kartographie und Gestaltung: ",
                "url": "https://www.masterportal.org/",
                "alias": "Implementierungspartnerschaft Masterportal",
                "alias_mobil": "IP Masterportal",
                // if a tool should be opened, no url is necessary, provide the id of the dedicated model
                "toolModelId": "draw"
            }
        ],
        showVersion: false,
        // translations
        currentLng: "",
        versionText: ""
    },
    /**
     * @class FooterModel
     * @extends Backbone.Model
     * @memberof Footer
     * @property {Array} urls Array of URLs to be displayed in the Footer (defaults to LGV Hamburg)
     * @property {Object} version={} Version of Masterportal to be shown in the footer
     * @property {String} currentLng="", contains current language - if this changes the view is rendered
     * @property {String} versionText="", filled with "Version"- translated
     * @listens i18next#RadioTriggerLanguageChanged
     * @constructs
     */
    initialize: function () {
        this.changeLang(i18next.language);
        this.listenTo(Radio.channel("i18next"), {
            "languageChanged": this.changeLang
        });
    },
    /**
     * change language - sets default values for the language
     * @param {String} lng the language changed to
     * @returns {Void}  -
     */
    changeLang: function (lng) {
        const urls = this.get("urls");

        urls.forEach(function (url) {
            if (url.aliasKey) {
                url.alias = i18next.t(url.aliasKey);
            }
            else if (url.alias.indexOf("translate#") > -1) {
                url.aliasKey = url.alias.substring("translate#".length);
                url.alias = i18next.t(url.aliasKey);
            }
            if (url.bezeichnung.indexOf("translate#") === 0 || translateFooter === true) {
                translateFooter = true;
                urls[0].bezeichnung = i18next.t("common:modules.footer.designation");
            }
        }, this);
        this.set({
            urls: urls,
            versionText: i18next.t("common:modules.footer.version"),
            currentLng: lng
        });
    }
});

export default FooterModel;
