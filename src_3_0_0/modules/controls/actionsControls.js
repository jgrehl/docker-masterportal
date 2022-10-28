import upperFirst from "../../utils/upperFirst";

export default {
    /**
     * Merge the control state of a control.
     * @param {Object} param store context
     * @param {Object} param.commit the commit
     * @param {Object} payLoad The payload.
     * @param {Object} payLoad.controlKey The control key.
     * @param {Object} payLoad.controlValues The values that are to be committed to the control.
     * @returns {void}
     */
    mergeControlState ({commit}, {controlKey, controlValues}) {
        Object.keys(controlValues).forEach(key => {
            commit(`${upperFirst(controlKey)}/set${upperFirst(key)}`, controlValues[key]);
        });
    }
};
