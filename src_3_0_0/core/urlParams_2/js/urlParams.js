import store from "../../../app-store";
import urlParamsFacade from "./urlParamsFacade";

/**
 * @returns {void}
 */
export default function initializeUrlParams_2 () {
    const params = new URLSearchParams(window.location.search);

    params.forEach((value, key) => {
        const param = key.toUpperCase();

        if (urlParamsFacade[param]) {
            try {
                setValue(param, value);
            }
            catch (e) {
                console.warn(`The url param: ${key} isn't valid!`, e);
            }
            setTimeout(() => {
                getValue(param);
            }, 500);
        }
        else {
            console.warn(`The url param: ${key} doesn't exist!`);
        }
    });
}


/**
 * todo
 * @param {*} param todo
 * @param {*} value todo
 * @returns {void}
 */
function setValue (param, value) {
    const setter = urlParamsFacade[param].setter;
    let state = store.state;

    if (typeof setter === "string") {
        const path = setter.split(".");

        path.forEach((part, index) => {
            if (index === path.length - 1) {
                state[part] = value;
            }
            else {
                state = state[part] === undefined ? state[part] = {} : state[part];
            }
        });
    }
    else if (typeof setter === "function") {
        setter(value);
    }

}


/**
 * todo
 * @param {*} param todo
 * @returns {void}
 */
function getValue (param) {
    const path = urlParamsFacade[param].getter?.split(".");
    let state = store.state;

    path.forEach(part => {
        state = state[part];
    });

    // eslint-disable-next-line no-console
    console.log(state);
}
