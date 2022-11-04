export default {
    /**
     * Sets center and resolution to initial values.
     * @param {Object} param store context
     * @param {Object} param.state the state
     * @param {Object} param.dispatch the dispatch
     * @returns {void}
     */
    resetView ({state, dispatch}) {
        // const view = getters.getView;

        if (state.mode === "3D") {
            dispatch("setZoomLevel", state.changeZoomLevel["3D"]);
            dispatch("setCenter", state.initialCenter);
        }
        else {
            // view.setCenter(state.initialCenter);
            // view.setResolution(state.initialResolution);
        }
        dispatch("MapMarker/removePointMarker", null, {root: true});
    },
    /**
     * Sets the Background for the Mapview.
     * @param {Object} param store context
     * @param {Object} param.getters the getters
     * @param  {string} value Image Url
     * @returns {void}
     */
    setBackground ({getters}, value) {
        const view = getters.getView;

        view.background = value;
    },
    /**
     * Sets the center of the current view.
     * @param {Object} param store context
     * @param {Object} param.getters the getters
     * @param {Object} param.commit the commit
     * @param {number[]} coords An array of numbers representing a xy-coordinate
     * @returns {void}
     */
    setCenter ({commit, getters}, coords) {
        let first2Coords = [coords[0], coords[1]];

        if (first2Coords.some(coord => typeof coord !== "number")) {
            console.warn("Given coordinates must be of type integer! Although it might not break, something went wrong and needs to be checked!");
            first2Coords = first2Coords.map(singleCoord => parseInt(singleCoord, 10));
        }
        if (Array.isArray(first2Coords) && first2Coords.length === 2) {
            commit("setCenter", coords);
            getters.getView.setCenter(coords);
        }
        else {
            console.warn("Center was not set. Probably there is a data type error. The format of the coordinate must be an array with two numbers.");
        }
    },

    /**
     * toggles the maps background
     * @param {Object} param store context
     * @param {Object} param.state the state
     * @param {Object} param.dispatch the dispatch
     * @param {Object} param.getters the getters
     * @returns {void}
     */
    toggleBackground ({state, dispatch, getters}) {
        const view = getters.getView;

        if (view.background === "white") {
            dispatch("setBackground", state.backgroundImage);
            document.getElementById("map").style.background = `url(${state.backgroundImage}) repeat scroll 0 0 rgba(0, 0, 0, 0)`;
        }
        else {
            dispatch("setBackground", "white");
            document.getElementById("map").style.background = "white";
        }
    }
};
