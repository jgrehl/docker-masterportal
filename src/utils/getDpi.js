/**
 * Since device dpi are not directly available, this common hack is applied to get the actual device dpi.
 * If dpi can not be inferred, 96 is returned as default value, and a warning is logged.
 * @returns {?number} device dpi
 */
function getDpi () {
    let dpi = 96;

    try {
        const dpiDiv = document.createElement("div"),
            body = document.body;

        dpiDiv.id = "programmatical-dpidiv";
        dpiDiv.setAttribute("style", "position: absolute; height: 1in; width: 1in; top: -100%; left: -100%;");
        body.appendChild(dpiDiv);

        dpi = dpiDiv.offsetWidth * (window.devicePixelRatio || 1);
        body.removeChild(dpiDiv);
    }
    catch (e) {
        console.error(e);
        console.warn(`Since the dpi could not be inferred, the default value ${dpi} will be used.`);
    }

    return dpi;
}

export default getDpi;
