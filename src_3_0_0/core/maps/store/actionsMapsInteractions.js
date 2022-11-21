
import {unByKey as unlistenByKey} from "ol/Observable.js";

import actionsMapsInteractionsZoom from "./actionsMapsInteractionsZoom";

import {toRaw} from "vue";

/**
 * Interactions with the Map and MapView.
 */

const registeredActions = {};

export default {
    ...actionsMapsInteractionsZoom,

    /**
     * Registered listener for certain events on the map.
     * @see https://openlayers.org/en/latest/apidoc/module-ol_Map-Map.html
     * @param {Object} param store context
     * @param {Object} param.commit the commit
     * @param {Object} param.dispatch the dispatch
     * @param {Object} payload parameter object
     * @param {String} payload.type The event type or array of event types.
     * @param {Function} payload.listener The listener function.
     * @param {String | Function} payload.listenerType Type of the listener. Possible are: "function", "commit" and "dispatch".
     * @returns {void}
     */
    registerListener ({commit, dispatch}, {type, listener, listenerType = "function"}) {
        registeredActions[type] = registeredActions[type] || {};
        registeredActions[type][listenerType] = registeredActions[type][listenerType] || {};
        registeredActions[type][listenerType][String(listener)] = evt => {
            if (listenerType === "function") {
                listener(evt);
            }
            else if (listenerType === "dispatch") {
                dispatch(listener, evt);
            }
            else if (listenerType === "commit") {
                commit(listener, evt);
            }
        };

        mapCollection.getMap("2D").on(type, registeredActions[type][listenerType][listener]);
    },

    /**
     * Sets map view to initial properties.
     * @param {Object} param store context
     * @param {Object} param.state the state
     * @returns {void}
     */
    resetView ({state}) {
        const view = mapCollection.getMapView("2D");

        view.setCenter(state.initialCenter);
        view.setRotation(state.initialRotation);
        view.setZoom(state.initialZoom);
    },

    /**
     * Unsubscribes listener to certain events.
     * @param {Object} _ not used
     * @param {Object} payload parameter object
     * @param {String} payload.type The event type or array of event types.
     * @param {Function} payload.listener The listener function.
     * @param {String | Function} payload.listenerType Type of the listener. Possible are: "function", "commit" and "dispatch".
     * @returns {void}
     */
    unregisterListener (_, {type, listener, listenerType = "function"}) {
        if (typeof type === "string") {
            if (registeredActions[type] && registeredActions[type][listenerType] && registeredActions[type][listenerType][String(listener)]) {
                mapCollection.getMap("2D").un(type, registeredActions[type][listenerType][String(listener)]);
                registeredActions[type][listenerType][String(listener)] = null;
            }
        }
        else {
            unlistenByKey(type);
        }
    },

    /**
     * Sets center, rotation and zoom at the view.
     * @param {Object} _ not used
     * @param {Object} payload parameter object
     * @param {Array.<number>} payload.center center of the view
     * @param {number} payload.rotation rotation of the view
     * @param {number} payload.zoom zoom of the view
     * @returns {void}
     */
    setView (_, {center, rotation, zoom}) {
        const view = mapCollection.getMapView("2D");

        if (center) {
            view.setCenter(center);
        }
        if (rotation) {
            view.setRotation(rotation);
        }
        if (zoom) {
            view.setZoom(zoom);
        }
    },

    /**
     * Sets the center of the current view.
     * @param {Object} param store context
     * @param {Object} param.getters the getters
     * @param {Object} param.commit the commit
     * @param {number[]} coords An array of numbers representing a xy-coordinate
     * @returns {void}
     */
    setCenter ({commit}, coords) {
        const view = mapCollection.getMapView("2D");
        let first2Coords = [coords[0], coords[1]];

        if (first2Coords.some(coord => typeof coord !== "number")) {
            console.warn("Given coordinates must be of type integer! Although it might not break, something went wrong and needs to be checked!");
            first2Coords = first2Coords.map(singleCoord => parseInt(singleCoord, 10));
        }
        if (Array.isArray(first2Coords) && first2Coords.length === 2) {
            commit("setCenter", coords);
            view.setCenter(coords);
        }
        else {
            console.warn("Center was not set. Probably there is a data type error. The format of the coordinate must be an array with two numbers.");
        }
    },

    /**
     * Adds an interaction to the map.
     * @param {Object} _ not used
     * @param {module:ol/interaction/Interaction} interaction - Interaction to be added to map.
     * @returns {void}
     */
    addInteraction (_, interaction) {
        const map = mapCollection.getMap("2D");

        map.addInteraction(toRaw(interaction));
    },

    /**
     * Removes an interaction from the map.
     * @param {Object} _ not used
     * @param {module:ol/interaction/Interaction} interaction - Interaction to be removed from map.
     * @returns {void}
     */
    removeInteraction (_, interaction) {
        const map = mapCollection.getMap("2D");

        if (map.removeInteraction(interaction) === undefined) {
            const interactions = map.getInteractions().getArray(),
                index = interactions.findIndex((anInteraction) => {
                    return anInteraction.ol_uid === interaction.ol_uid;
                });

            if (index > -1) {
                interactions.splice(index, 1);
            }
            else if (typeof interactions === Array) {
                console.warn("interaction cannot be removed from map:", interaction);
            }
        }
    }
};
