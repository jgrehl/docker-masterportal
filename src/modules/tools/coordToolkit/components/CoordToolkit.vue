<script>
import ToolTemplate from "../../ToolTemplate.vue";
import {getComponent} from "../../../../utils/getComponent";
import {Pointer} from "ol/interaction.js";
import crs from "@masterportal/masterportalapi/src/crs";
import {mapGetters, mapActions, mapMutations} from "vuex";
import getters from "../store/gettersCoordToolkit";
import mutations from "../store/mutationsCoordToolkit";

export default {
    name: "CoordToolkit",
    components: {
        ToolTemplate
    },
    data () {
        return {
            eventHandler: null
        };
    },
    computed: {
        ...mapGetters("Tools/CoordToolkit", Object.keys(getters)),
        ...mapGetters("Maps", {
            projection: "projection",
            clickCoordinate: "clickCoordinate",
            mapMode: "mode"
        }),
        ...mapGetters(["namedProjections", "uiStyle", "mobile"]),
        eastingNoCoordMessage: function () {
            if (this.currentProjection.projName !== "longlat") {
                return this.$t("common:modules.tools.coordToolkit.errorMsg.noCoord", {valueKey: this.$t(this.getLabel("eastingLabel"))});
            }
            return this.$t("common:modules.tools.coordToolkit.errorMsg.hdmsNoCoord", {valueKey: this.$t(this.getLabel("eastingLabel"))});
        },
        northingNoCoordMessage: function () {
            if (this.currentProjection.projName !== "longlat") {
                return this.$t("common:modules.tools.coordToolkit.errorMsg.noCoord", {valueKey: this.$t(this.getLabel("northingLabel"))});
            }
            return this.$t("common:modules.tools.coordToolkit.errorMsg.hdmsNoCoord", {valueKey: this.$t(this.getLabel("northingLabel"))});
        },
        northingNoMatchMessage: function () {
            if (this.currentProjection.projName !== "longlat") {
                return this.$t("common:modules.tools.coordToolkit.errorMsg.noMatch", {valueKey: this.$t(this.getLabel("northingLabel"))});
            }
            return this.$t("common:modules.tools.coordToolkit.errorMsg.hdmsNoMatch", {valueKey: this.$t(this.getLabel("northingLabel"))});
        },
        eastingNoMatchMessage: function () {
            if (this.currentProjection.projName !== "longlat") {
                return this.$t("common:modules.tools.coordToolkit.errorMsg.noMatch", {valueKey: this.$t(this.getLabel("eastingLabel"))});
            }
            return this.$t("common:modules.tools.coordToolkit.errorMsg.hdmsNoMatch", {valueKey: this.$t(this.getLabel("eastingLabel"))});
        }
    },
    watch: {
        /**
         * If true, mode is set to "supply", projections are initialized.
         * If false, error messages and values are resetted.
         * @param {Boolean} value Value deciding whether the tool gets activated or deactivated.
         * @returns {void}
         */
        active (value) {
            this.removeMarker();

            if (value) {
                this.initProjections();
                this.setExample();
                this.setMode("supply");
                this.setSupplyCoordActive();
                this.setFocusToFirstControl();
            }
            else {
                this.resetErrorMessages("all");
                this.resetValues();
                this.setSupplyCoordInactive();
                this.removeInputActions();
            }
        },
        /**
         * Allows switching between 2D and 3D when the tool is open.
         * @returns {void}
         */
        mapMode () {
            if (this.active) {
                this.setSupplyCoordInactive();
                this.removeInputActions();
                this.setSupplyCoordActive();
            }
        },
        /**
         * Watches for changes of clicked coordinates.
         * @returns {void}
         */
        clickCoordinate () {
            if (this.active && this.mode !== "search") {
                this.positionClicked();
            }
        }
    },
    created () {
        this.$on("close", this.close);
    },
    mounted () {
        /**
         * Do this in next tick, only then heightLayerId is in state
         */
        this.$nextTick(() => {
            if (this.heightLayerId !== null) {
                this.initHeightLayer();
            }
        });
    },
    methods: {
        ...mapMutations("Tools/CoordToolkit", Object.keys(mutations)),
        ...mapActions("Tools/CoordToolkit", [
            "checkPosition",
            "changedPosition",
            "setFirstSearchPosition",
            "positionClicked",
            "removeMarker",
            "searchCoordinate",
            "validateInput",
            "newProjectionSelected",
            "initHeightLayer",
            "copyCoordinates"
        ]),
        ...mapActions("Alerting", ["addSingleAlert"]),
        ...mapActions("Maps", {
            addInteractionToMap: "addInteraction",
            removeInteractionFromMap: "removeInteraction"
        }),
        /**
         * Sets the focus to the first control
         * @returns {void}
         */
        setFocusToFirstControl () {
            this.$nextTick(() => {
                if (this.$refs.coordSystemField) {
                    this.$refs.coordSystemField.focus();
                }
            });
        },
        /**
         * Initializes the projections to select. If projection EPSG:4326 is available same is added in decimal-degree.
         * @returns {void}
         */
        initProjections () {
            const pr = crs.getProjections(),
                epsg8395 = [],
                wgs84Proj = [];

            if (this.projections.length) {
                return;
            }
            // id is set to the name and in case of decimal "-DG" is appended to name later on
            // for use in select-box
            pr.forEach(proj => {
                proj.id = proj.name;
                if (proj.name === "EPSG:4326" || proj.name === "http://www.opengis.net/gml/srs/epsg.xml#4326") {
                    wgs84Proj.push(proj);
                }
                if (proj.name === "EPSG:8395" || proj.name === "http://www.opengis.net/gml/srs/epsg.xml#8395") {
                    epsg8395.push(proj);
                }

                if (proj.name.indexOf("#") > -1) { // e.g. "http://www.opengis.net/gml/srs/epsg.xml#25832"
                    const code = proj.name.substring(proj.name.indexOf("#") + 1, proj.name.length);

                    proj.epsg = "EPSG:" + code;
                }
                else {
                    proj.title = proj.name;
                }
                if (proj.id === this.currentProjection.id) {
                    this.setCurrentProjection(proj);
                }
            });
            if (wgs84Proj.length > 0) {
                this.addWGS84Decimal(pr, wgs84Proj);
            }
            this.namedProjections.find((el) => {
                if (el[1].includes("ETRS89_3GK3") && epsg8395.length > 0) {
                    this.addETRS893GK3(pr, el, epsg8395);
                    return true;
                }
                return false;
            });
            this.setProjections(pr);
        },
        /**
         * Adds EPSG:4326 in decimal-degree to list of projections.
         * @param {Array} projections list of all available projections
         * @param {Object} elementETRS89_3GK3 the WGS84 projection contained in list of projections
         * @param {Object} epsg8395 the WGS84 projection contained in list of projections
         * @returns {void}
         */
        addETRS893GK3 (projections, elementETRS89_3GK3, epsg8395) {
            const index = projections.findIndex(proj => proj.name === "EPSG:8395"),
                etrs89_3GK3Proj = {};

            for (const key in epsg8395[0]) {
                etrs89_3GK3Proj[key] = epsg8395[0][key];
            }

            etrs89_3GK3Proj.name = "ETRS893GK3";
            etrs89_3GK3Proj.epsg = "EPSG:8395";
            etrs89_3GK3Proj.id = "http://www.opengis.net/gml/srs/epsg.xml#ETRS893GK3";
            etrs89_3GK3Proj.title = elementETRS89_3GK3[1].substring(elementETRS89_3GK3[1].lastIndexOf("ETRS"), elementETRS89_3GK3[1].indexOf(" +proj="));
            etrs89_3GK3Proj.getCode = () => "noEPSGCode";
            projections.splice(index + 1, 0, etrs89_3GK3Proj);
        },
        /**
         * Adds EPSG:4326 in decimal-degree to list of projections.
         * @param {Array} projections list of all available projections
         * @param {Object} wgs84Proj the WGS84 projection contained in list of projections
         * @returns {void}
         */
        addWGS84Decimal (projections, wgs84Proj) {
            const index = projections.findIndex(proj => proj.name === "EPSG:4326"),
                wgs84ProjDez = {};

            for (const key in wgs84Proj[0]) {
                wgs84ProjDez[key] = wgs84Proj[0][key];
            }

            wgs84ProjDez.name = "EPSG:4326-DG";
            wgs84ProjDez.epsg = "EPSG:4326";
            wgs84ProjDez.id = "http://www.opengis.net/gml/srs/epsg.xml#4326-DG";
            wgs84ProjDez.title = "WGS84_Lat-Lon (Grad, Dezimal), EPSG 4326";
            wgs84ProjDez.getCode = () => "EPSG:4326-DG";
            projections.splice(index + 1, 0, wgs84ProjDez);
        },
        /**
         * Removes pointer-move-handler and interaction from map.
         * @returns {void}
         */
        setSupplyCoordInactive () {
            if (this.selectPointerMove !== null) {
                this.setUpdatePosition(true);
                this.removeInteractionFromMap(this.selectPointerMove);
                this.setSelectPointerMove(null);
            }
            if (this.mapMode === "3D" && this.eventHandler && typeof this.eventHandler.removeInputAction === "function") {
                this.eventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
            }
        },
        /**
         * Adds pointer-move-handler and interaction to map.
         * @returns {void}
         */
        setSupplyCoordActive () {
            if (this.selectPointerMove === null) {
                this.setMapProjection(this.projection);
                this.createInteraction();
                this.setPositionMapProjection(this.clickCoordinate);
                this.changedPosition();
            }
        },
        /**
         * Called if selection of projection changed. Sets the current projection to state and changes the position.
         * @param {Event} event changed selection event
         * @returns {void}
         */
        selectionChanged (event) {
            if (event.target.value) {
                this.newProjectionSelected(event.target.value);
                if (this.mode === "search") {
                    this.validateInput(this.coordinatesEasting);
                    this.validateInput(this.coordinatesNorthing);
                }
            }
        },
        /**
         * Adds interaction pointermove to map.
         * @returns {void}
         */
        createInteraction () {
            if (this.mapMode === "2D") {
                const pointerMove = new Pointer(
                    {
                        handleMoveEvent: function () {
                            this.checkPosition();
                        }.bind(this)
                    },
                    this
                );

                this.setSelectPointerMove(pointerMove);
                this.addInteractionToMap(pointerMove);
            }
            else if (this.mapMode === "3D") {
                this.eventHandler = new Cesium.ScreenSpaceEventHandler(mapCollection.getMap("3D").getCesiumScene().canvas);
                this.eventHandler.setInputAction(this.positionClicked, Cesium.ScreenSpaceEventType.LEFT_CLICK);
            }
        },
        removeInputActions () {
            if (this.eventHandler) {
                this.eventHandler.destroy();
            }
        },
        /**
         * Closes this tool window by setting active to false
         * @returns {void}
         */
        close () {
            this.setActive(false);

            // TODO replace trigger when Menu is migrated
            // set the backbone model to active false for changing css class in menu (menu/desktop/tool/view.toggleIsActiveClass)
            // else the menu-entry for this tool is always highlighted
            const model = getComponent(this.$store.state.Tools.CoordToolkit.id);

            if (model) {
                model.set("isActive", false);
            }
        },
        /**
         * Returns true, if given checkboxId is equals curent mode in state.
         * @param {String} checkboxId "supply" or "search"
         * @returns {Boolean} true, if given checkboxId is equals curent mode in state
         */
        isEnabled (checkboxId) {
            return this.mode === checkboxId;
        },
        /**
         * Toggles the mode "supply" or "search".
         * @param {String} newMode "supply" or "search"
         * @returns {void}
         */
        changeMode (newMode) {
            this.removeMarker();
            if (newMode === "search") {
                this.setMode(newMode);
                this.setSupplyCoordInactive();
                this.setFirstSearchPosition();
            }
            else {
                this.setMode(newMode);
                this.resetErrorMessages("all");
                this.setSupplyCoordActive();
            }
        },
        /**
         * If curent mode is "search" input is validated.
         * @param {Object} coordinatesValue value of input
         * @returns {void}
         */
        onInputEvent (coordinatesValue) {
            if (this.mode === "search") {
                this.validateInput(coordinatesValue);
            }
        },
        /**
         * Returns the className for the easting input field. Special Handling because fields positions are transformed.
         * @returns {String} the className for the easting input field
         */
        getClassForEasting () {
            const eastingError = this.eastingNoCoord || this.eastingNoMatch,
                northingError = this.northingNoCoord || this.northingNoMatch;
            let clazz = "";

            if (this.currentProjection.projName === "longlat") {
                if (!northingError && !eastingError) {
                    clazz = "eastingToBottomNoError";
                }
                else if (eastingError && !northingError) {
                    clazz = "eastingToBottomNoError";
                }
                else if (!eastingError && northingError) {
                    clazz = "eastingToBottomOneError";
                }
                else {
                    clazz = "eastingToBottomTwoErrors";
                }
            }
            return clazz + " form-group form-group-sm row";
        },
        /**
         * Returns the className for the northing input field. Special Handling because fields positions are transformed.
         * @returns {String} the className for the northing input field
         */
        getClassForNorthing () {
            const eastingError = this.eastingNoCoord || this.eastingNoMatch,
                northingError = this.northingNoCoord || this.northingNoMatch;
            let clazz = "";

            if (this.currentProjection.projName === "longlat") {

                if (!northingError && !eastingError) {
                    clazz = "northingToTopNoError";
                }
                else if (!northingError && eastingError) {
                    clazz = "northingToTopEastingError";
                }
                else if (northingError && !eastingError) {
                    clazz = "northingToTopNoError";
                }
                else if (this.eastingNoCoord) {
                    clazz = "northingToTopTwoErrorsEastNoValue";
                }
                else {
                    clazz = "northingToTopTwoErrors";
                }
            }
            return clazz + " form-group form-group-sm row";
        },
        /**
         * Returns the className for the labels.
         * @returns {String} the className for the labels
         */
        getLabelClass () {
            return this.showCopyButtons ? "col-md-4 col-sm-4 col-form-label" : "col-md-5 col-sm-5 col-form-label";
        },
        /**
         * Returns the className for the input elements.
         * @returns {String} the className for the input elements
         */
        getInputDivClass () {
            return this.showCopyButtons ? "col-md-6 col-sm-6" : "col-md-7 col-sm-7";
        },
        /**
         * Returns true, if uiStyle is not SIMPLE or TABLE.
         * @returns {boolean} true, if is default style
         */
        isDefaultStyle () {
            return this.uiStyle !== "SIMPLE" && this.uiStyle !== "TABLE";
        },
        /**
         * Returns true, if heightLayerInfo is configured.
         * @returns {boolean} true, if is configured
         */
        isHeightLayerInfo () {
            return typeof this.heightLayerInfo === "string";
        },
        /**
         * Returns true, if coordInfo is configured.
         * @returns {boolean} true, if is configured
         */
        isCoordInfo () {
            return this.coordInfo !== null;
        },
        /**
         * Copies the values of the coordinate fields.
         * @param {Array} ids of the input-fields to get the coordinate values from
         * @returns {void}
         */
        copyCoords (ids) {
            let values = [];

            ids.forEach(id => {
                const el = this.$refs[id];

                if (el) {
                    values.push(el.value);
                }
            });
            if (this.currentProjection.projName === "longlat") {
                // reverted, because longlat-fields are swapped
                values = values.reverse();
            }
            this.copyCoordinates(values);
        }
    }
};
</script>

<template lang="html">
    <ToolTemplate
        :title="$t(name)"
        :icon="icon"
        :active="active"
        :render-to-window="renderToWindow"
        :resizable-window="resizableWindow"
        :deactivate-gfi="deactivateGFI"
    >
        <template #toolBody>
            <div
                v-if="active"
                id="coord-toolkit"
            >
                <form
                    class="form-horizontal"
                    role="form"
                >
                    <div class="radio-container form-group form-group-sm">
                        <div class="form-check">
                            <input
                                id="supplyCoordRadio"
                                type="radio"
                                name="mode"
                                class="form-check-input"
                                :checked="true"
                                @click="changeMode('supply')"
                            >
                            <label
                                for="supplyCoordRadio"
                                :class="{ 'form-check-label': true, 'enabled': isEnabled('supply') }"
                                role="button"
                                tabindex="0"
                                @click="changeMode('supply')"
                                @keydown.enter="changeMode('supply')"
                            >{{ $t("modules.tools.coordToolkit.supply") }}</label>
                        </div>
                        <div class="form-check">
                            <input
                                id="searchByCoordRadio"
                                type="radio"
                                name="mode"
                                class="form-check-input"
                                @click="changeMode('search')"
                            >
                            <label
                                for="searchByCoordRadio"
                                :class="{'form-check-label': true, 'enabled': isEnabled('search') }"
                                role="button"
                                tabindex="0"
                                @click="changeMode('search')"
                                @keydown.enter="changeMode('search')"
                            >{{ $t("modules.tools.coordToolkit.search") }}</label>
                        </div>
                    </div>
                    <div
                        v-if="mode === 'supply'"
                        class="hint col-md-12"
                    >
                        {{ $t("modules.tools.coordToolkit.hintSupply") }}
                    </div>
                    <div
                        v-if="mode === 'search'"
                        class="hint col-md-12"
                    >
                        {{ $t("modules.tools.coordToolkit.hintSearch") }}
                    </div>
                    <hr>
                    <p class="bold">
                        {{ $t("modules.tools.coordToolkit.postionCoordinates") }}
                    </p>
                    <div class="form-group form-group-sm row">
                        <label
                            for="coordSystemField"
                            :class="getLabelClass()"
                        >{{ $t("modules.tools.coordToolkit.coordSystemField") }}</label>
                        <div :class="getInputDivClass()">
                            <select
                                id="coordSystemField"
                                ref="coordSystemField"
                                class="font-arial form-select form-select-sm float-start"
                                @change="selectionChanged($event)"
                            >
                                <option
                                    v-for="(projection, i) in projections"
                                    :key="i"
                                    :value="projection.id"
                                    :SELECTED="projection.id === currentProjection.id"
                                >
                                    {{ projection.title ? projection.title : projection.name }}
                                </option>
                            </select>
                        </div>
                    </div>
                    <div
                        :class="getClassForEasting()"
                    >
                        <label
                            id="coordinatesEastingLabel"
                            for="coordinatesEastingField"
                            :class="getLabelClass()"
                        >{{ $t(getLabel("eastingLabel")) }}</label>
                        <div :class="getInputDivClass()">
                            <input
                                id="coordinatesEastingField"
                                ref="coordinatesEastingField"
                                v-model="coordinatesEasting.value"
                                type="text"
                                :readonly="isEnabled('supply')"
                                :class="{ inputError: getEastingError, 'form-control': true}"
                                :placeholder="isEnabled('search') ? $t('modules.tools.coordToolkit.exampleAcronym') + coordinatesEastingExample : ''"
                                @input="onInputEvent(coordinatesEasting)"
                            ><p
                                v-if="eastingNoCoord"
                                class="error-text"
                            >
                                {{ eastingNoCoordMessage }}
                            </p>
                            <p
                                v-if="eastingNoMatch"
                                class="error-text"
                            >
                                {{ eastingNoMatchMessage }}
                                <br>
                                {{ $t("modules.tools.coordToolkit.errorMsg.example") + coordinatesEastingExample }}
                            </p>
                        </div>
                        <div
                            v-if="isEnabled('supply') && !mobile && showCopyButtons"
                            class="col-md-1 col-sm-1 copyBtn"
                        >
                            <button
                                id="copyEastingBtn"
                                type="button"
                                class="btn btn-outline-default"
                                :title="$t(`common:modules.tools.coordToolkit.copyCoordBtn`, {value: $t(getLabel('eastingLabel'))})"
                                @click="copyCoords(['coordinatesEastingField'])"
                            >
                                <span
                                    class="bootstrap-icon"
                                    aria-hidden="true"
                                >
                                    <i class="bi-files" />
                                </span>
                            </button>
                        </div>
                        <div
                            v-if="isEnabled('supply') && !mobile && showCopyButtons"
                            class="col-md-1 col-sm-1 copyBtn copyPairBtn"
                        >
                            <button
                                id="copyCoordsPairBtn"
                                type="button"
                                class="btn btn-outline-default"
                                :title="$t(`common:modules.tools.coordToolkit.copyCoordsBtn`)"
                                @click="copyCoords(['coordinatesEastingField', 'coordinatesNorthingField'])"
                            >
                                <span
                                    class="bootstrap-icon"
                                    aria-hidden="true"
                                >
                                    <i class="bi-files" />
                                </span>
                            </button>
                        </div>
                    </div>
                    <div
                        :class="getClassForNorthing()"
                    >
                        <label
                            id="coordinatesNorthingLabel"
                            for="coordinatesNorthingField"
                            :class="getLabelClass()"
                        >{{ $t(getLabel("northingLabel")) }}</label>
                        <div :class="getInputDivClass()">
                            <input
                                id="coordinatesNorthingField"
                                ref="coordinatesNorthingField"
                                v-model="coordinatesNorthing.value"
                                type="text"
                                :class="{ inputError: getNorthingError , 'form-control': true}"
                                :readonly="isEnabled('supply')"
                                :placeholder="isEnabled('search') ? $t('modules.tools.coordToolkit.exampleAcronym') + coordinatesNorthingExample : ''"
                                @input="onInputEvent(coordinatesNorthing)"
                            ><p
                                v-if="northingNoCoord"
                                class="error-text"
                            >
                                {{ northingNoCoordMessage }}
                            </p>
                            <p
                                v-if="northingNoMatch"
                                class="error-text"
                            >
                                {{ northingNoMatchMessage }}
                                <br>
                                {{ $t("modules.tools.coordToolkit.errorMsg.example") + coordinatesNorthingExample }}
                            </p>
                        </div>
                        <div
                            v-if="isEnabled('supply') && !mobile && showCopyButtons"
                            class="col-md-1 col-sm-1 copyBtn"
                        >
                            <button
                                id="copyNorthingBtn"
                                type="button"
                                class="btn btn-outline-default"
                                :title="$t(`common:modules.tools.coordToolkit.copyCoordBtn`, {value: $t(getLabel('northingLabel'))})"
                                @click="copyCoords(['coordinatesNorthingField'])"
                            >
                                <span
                                    class="bootstrap-icon"
                                    aria-hidden="true"
                                >
                                    <i class="bi-files" />
                                </span>
                            </button>
                        </div>
                    </div>
                    <div
                        v-if="isCoordInfo()"
                        class="coordInfo"
                    >
                        {{ coordInfo?.title }}
                        <li
                            v-for="explanation in coordInfo?.explanations"
                            :key="explanation"
                        >
                            {{ explanation }}
                        </li>
                        <br>
                    </div>
                    <div
                        v-if="isEnabled('supply') && (heightLayer !== null || mapMode === '3D')"
                        class="form-group form-group-sm inputDiv row"
                    >
                        <hr>
                        <p class="bold">
                            {{ $t("modules.tools.coordToolkit.heightLabel") }}
                        </p>
                        <br>
                        <label
                            id="coordinatesHeightLabel"
                            for="coordinatesHeightField"
                            :class="getLabelClass()"
                        >{{ $t("modules.tools.coordToolkit.heightLabel") }}</label>
                        <div :class="getInputDivClass()">
                            <input
                                id="coordinatesHeightField"
                                :value="$t(height)"
                                type="text"
                                class="form-control"
                                :readonly="true"
                            >
                        </div>
                    </div>
                    <div
                        v-if="isDefaultStyle()"
                        class="form-group form-group-sm row"
                    >
                        <div class="col-md-12 info">
                            <span v-if="isEnabled('supply') && (heightLayer !== null || mapMode === '3D') && isHeightLayerInfo()">
                                {{ heightLayerInfo }}
                                <br>
                            </span>
                            <hr>
                            {{ $t("modules.tools.measure.influenceFactors") }}
                        </div>
                    </div>
                    <div
                        v-if="isEnabled('search')"
                        class="form-group form-group-sm row"
                    >
                        <div class="col-12 d-grid gap-2">
                            <button
                                id="searchByCoordBtn"
                                class="btn btn-primary"
                                :disabled="getEastingError || getNorthingError || !coordinatesEasting.value || !coordinatesNorthing.value"
                                type="button"
                                @click="searchCoordinate(coordinatesEasting, coordinatesNorthing)"
                            >
                                {{ $t("common:modules.tools.coordToolkit.searchBtn") }}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </template>
    </ToolTemplate>
</template>

<style lang="scss" scoped>
@import "~variables";

    @include media-breakpoint-down(md) {
        .checkbox-container .form-inline {
            font-size: $font-size-base;
        }
    }
    .radio-container{
        display: flex;
        justify-content: space-around;
        label{
            margin-left: 5px;
        }
        input{
            margin-left: 10px;
        }
    }
    .enabled {
        font-weight: bold;
    }
    .error-text {
        font-size: 85%;
        color: $light_red;
    }
    .hint{
        margin: 5px 0 25px;
        text-align:center;
        color: $secondary_focus;
        transition: color 0.35s;
    }
    .info{
        max-width: 550px;
    }
    .eastingToBottomNoError .copyPairBtn{
        transform: translate(0px, -50px)
    }
    .eastingToBottomNoError{
        transform: translate(0px, 50px)
    }
    .northingToTopNoError{
        transform: translate(0px, -50px)
    }
    .northingToTopEastingError{
        transform: translate(0px, -95px)
    }
    .eastingToBottomOneError{
        transform: translate(0px, 85px)
    }
    .eastingToBottomTwoErrors{
       transform: translate(0px, 85px);
    }
    .northingToTopTwoErrors{
        transform: translate(0px, -95px)
    }
    .northingToTopTwoErrorsEastNoValue{
        transform: translate(0px, -75px)
    }
    #copyCoordsPairBtn{
        height: 91px;
        position: absolute;
    }
    .copyBtn{
        padding-right: 0;
        padding-left: 0;
        max-width: 50px;
    }
    @include media-breakpoint-down(md) {
        .eastingToBottomNoError{
            transform: translate(0px, 70px)
        }
        .northingToTopNoError{
            transform: translate(0px, -70px)
        }
    }
    .form-control[readonly] {
        background-color: $light-grey;
    }
    .coordInfo{
        max-width: 35vw;
    }
</style>

