import store from "../../../app-store";
import urlParamsFacade from "./urlParamsFacade";

/**
 * Sets the url params ro the app-store state.
 * @returns {void}
 */
export function initializeUrlParams_3 () {
    const params = new URLSearchParams(window.location.search);

    params.forEach((value, key) => {
        const param = key.toUpperCase();

        if (urlParamsFacade[param]) {
            store.state.urlParams[param] = value;
        }
        else {
            console.warn(`The url param: ${key} doesn't exist!`);
        }
    });

    setTimeout(() => {
        console.log(getValue());
    }, 10000);

    // https://localhost:9001/portal/master_3_0_0/?LAYERIDS=453,12884,12883,2426&VISIBILITY=true,true,true,true&MAPS={"center":[569311.8351473155,5939996.083166838],"mode":"2D","zoom":5}&MENU_MAIN={"currentComponent":"print"}&MODULE_MAIN={"autoAdjustScale":true,"currentFormat":"pdf","currentLayoutName":"A3 Querformat","currentScale":5000,"dpiForPdf":75,"title":"ABC"}&MENU_SECONDARY={"currentComponent":"measure"}&MODULE_SECONDARY={"selectedGeometry":"Polygon","selectedUnit":"1"}
}

// /**
//  * Start the setter for url params.
//  * @returns {void}
//  */
// export function processUrlParams () {
//     const params = store.getters.urlParams;

//     Object.keys(params).forEach(key => {
//         const setter = urlParamsFacade[key].setter;

//         if (typeof setter === "string") {
//             setStateForString(setter, params[key][0]);
//         }
//         else if (typeof setter === "function") {
//             setter();
//         }
//     });
// }

// /**
//  * Sets the state for string setter.
//  * @param {String} setter The setter with path.
//  * @param {Object} value The value of the current url param.
//  * @returns {void}
//  */
// function setStateForString (setter, value) {
//     const path = setter.split(".");
//     let state = store.state;

//     path.forEach((part, index) => {
//         if (index === path.length - 1) {
//             state[part] = value;
//         }
//         else {
//             state = state[part] === undefined ? state[part] = {} : state[part];
//         }
//     });
// }

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
