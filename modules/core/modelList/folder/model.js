import Item from "../item";

const Folder = Item.extend(/** @lends Folder.prototype */{
    defaults: _.extend({}, Item.prototype.defaults, {
        isVisibleInMenu: true,
        isRoot: false,
        isExpanded: false,
        isInitiallyExpanded: false,
        isAlwaysExpanded: false,
        isSelected: false,
        type: "",
        parentId: "",
        isLeafFolder: false,
        id: "",
        selectAllGlyphicon: "glyphicon-unchecked",
        glyphicon: "glyphicon-folder-open",
        obliqueModeBlacklist: ["tree", "tools"],
        // translate
        currentLng: "",
        saveSelectionText: "",
        topicsHelpText: "",
        mapBackgroundText: "",
        pinTopicsTreeText: "",
        hideAllTopicsText: "",
        showAllTopicsText: "",
        categoryText: ""
    }),
    /**
     * @class Folder
     * @extends Item
     * @memberof Core.ModelList.Folder
     * @constructs
     * @property {Boolean} isVisibleInMenu=true Flag if folder is visible in menu.
     * @property {Boolean} isRoot=false Flag if folder belongs to first level.
     * @property {Boolean} isExpanded=false Flag if folder is expanded.
     * @property {Boolean} isInitiallyExpanded=false Flag if folder is expanded initially.
     * @property {Boolean} isSelected=false Flag if all children are selected.
     * @property {String} type="" Flag what kind of item it is. "folder".
     * @property {String} parentId="" Id of parent node.
     * @property {Boolean} isLeafFolder=false Flag if folder does not have subfolders.
     * @property {String} id="" Unique id for folder.
     * @property {String} selectAllGlyphicon="glyphicon-unchecked" Glyphicon class of folder to select all children.
     * @property {String} glyphicon="glyphicon-folder-open" Glyphicon class of folder
     * @property {String} currentLng=""contains the current language - view listens to it
     * @property {String} saveSelectionText="" will be translated
     * @property {String} topicsHelpText="" will be translated
     * @property {String} mapBackgroundText="" will be translated
     * @property {String} pinTopicsTreeText="" will be translated
     * @property {String} hideAllTopicsText="" will be translated
     * @property {String} showAllTopicsText="" will be translated
     * @property {String[]} obliqueModeBlacklist=["tree,"tools"] List of folder ids that are not displayed in oblique mode("Schr�gluftbilder").
     */
    initialize: function () {
        let items,
            isEveryToolInvisible = true,
            isEveryLayerSelected = true;

        // Wenn alle Layer in einem Folder selektiert sind, wird der Folder auch selektiert
        if (this.get("parentId") === "Overlayer") {
            items = Radio.request("Parser", "getItemsByAttributes", {parentId: this.get("id")});
            items.forEach(function (item) {
                if (item.isSelected === false) {
                    isEveryLayerSelected = false;
                }
            });

            if (isEveryLayerSelected === true) {
                this.setIsSelected(true);
            }
        }
        if (this.get("id") === "tools") {
            items = Radio.request("Parser", "getItemsByAttributes", {parentId: this.get("id")});
            items.forEach(function (item) {
                if (item.isVisibleInMenu === true) {
                    isEveryToolInvisible = false;
                }
            });

            if (isEveryToolInvisible === true) {
                this.setIsVisibleInMenu(false);
            }
        }
        this.listenTo(Radio.channel("i18next"), {
            "languageChanged": this.changeLang
        });
        this.changeLang();
    },
    /**
     * change language - sets default values for the language
     * @param {String} lng the language changed to
     * @returns {Void}  -
     */
    changeLang: function (lng) {
        this.set({
            saveSelectionText: i18next.t("common:menu.tools.saveSelection"),
            topicsHelpText: i18next.t("common:tree.topicsHelp"),
            mapBackgroundText: i18next.t("common:tree.mapBackground"),
            pinTopicsTreeText: i18next.t("common:tree.pinTopicsTree"),
            hideAllTopicsText: i18next.t("common:tree.hideAllTopics"),
            showAllTopicsText: i18next.t("common:tree.showAllTopics"),
            categoryText: i18next.t("common:tree.category"),
            currentLng: lng
        });
    },

    /**
     * Setter for attribute "isExpanded".
     * @param {Boolean} value Flag for isExpanded.
     * @param {Object} options Backbone options for setter
     * @returns {void}
     */
    setIsExpanded: function (value, options) {
        this.set("isExpanded", value, options);
    },

    /**
     * Setter for attribute "isSelected"
     * @param {Boolean} value Flag for isSelected.
     * @param {Boolean} silent Flag if attribute should be set in silent-mode.
     * @returns {void}
     */
    setIsSelected: function (value, silent) {
        if (silent === undefined) {
            this.set("isSelected", value);
        }
        this.set("isSelected", value, {silent: silent});
    },

    /**
     * Toggles the attribute "isSelected"
     * @returns {void}
     */
    toggleIsSelected: function () {
        if (this.get("isSelected") === true) {
            this.setIsSelected(false);
        }
        else {
            this.setIsSelected(true);
        }
    },

    /**
     * Toggles the attribute "isExpanded".
     * @returns {void}
     */
    toggleIsExpanded: function () {
        if (this.get("isExpanded") === true) {
            this.setIsExpanded(false);
        }
        else {
            this.setIsExpanded(true);
        }
        if (this.get("parentId") === "tree" && !this.get("isAlwaysExpanded")) {
            this.collection.toggleCatalogs(this.get("id"));
        }
    },

    /**
     * Sets the attribute "selectAllGlyphicon"
     * @param {String} value Glyphicon class.
     * @returns {void}
     */
    setSelectAllGlyphicon: function (value) {
        this.set("selectAllGlyphicon", value);
    },
    /**
     * Translates the given key
     * @param {String} key key to translate
     * @returns {void}
     */
    translate: function (key) {
        return i18next.t(key);
    }
});

export default Folder;
