import {nextTick} from "vue";
import store from "../../../app-store";
import mapUrlParams from "../../../core/maps/js/mapUrlParams";
import menuUrlParams from "../../../modules/menu/js/menuUrlParams";
import urlParamsFacade from "./urlParamsFacade";

/**
 * Sets the url params ro the app-store state.
 * @returns {void}
 */
export function initializeUrlParams () {
    const params = new URLSearchParams(window.location.search);

    params.forEach((value, key) => {
        store.state.urlParams[key.toUpperCase()] = value;
    });

    // setTimeout(() => {
    //     console.log(getValue());
    // }, 10000);
}

/**
 * Processes the url params.
 * @returns {void}
 */
export function startProcessUrlParams () {
    nextTick(() => {
        mapUrlParams.processMapUrlParams();
        menuUrlParams.processMenuUrlParams();
    });
}


// ##################  //
// ** zu shareView ** //
// ##################  //

/**
 * Create the url param from current state.
 * @returns {String} The url params.
 */
function getValue () {
    let urlParams = `${location.origin}${location.pathname}?`;

    Object.keys(urlParamsFacade).forEach((key, index) => {
        const getter = urlParamsFacade[key].getter;

        urlParams = index === 0 || Object.keys(urlParamsFacade[key]).length === 0 ? urlParams : `${urlParams}&`;

        if (typeof getter === "string") {
            urlParams = `${urlParams}${key}=${getStateForString(getter)}`;
        }
        else if (typeof getter === "function") {
            urlParams = `${urlParams}${getter()}`;
        }
    });

    return urlParams;
}

/**
 * gets the state for string getter.
 * @param {Object} getter The getter with path.
 * @returns {String} The value.
 */
function getStateForString (getter) {
    const path = getter?.split(".");
    let state = store.state;

    path.forEach(part => {
        state = state[part];
    });

    return state;
}
