import BuildSpec from "../js/buildSpec";

export default {
    /**
     * starts the printing process
     * @param {Object} param.state the state
     * @param {Object} param.dispatch the dispatch
     * @param {Object} param.commit the commit
     * @param {Object} print the print parameters.
     * @param {Function} print.getResponse The function that calls the axios request.
     * @param {Number} print.index The print index.
     * @returns {void}
     */
    startPrint: async function ({state}, print) {
        // commit("setProgressWidth", "width: 25%");
        // getVisibleLayer(state.printMapMarker);

        // const visibleLayerList = state.visibleLayerList,
        //     attr = {
        //         "layout": state.currentLayoutName,
        //         "outputFilename": state.filename,
        //         "outputFormat": state.currentFormat,
        //         "attributes": {
        //             "title": state.title,
        //             "map": {
        //                 "dpi": state.dpiForPdf,
        //                 "projection": mapCollection.getMapView("2D").getProjection().getCode(),
        //                 "center": mapCollection.getMapView("2D").getCenter(),
        //                 "scale": state.currentScale
        //             }
        //         }
        //     };

        const spec = BuildSpec;

        // spec.setAttributes(attr);

        // if (state.isMetadataAvailable) {
        //     spec.setMetadata(true);
        // }

        // if (state.isScaleAvailable) {
        //     spec.buildScale(state.currentScale);
        // }
        // await spec.buildLayers(visibleLayerList);

        // if (state.isGfiAvailable) {
        //     dispatch("getGfiForPrint");
        //     spec.buildGfi(state.isGfiSelected, state.gfiForPrint);
        // }

        if (state.isLegendAvailable) {
            spec.buildLegend(state.isLegendSelected, state.isMetadataAvailable, print.getResponse, print.index);
        }
        // else {
        //     spec.setLegend({});
        //     spec.setShowLegend(false);
        //     spec = omit(spec, ["uniqueIdList"]);
        //     const printJob = {
        //         index: print.index,
        //         payload: encodeURIComponent(JSON.stringify(spec.defaults)),
        //         printAppId: state.printAppId,
        //         currentFormat: state.currentFormat,
        //         getResponse: print.getResponse
        //     };

        //     dispatch("createPrintJob", printJob);
        // }
    },

    /**
     * Gets the Gfi Information
     * @param {Object} param.rootGetters the rootgetters
     * @param {Object} param.commit the commit
     * @returns {void}
     */
    getGfiForPrint: async function ({rootGetters, commit}) {
        if (rootGetters["Tools/Gfi/currentFeature"] !== null && typeof rootGetters["Tools/Gfi/currentFeature"].getMappedProperties === "function" && typeof rootGetters["Tools/Gfi/currentFeature"].getTitle === "function") {
            commit("setGfiForPrint", [rootGetters["Tools/Gfi/currentFeature"].getMappedProperties(), rootGetters["Tools/Gfi/currentFeature"].getTitle(), rootGetters["Maps/clickCoordinate"]]);
        }
        else {
            // commit("setGfiForPrint", []);
        }
    }
};
