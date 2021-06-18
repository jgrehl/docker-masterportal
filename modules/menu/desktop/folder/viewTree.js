import FolderTemplate from "text-loader!./templateTree.html";
import TabIndexUtils from "../../../core/tabIndexUtils";

/**
 * @member FolderTemplate
 * @description Template used to create the Folder View Tree
 * @memberof Menu.Desktop.Folder
 */

const FolderViewTree = Backbone.View.extend(/** @lends FolderViewTree.prototype */{
    events: {
        "click .title, .glyphicon-minus-sign, .glyphicon-plus-sign": "toggleIsExpanded",
        "click .selectall": "toggleIsSelected",
        "keydown": "toggleKeyAction"
    },
    /**
     * @class FolderViewTree
     * @extends Backbone.View
     * @memberof Menu.Desktop.Folder
     * @constructs
     * @listens FolderViewTree#changeIsSelected
     * @listens FolderViewTree#changeIsExpanded
     * @listens FolderViewTree#isVisibleInTree
     * @fires FolderViewTree#toggleIsExpanded
     * @fires FolderViewTree#toggleIsSelected
     * @fires ModelList#RadioTriggerModelListSetIsSelectedOnChildLayers
     */
    initialize: function () {
        // prevents the theme tree to close due to Bootstrap
        this.$el.on({
            click: function (e) {
                e.stopPropagation();
            }
        });
        this.listenTo(this.model, {
            "change:isSelected": this.rerender,
            "change:isExpanded": this.rerender,
            "change:isVisibleInTree": this.removeIfNotVisible
        });
        this.render();
    },
    tagName: "li",
    className: "themen-folder",
    id: "",
    template: _.template(FolderTemplate),

    /**
     * Renders the data to DOM.
     * @return {FolderViewTree} returns this
     */
    render: function () {
        const attr = this.model.toJSON();

        let selector = "",
            paddingLeftValue = 0;

        this.$el.html("");

        if (this.model.get("isVisibleInTree")) {
            this.$el.attr("id", this.model.get("id"));

            // external Folder
            if (this.model.get("parentId") === "ExternalLayer") {
                const parentEl = $("#" + this.model.get("parentId"));

                parentEl.css("height", "auto");
                parentEl.append(this.$el.html(this.template(attr)));
            }
            else {
                // Folder ab der ersten Ebene
                if (this.model.get("level") > 0) {
                    $("#" + this.model.get("parentId")).after(this.$el.html(this.template(attr)));
                }
                else {
                    // Folder ist auf der Höchsten Ebene (direkt unter Themen)
                    if (this.model.get("parentId") === "Baselayer") {
                        selector = "#Baselayer";
                    }
                    else {
                        selector = "#Overlayer";
                    }
                    $(selector).append(this.$el.html(this.template(attr)));
                }
                paddingLeftValue = (this.model.get("level") * 15) + 5;

                $(this.$el).css("padding-left", paddingLeftValue + "px");
            }
        }
        else if (this.model.get("parentId") === "ExternalLayer") {
            // fixes Bug BG-750: IE11 height was negative
            $("#" + this.model.get("parentId")).css("height", "0px");
        }
        this.setAllTabIndices();
        return this;
    },

    /**
     * Handles all keyboard events, e.g. for open/close the folder or selecting the whole component.
     * @param {Event} event - the event instance
     * @returns {void}
     */
    toggleKeyAction: function (event) {
        if (event.which === 32 || event.which === 13) {
            if (this.model.get("isFolderSelectable")) {
                this.toggleIsSelected();
            }
            event.stopPropagation();
            event.preventDefault();
        }
        else if (event.which === 37) {
            this.model.setIsExpanded(false);
            event.stopPropagation();
            event.preventDefault();
        }
        else if (event.which === 39) {
            this.model.setIsExpanded(true);
            event.stopPropagation();
            event.preventDefault();
        }
    },

    /**
     * Sets the focus to the <a> element of this component.
     * @param {Event} event - the event instance
     * @returns {void}
     */
    setFocus: function () {
        const htmlAElement = document.querySelector("#" + this.model.get("id") + ">a");

        if (htmlAElement) {
            htmlAElement.focus();
        }
    },

    /**
     * Sets all tabindices in the whole menu tree to enable keyboard navigation.
     * @returns {void}
     */
    setAllTabIndices: function () {
        const treeRootId = TabIndexUtils.getTreeRootItemId(this.model.get("parentId")),
            parentTabIndexElement = $("a." + treeRootId),
            allComponentsSiblingTabIndexElements = $("#" + treeRootId + " .tabable"),
            offset = 10;

        TabIndexUtils.setAllTabIndicesFromParent(parentTabIndexElement, allComponentsSiblingTabIndexElements, offset);
    },

    /**
     * Rerenders the data to DOM.
     * @return {void}
     */
    rerender: function () {
        const attr = this.model.toJSON();

        this.$el.html(this.template(attr));
        this.setAllTabIndices();
        this.setFocus();
    },
    /**
     * Toogle Expanded
     * @return {void}
     */
    toggleIsExpanded: function () {
        this.model.toggleIsExpanded();
    },
    /**
     * Toggle Selected
     * @fires ModelList#RadioTriggerModelListSetIsSelectedOnChildLayers
     * @return {void}
     */
    toggleIsSelected: function () {
        this.model.toggleIsSelected();
        // TODO BUG dependent on the (de) selection the children must also be deselected
        Radio.trigger("ModelList", "setIsSelectedOnChildLayers", this.model);
        this.model.setIsExpanded(true);
    },
    /**
     * Remove if not visible
     * @return {void}
     */
    removeIfNotVisible: function () {
        if (!this.model.get("isVisibleInTree")) {
            this.remove();
        }
    }

});

export default FolderViewTree;
