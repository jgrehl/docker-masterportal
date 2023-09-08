
import {unByKey as unlistenByKey} from "ol/Observable.js";

import actionsMapsInteractionsZoom from "./actionsMapsInteractionsZoom";

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
    }
};
