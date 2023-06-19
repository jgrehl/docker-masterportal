import SearchInterface from "./searchInterface";
import store from "../../../app-store";

/**
 * The search interface to the elasticSearch.
 * @name SearchInterfaceElasticSearch
 * @param {Object} hitMap Object mapping result object attributes to keys.
 * @param {String} hitMap.coordinate Attribute value will be mapped to the attribute key.
 * @param {String} hitMap.id Attribute value will be mapped to the attribute key.
 * @param {String} hitMap.name Attribute value will be mapped to the attribute key.
 * @param {String} serviceId Search service id. Resolved using the **[rest-services.json](rest-services.json.md)** file.
 *
 * @param {String} [hitIcon="bi-list-ul"] CSS icon class of search results, shown before the result name.
 * @param {Object} [hitType="common:modules.searchBar.type.subject"] Search result type shown in the result list after the result name.
 * @param {Object} [payload={}] Matches the customObject description.
 * @param {String} [responseEntryPath=""] Response JSON attribute path to found features.
 * @param {Object} [resultEvents] Actions that are executed when an interaction, such as hover or click, is performed with a result list item.
 * @param {String[]} [resultEvents.onClick=["activateLayerInTopicTree", "addLayerToTopicTree", "openTopicTree"]] Actions that are fired when clicking on a result list item.
 * @param {String} [searchInterfaceId="elasticSearch"] The id of the service interface.
 * @param {String} [searchStringAttribute="searchString"] Search string attribute name for `payload` object.
 * @param {String[]} [featureButtons=["addLayer"]] Feature buttons to be shown next to a single search result.
 * @param {String} [type="POST"] Request type.
 * @constructs
 * @extends SearchInterface
 * @returns {void}
 */
export default function SearchInterfaceElasticSearch ({hitMap, serviceId, hitIcon, hitType, payload, responseEntryPath, resultEvents, searchInterfaceId, featureButtons, searchStringAttribute, type} = {}) {
    SearchInterface.call(this,
        "request",
        searchInterfaceId || "elasticSearch",
        resultEvents || {
            onClick: ["activateLayerInTopicTree", "addLayerToTopicTree", "openTopicTree"]
        });

    this.hitMap = hitMap;
    this.serviceId = serviceId;
    this.hitIcon = hitIcon || "bi-list-ul";
    this.hitType = hitType || "common:modules.searchBar.type.subject";
    this.payload = payload || {};
    this.responseEntryPath = responseEntryPath || "";
    this.searchStringAttribute = searchStringAttribute || "searchString";
    this.featureButtons = featureButtons || ["addLayer"];
    this.type = type || "POST";
}

SearchInterfaceElasticSearch.prototype = Object.create(SearchInterface.prototype);

/**
 * Search in elasticSearch search interface.
 * @override
 * @param {String} searchInput The search input.
 * @returns {void}
 */
SearchInterfaceElasticSearch.prototype.search = async function (searchInput) {
    const searchStringAttribute = this.searchStringAttribute,
        payload = this.appendSearchStringToPayload(this.payload, searchStringAttribute, searchInput),
        payloadWithIgnoreIds = this.addIgnoreIdsToPayload(payload, Config?.tree),
        requestConfig = {
            serviceId: this.serviceId,
            type: this.type,
            payload: payloadWithIgnoreIds,
            responseEntryPath: this.responseEntryPath
        },
        result = await this.initializeSearch(requestConfig),
        normalizedResults = this.normalizeResults(result.hits);

    this.pushHitsToSearchResults(normalizedResults);

    return this.searchResults;
};

/**
 * Recursively searches for the searchStringAttribute key and sets the searchString.
 * Adds the search string to the payload using the given key
 * @param {Object} payload Payload as Object
 * @param {String} searchStringAttribute Attribute key to be added to the payload object.
 * @param {String} searchString Search string to be added using the searchStringAttribute.
 * @returns {Object} The payload with the search string.
 */
SearchInterfaceElasticSearch.prototype.appendSearchStringToPayload = function (payload, searchStringAttribute, searchString) {
    Object.keys(payload).forEach(key => {
        if (typeof payload[key] === "object") {
            payload[key] = this.appendSearchStringToPayload(payload[key], searchStringAttribute, searchString);
        }
        else if (key === searchStringAttribute) {
            payload[searchStringAttribute] = searchString;
        }
    });

    return payload;
};

/**
 * Blacklist of layerIds and metdataids.
 * Adds layerids and metadataids to the payload that should not appear in the response.
 * @param {Object} payload Payload as Object.
 * @param {Object} configTree Tree configuration from config.js.
 * @returns {Object} Payload with ignore ids.
 */
SearchInterfaceElasticSearch.prototype.addIgnoreIdsToPayload = function (payload, configTree) {
    if (configTree?.layerIDsToIgnore?.length > 0) {
        payload.params.id = configTree.layerIDsToIgnore;
    }
    if (configTree?.metaIDsToIgnore?.length > 0) {
        payload.params["datasets.md_id"] = configTree.metaIDsToIgnore;
    }

    return payload;
};

/**
 * Main function to start the search using the requestConfig.
 * @param {Object} requestConfig The configuration of the axios request.
 * @param {String} requestConfig.serviceId Id of the rest-service to be used. If serviceId is given, the url from the rest-service is taken.
 * @param {String} requestConfig.url If no serviceId is given, alternatively an url can be passed.
 * @param {String} requestConfig.type Type of request. "POST" or "GET".
 * @param {Object} requestConfig.payload Payload used to "POST" to url or be appended to url if type is "GET".
 * @param {String} requestConfig.responseEntryPath="" The path of the hits in the response JSON. The different levels of the response JSON are marked with "."
 * @returns {Object} The result object of the request.
 */
SearchInterfaceElasticSearch.prototype.initializeSearch = async function (requestConfig) {
    const restService = store?.getters?.restServiceById(this.serviceId),
        url = restService ? restService.url : requestConfig.url;
    let result = {
        status: "success",
        message: "",
        hits: []
    };

    if (url) {
        result = await this.sendRequest(url, requestConfig, result);
    }
    else {
        result.status = "error";
        result.message = `Cannot retrieve url by rest-service with id: ${this.serviceId} ! Please check the configuration for rest-services!`;
        result.hits = [];
    }
    return result;
};

/**
 * Sends the request.
 * @param {String} url url to send request.
 * @param {Object} requestConfig Config with all necccessary params for request.
 * @param {Object} result Result object.
 * @param {String} result.status Status of request "success" or "error".
 * @param {String} result.message Message of request.
 * @param {Object[]} result.hits Array of result hits.
 * @returns {Object} Parsed result of request.
 */
SearchInterfaceElasticSearch.prototype.sendRequest = async function (url, requestConfig, result) {
    const type = requestConfig.type || "POST",
        payload = requestConfig.payload || undefined,
        urlWithPayload = type === "GET" ? `${url}?source_content_type=application/json&source=${
            JSON.stringify(payload)
        }` : url;
    let resultData = result;

    if (type === "GET") {
        resultData = await this.requestSearch(urlWithPayload, "GET");
    }
    else if (type === "POST") {
        resultData = await this.requestSearch(url, "POST", payload);
    }

    return resultData.hits;
};

/**
 * Normalizes the search results to display them in a SearchResult.
 * @param {Object[]} searchResults The search results of gazetter.
 * @returns {Object[]} The normalized search result.
 */
SearchInterfaceElasticSearch.prototype.normalizeResults = function (searchResults) {
    const normalizedResults = [];

    searchResults.forEach(searchResult => {
        normalizedResults.push({
            events: this.normalizeResultEvents(this.resultEvents, searchResult),
            category: i18next.t(this.hitType),
            featureButtons: this.featureButtons,
            icon: this.hitIcon,
            id: searchResult._id,
            name: searchResult._source.name,
            toolTip: `${searchResult._source.name} (${searchResult._source.datasets[0].md_name})`
        });
    });

    return normalizedResults;
};

/**
 * Creates the possible actions and fills them.
 * @param {Object} searchResult The search result of elastic search.
 * @returns {Object} The possible actions.
 */
SearchInterfaceElasticSearch.prototype.createPossibleActions = function (searchResult) {
    return {
        activateLayerInTopicTree: {
            layerId: searchResult._source.id,
            closeResults: true
        },
        addLayerToTopicTree: {
            layerId: searchResult._source.id,
            source: searchResult._source,
            closeResults: true
        },
        openTopicTree: {
            closeResults: true
        }
    };
};
