import {zoomToSearchResult} from "../lib/zoomTo";

import {parse} from "./parse";
import {searchTypes} from "./types";
import {searchGazetteer} from "./searchGazetteer";

/**
 * Chains gazetteer request and response parser.
 * @param {string} type from searchTypes
 * @param {(string|string[])} values one or multiple strings, depending on type
 * @returns {Promise<SearchResult[]>} parsed response
 * @ignore
 */
function searchAndParse (type, values) {
    return new Promise((resolve, reject) => {
        searchGazetteer(type, values)
            .then(results => {
                const parsed = parse(type, results);

                resolve(parsed);
            })
            .catch(e => reject(e));
    });
}

/**
 * Chains gazetteer request and response parser for street and house number.
 * Combines streets with their available house numbers before returning.
 * @param {string} searchstring string to search for
 * @param {boolean} searchHouseNumbers whether to additionally search for house numbers
 * @returns {Promise<SearchResult[]>} parsed response
 * @ignore
 */
function searchAndParseStreetAndHouseNumber (searchstring, searchHouseNumbers) {
    return new Promise((resolve, reject) => {
        searchGazetteer(searchTypes.STREET, searchstring)
            .then(streetResults => parse(searchTypes.STREET, streetResults))
            .then(parsedStreetResults => {
                const allSearches = [];

                for (let i = 0; i < parsedStreetResults.length; i++) {
                    // put street in front of street's street+hnr as ordering
                    allSearches.push([parsedStreetResults[i]]);
                    if (searchHouseNumbers) {
                        allSearches.push(searchAndParse(searchTypes.HOUSE_NUMBERS_FOR_STREET, parsedStreetResults[i].name));
                    }
                }

                return Promise.all(allSearches);
            })
            .then(allResults => resolve([].concat(...allResults)))
            .catch(e => reject(e));
    });
}

/**
 * The search function uses the configured gazetteer to retrieve geospatial information
 * regarding a search string. Use the parameters to decide what to search for. At least one
 * searchX parameter must be true to start a search, or the search will be rejected.
 * @param {String} searchstring search string
 * @param {object} params parameter object
 * @param {boolean} [params.zoom = false] whether to zoom to the result if it's a single hit
 * @param {boolean} [params.zoomToParams] parameter object forwarded to ol/View.fit function {@link https://openlayers.org/en/latest/apidoc/module-ol_View.html#~FitOptions}
 * @param {ol/Map} [params.map] map object must be given if zoomTo is true
 * @param {boolean} [params.searchAddress = false] set true to search for a whole address
 * @param {boolean} [params.searchStreets = false] set true to search for streets
 * @param {boolean} [params.searchHouseNumbers = false] set true to search for house numbers; only works if searchStreets is true
 * @param {boolean} [params.searchDistricts = false] set true to search for districts
 * @param {boolean} [params.searchParcels = false] set true to search for parcels
 * @param {boolean} [params.searchStreetKey = false] set true to search for street keys
 * @param {boolean} [params.minCharacters = 3] minimum length of searchstring
 * @returns {Promise<SearchResult[]>} resolves array of search results; rejects without value if search was canceled internally
 */
export function search (searchstring, params) {
    return new Promise((resolve, reject) => {
        const {
                map,
                zoom = false,
                zoomToParams,
                searchAddress = false,
                searchStreets = false,
                searchDistricts = false,
                searchParcels = false,
                searchStreetKey = false,
                minCharacters = 3
            } = params,
            // promises array
            searches = [];
        let {
            searchHouseNumbers = false
        } = params;

        // stop search if search string too short
        if (searchstring.length < minCharacters) {
            reject({error: "Search string too short."});
            return;
        }

        // warn if zooming will not be possible
        if (zoom && !map) {
            console.warn("Instructed to zoom, but required map object was not given. Zooming will be skipped.");
        }

        // warn if supposed to search for house numbers, but not street - set searchHouseNumbers false for next check
        if (!searchStreets && searchHouseNumbers) {
            console.warn(`Search for '${searchstring}' supposed to retrieve house numbers, but not streets. Invalid search configuration. House numbers will not be searched for as a result.`);
            searchHouseNumbers = false;
        }

        // stop search if no search to be done
        if (!(searchAddress || searchStreets || searchHouseNumbers || searchDistricts || searchParcels || searchStreetKey)) {
            reject({error: `Search for '${searchstring}' received no indication what to search for. Search is canceled.`});
            return;
        }

        if (searchStreets) {
            searches.push(searchAndParseStreetAndHouseNumber(searchstring, searchHouseNumbers));
        }

        if (searchAddress) {
            // assume pattern like "Streetname 41b", split to ["Streetname", "41", "b"]
            const values = searchstring.split(/(\d+)/).map(s => s.trim()).filter(x => x),
                // if neither two (no affix like b) or three (with affix like b) parts found, not enough (or too many) params for method - don't search
                type = [false, false, searchTypes.ADDRESS_UNAFFIXED, searchTypes.ADDRESS_AFFIXED][values.length];

            if (type) {
                searches.push(searchAndParse(type, values));
            }
        }

        // needs pattern that looks like a name
        if (searchDistricts && (/^[a-z-üäöß]+$/i).test(searchstring)) {
            searches.push(searchAndParse(searchTypes.DISTRICT, searchstring));
        }

        // needs pattern like "A12345"
        if (searchStreetKey && (/^[a-z]{1}[0-9]{1,5}$/i).test(searchstring)) {
            searches.push(searchAndParse(searchTypes.STREET_KEY, searchstring));
        }

        if (searchParcels) {
            let values;

            // assume pattern like "1234/1...", "1234 1...", ...
            if ((/^[0-9]{4}[\s|/][0-9]*$/).test(searchstring)) {
                values = searchstring.split(/[\s|/]/);
            }
            // ... or "12345...", where separation is after fourth character
            else if ((/^[0-9]{5,}$/).test(searchstring)) {
                values = [searchstring.slice(0, 4), searchstring.slice(4)];
            }

            // if searchstring didn't match a pattern, don't search
            if (values) {
                searches.push(searchAndParse(searchTypes.PARCEL, values));
            }
        }

        Promise.all(searches)
            .then(arr => {
                const flattened = [].concat(...arr);

                if (zoom && map && flattened.length === 1) {
                    try {
                        zoomToSearchResult(map, flattened[0], zoomToParams);
                    }
                    catch (e) {
                        console.error("Zooming to element from gazetteer failed.");
                        console.error(e);
                    }
                }
                resolve(flattened);
            })
            .catch(e => reject(e));
    });
}
