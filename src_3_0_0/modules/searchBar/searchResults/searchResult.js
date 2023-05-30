/**
 * A search result with its parameters.
 * For each search result there is a default value.
 * @name SearchHitResult
 * @constructs
 * @extends SearchHit
 * @param {String} category The category to which the search result should be assigned.
 * @param {String} id The id of the search result.
 * @param {String} index The index of the search results, representing the order.
 * @param {String} searchInterfaceId The id of the search interface.
 * @param {String} name The name of the search result.
 *
 * @param {Object} [events={}] Events that are performed with the intercation of a search result.
 * @param {Object} [events.onClick] Contains actions that are triggered when the onClick event is triggered on a search result.
 * @param {Object} [events.onHover] Contains actions that are triggered when the onHover event is triggered on a search result.
 * @param {Object} [events..activateLayerInTopicTree] Specifies that the activateLayerInTopicTree action is executed on an interaction with the search result.
 * @param {Object} [events..addLayerToTopicTree] Specifies that the addLayerToTopicTree action is executed on an interaction with the search result.
 * @param {Object} [events..highligtFeature] Specifies that the highligtFeature action is executed on an interaction with the search result.
 * @param {Object} [events..openGetFeatureInfo] Specifies that the openGetFeatureInfo action is executed on an interaction with the search result.
 * @param {Object} [events..openTopicTree] Specifies that the openTopicTree action is executed on an interaction with the search result.
 * @param {Object} [events..setMarker] Specifies that the setMarker action is executed on an interaction with the search result.
 * @param {Object} [events..zoomToResult] Specifies that the zoomToResult action is executed on an interaction with the search result.
 * @param {Boolean} [events...closeResults] Defines if the search results should be hidden.
 * @param {String[]} [events...coordinates] The coordinates of the search result.
 * @param {String} [events...featureId] The ol feature id the search result.
 * @param {String} [events...layerId] The layer id of the search result.
 * @param {Object} [events...source] Source information of the layer.

 * @param {String} [displayedInfo=""] Info text that is displayed in the search result.
 * @param {String} [icon=""] The icon that can be displayed in the search result.Array
 * @param {String} [imagePath=""] The image that can be displayed in the search result.Array
 * @param {String} [toolTip=""] Text to be displayed on the search result when mousehovering.
 *
 * @example Example for Events
    events = {
        onClick: {
            activateLayerInTopicTree: {
                layerId: "",
                closeResults: true
            },
            addLayerToTopicTree: {
                layerId: "",
                source: {},
                closeResults: true
            },
            highligtFeature: {
                hit: {},
                closeResults: false
            },
            openGetFeatureInfo: {
                featureId: "",
                layerId: "",
                closeResults: true
            },
            openTopicTree: {
                closeResults: true
            },
            setMarker: {
                coordinates: [],
                closeResults: false
            },
            zoomToResult: {
                coordinates: [],
                closeResults: true
            }
        }
    }
 * @returns {void}
 */
export default function SearchResult ({category, events, id, index, name, searchInterfaceId, displayedInfo, icon, imagePath, toolTip} = {}) {
    this.category = category;
    this.id = id;
    this.index = index;
    this.name = name;
    this.searchInterfaceId = searchInterfaceId;

    this.events = events;

    this.displayedInfo = displayedInfo || "";
    this.icon = icon || "";
    this.imagePath = imagePath || "";
    this.toolTip = toolTip || "";
}
