import urlParamsFacade from "./urlParamsFacade";

/**
 * @returns {void}
 */
export default function initializeUrlParams () {
    const params = new URLSearchParams(window.location.search);

    params.forEach((value, key) => {
        const param = key.toUpperCase();

        if (urlParamsFacade[param]) {
            urlParamsFacade[param].setter(value);
            // eslint-disable-next-line no-console
            console.log(urlParamsFacade[param].getter());
        }
        else {
            console.warn(`The url param: ${key} doesn't exist!`);
        }
    });
}
