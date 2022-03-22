export default {
    /**
     * Switches to the feature list of the selected layer.
     * @param {Object} param.state the state
     * @param {Object} param.commit the commit
     * @param {Object} param.dispatch the dispatch
     * @param {Object} layer selected layer.
     * @returns {void}
     */
    switchToList ({state, rootGetters, commit, dispatch}, layer) {
        commit("setLayer", layer);
        if (state.layer) {
            commit("setLayerId", layer.id);
            commit("setGfiFeaturesOfLayer", rootGetters["Map/visibleLayerList"]);
            commit("setFeatureCount", state.gfiFeaturesOfLayer.length);
            commit("setShownFeatures", state.gfiFeaturesOfLayer.length < state.maxFeatures ? state.gfiFeaturesOfLayer.length : state.maxFeatures);
            commit("setLayerListView", false);
            commit("setFeatureDetailView", false);
            commit("setFeatureListView", true);

            dispatch("addMouseEvents");
            dispatch("sortItems");
        }
    },
    /**
     * Click event that gets triggered when clicking on a feature in the list view.
     * @param {Object} param.state the state
     * @param {Object} param.commit the commit
     * @param {Object} param.dispatch the dispatch
     * @param {String} featureIndex index of the clicked Feature
     * @returns {void}
     */
    clickOnFeature ({state, commit, dispatch}, featureIndex) {
        if (featureIndex !== "" && featureIndex >= 0 && featureIndex <= state.shownFeatures) {
            const feature = state.gfiFeaturesOfLayer[featureIndex],
                featureGeometry = state.rawFeaturesOfLayer[featureIndex].getGeometry();

            commit("setSelectedFeature", feature);

            dispatch("switchToDetails");
            dispatch("Map/zoomTo", {
                geometryOrExtent: featureGeometry,
                options: {duration: 800, zoom: 9}
            }, {root: true});
        }
    },
    /**
     * Hover event that gets triggered when hovering over a feature in the list view.
     * @param {Object} param.state the state
     * @param {Object} param.dispatch the dispatch
     * @param {String} featureIndex index of the clicked Feature
     * @returns {void}
     */
    hoverOverFeature ({state, dispatch}, featureIndex) {
        if (featureIndex !== "" && featureIndex >= 0 && featureIndex <= state.shownFeatures) {
            const feature = state.nestedFeatures ? state.rawFeaturesOfLayer[featureIndex] : state.layer.features[featureIndex];

            dispatch("highlightFeature", feature.getId());
        }
    },
    /**
     * Adds the eventListeners to the table for clicking and hovering events.
     * @param {Object} param.dispatch the dispatch
     * @returns {void}
     */
    addMouseEvents ({dispatch}) {
        const featureLister = document.getElementById("featureLister");

        featureLister.addEventListener("click", (evt) => {
            if (evt.target.parentElement.id.includes("tool-feature-lister-feature-")) {
                dispatch("clickOnFeature", evt.target.parentElement.id.slice(-1));
            }
        });
        featureLister.addEventListener("mouseover", (evt) => {
            if (evt.target.parentElement.id.includes("tool-feature-lister-feature-")) {
                dispatch("hoverOverFeature", evt.target.parentElement.id.slice(-1));
            }
        });
    },
    /**
     * Highlights a feature depending on its geometryType.
     * @param {Object} param.state the state
     * @param {Object} param.dispatch the dispatch
     * @param {String} featureId id of the feature to be highlighted.
     * @returns {void}
     */
    highlightFeature ({state, rootGetters, dispatch}, featureId) {
        dispatch("Map/removeHighlightFeature", "decrease", {root: true});
        let featureGeometryType = "";
        const layer = rootGetters["Map/visibleLayerList"].find((l) => l.values_.id === state.layer.id),
            layerFeatures = state.nestedFeatures ? state.rawFeaturesOfLayer : layer.getSource().getFeatures(),
            featureWrapper = layerFeatures.find(feat => {
                featureGeometryType = feat.getGeometry().getType();
                return feat.getId().toString() === featureId;
            }),
            styleObj = state.layer.geometryType.toLowerCase().indexOf("polygon") > -1 ? state.highlightVectorRulesPolygon : state.highlightVectorRulesPointLine,
            highlightObject = {
                type: featureGeometryType === "Point" || featureGeometryType === "MultiPoint" ? "increase" : "highlightPolygon",
                id: featureId,
                layer: layer,
                feature: featureWrapper,
                scale: styleObj.image?.scale
            };

        layer.id = state.layer.id;

        if (highlightObject.type === "highlightPolygon") {
            highlightObject.highlightStyle = {
                fill: styleObj.fill,
                stroke: styleObj.stroke,
                image: styleObj.image
            };
        }
        dispatch("Map/highlightFeature", highlightObject, {root: true});
    },
    /**
     * Switches to the themes list of all visibile layers and resets the featureList and the selectedFeature.
     * @param {Object} param.commit the commit
     * @param {Object} param.dispatch the dispatch
     * @returns {void}
     */
    switchToThemes ({commit}) {
        commit("resetToThemeChooser");
    },
    /**
     * Switches to the details list of the selected feature.
     * @param {Object} param.state the state
     * @param {Object} param.commit the commit
     * @param {Object} param.dispatch the dispatch
     * @returns {void}
     */
    switchToDetails ({state, commit}) {
        if (state.selectedFeature) {
            commit("setLayerListView", false);
            commit("setFeatureListView", false);
            commit("setFeatureDetailView", true);
        }
    },
    /**
     * Expands the feature list to show more features.
     * @param {Object} param.state the state
     * @param {Object} param.commit the commit
     * @returns {void}
     */
    showMore ({state, commit}) {
        const numberOfFeaturesToShow = state.shownFeatures < state.featureCount - 10 ? state.shownFeatures + 10 : state.featureCount;

        commit("setShownFeatures", numberOfFeaturesToShow);
    },
    /**
     * Switches to the themes list of all visibile layers.
     * @returns {void}
     */
    async sortItems () {
        const tableHeaders = await document.getElementsByClassName("feature-lister-list-table-th");

        try {
            tableHeaders.forEach(th_elem => {
                let asc = true;
                const index = Array.from(th_elem.parentNode.children).indexOf(th_elem);

                th_elem.addEventListener("click", () => {
                    const arr = [...th_elem.closest("table").querySelectorAll("tbody tr")].slice(1);

                    arr.sort((a, b) => {
                        let a_val = "",
                            b_val = "";

                        if (a.children[index] !== undefined && b.children[index] !== undefined) {
                            a_val = a.children[index].innerText;
                            b_val = b.children[index].innerText;
                        }
                        return asc ? a_val.localeCompare(b_val) : b_val.localeCompare(a_val);
                    });
                    arr.forEach(elem => {
                        th_elem.closest("table").querySelector("tbody").appendChild(elem);
                    });
                    asc = !asc;
                });
            });
        }
        catch (error) {
            console.error(error);
        }
    }
};

