import Theme from "../model";

const DipasTheme = Theme.extend(/** @lends DipasTheme.prototype */{
    defaults: {
        gfiAttributesDipas: {
            "Thema": "",
            "name": "",
            "description": "",
            "link": "",
            "nid": "",
            "Rubric": ""
        }

    },
    /**
     * @class DipasTheme
     * @extends Theme
     * @memberof Tools.GFI.Themes.Dipas
     * @constructs
     * @listens Theme#changeIsReady
     */
    initialize: function () {
        var featureList = this.get("gfiFeatureList");

        this.listenTo(this, {
            "change:isReady": function () {
                this.getIconPath(featureList[0].get("Thema"));
                this.getGfiTheme();
            }
        });
    },

    /**
     * generates the gfi Attributes when gfi is active
     * @returns {void}
     */
    getGfiTheme: function () {
        var gfiContent = this.get("gfiContent"),
            gfiAttributes = this.get("gfiAttributes");

        _.each(gfiAttributes, function (value, key) {
            this.get("gfiAttributesDipas")[key] = gfiContent[0][value] || key;
        }, this);
    },

    /**
     * generates the path for gfi icons
     * @param  {String} value - gfi feature attribute values
     * @fires StyleList#RadioRequestStyleListReturnModeById
     * @returns {void}
     */
    getIconPath: function (value) {
        var styleModel = Radio.request("StyleList", "returnModelById", this.get("themeId")),
            valueStyle = null,
            iconPath = "http://geoportal-hamburg.de/lgv-beteiligung/icons/einzelmarker_dunkel.png";

        if (styleModel && styleModel.has("styleFieldValues")) {
            valueStyle = styleModel.get("styleFieldValues").filter(function (styleFieldValue) {
                return styleFieldValue.styleFieldValue === value;
            });
        }
        if (valueStyle && valueStyle.length > 0 && ("imageName" in valueStyle[0])) {
            iconPath = styleModel.get("imagePath") + valueStyle[0].imageName;
        }
        this.setIconPath(iconPath);
    },

    // setter for icon path
    setIconPath: function (value) {
        this.set("iconPath", value);
    }
});

export default DipasTheme;
