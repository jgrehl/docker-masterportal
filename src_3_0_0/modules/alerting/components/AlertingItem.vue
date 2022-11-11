<script>

import axios from "axios";
import {mapActions, mapGetters, mapMutations} from "vuex";

export default {
    name: "AlertingItem",

    data () {
        return {
            availableLocalStorage: false
        };
    },
    computed: {
        ...mapGetters("Alerting", [
            "displayedAlerts",
            "fetchBroadcastUrl",
            "localStorageDisplayedAlertsKey",
            "initialClosed",
            "showTheModal",
            "alerts",
            "sortedAlerts"
        ]),
        /**
         * Reads current URL and returns it without hash and without get params, always ending with slash.
         * This is needed to have a normalized URL to compare with configured BroadcastConfig URLs;
         * see example file /portal/master/resources/broadcastedPortalAlerts.json
         * @returns {String} The normalized current browser URL
         */
        currentUrl: () => {
            return document.URL.replace(/#.*$/, "").replace(/\/*\?.*$/, "/").replace(/\bwww.\b/, "");
        },
        /**
         * Console mapping to be able to debug in template.
         * @returns {void}
         */
        console: () => console
    },
    watch: {
        /**
         * Syncs localstorage with displayedAlerts prop.
         * @param {Object} newDisplayedAlerts newly changed displayedAlerts object
         * @returns {void}
         */
        displayedAlerts (newDisplayedAlerts) {
            if (this.availableLocalStorage) {
                // Local storage is synced with this.displayedAlert
                localStorage[this.localStorageDisplayedAlertsKey] = JSON.stringify(newDisplayedAlerts);
            }
        }
    },
    /**
     * Created hook: Creates event listener for legacy Radio calls (to be removed seometime).
     * Checks if localstorage is available.
     * @returns {void}
     */
    created () {
        try {
            if (localStorage) {
                this.availableLocalStorage = true;
            }
        }
        catch {
            this.availableLocalStorage = false;
            console.error("Spelling localestorage is not available in this application. Please allow third party cookies in your browser!");
        }
    },
    /**
     * Mounted hook: Initially sets up localstorage and then fetches BroadcastConfig.
     * @returns {void}
     */
    mounted () {
        let initialDisplayedAlerts;

        this.initialize();
        if (this.availableLocalStorage && localStorage[this.localStorageDisplayedAlertsKey] !== undefined) {
            try {
                initialDisplayedAlerts = JSON.parse(localStorage[this.localStorageDisplayedAlertsKey]);

                this.setDisplayedAlerts(initialDisplayedAlerts);
            }
            catch (e) {
                localStorage[this.localStorageDisplayedAlertsKey] = JSON.stringify({});
            }
        }
        else {
            this.setDisplayedAlerts({});
        }

        if (this.fetchBroadcastUrl !== undefined && this.fetchBroadcastUrl !== false) {
            this.fetchBroadcast(this.fetchBroadcastUrl);
        }
    },

    methods: {
        ...mapActions("Alerting", [
            "addSingleAlert",
            "alertHasBeenRead",
            "cleanup",
            "initialize",
            "setDisplayedAlerts"
        ]),
        ...mapMutations("Alerting", [
            "removeFromAlerts"
        ]),

        /**
         * Do this after successfully fetching broadcastConfig:
         * Process configured data and add each resulting alert into the state.
         * @param {Object} response received response object
         * @returns {void}
         */
        axiosCallback: function (response) {
            const data = response.data,
                collectedAlerts = [];

            let collectedAlertIds = [];

            if (data.alerts === undefined || typeof data.alerts !== "object") {
                return;
            }

            if (Array.isArray(data.globalAlerts)) {
                collectedAlertIds = [...collectedAlertIds, ...data.globalAlerts];
            }

            if (data.restrictedAlerts !== undefined && typeof data.restrictedAlerts === "object") {
                Object.keys(data.restrictedAlerts).forEach(restrictedAlertUrl => {
                    if (this.currentUrl.toLowerCase().startsWith(restrictedAlertUrl.toLowerCase()) && Array.isArray(data.restrictedAlerts[restrictedAlertUrl])) {
                        collectedAlertIds = [...collectedAlertIds, ...data.restrictedAlerts[restrictedAlertUrl]];
                    }
                });
            }

            for (const alertId in data.alerts) {
                if (collectedAlertIds.includes(alertId)) {
                    collectedAlerts.push(data.alerts[alertId]);
                }
            }

            collectedAlerts.forEach(singleAlert => {
                singleAlert.initial = true;
                singleAlert.initialConfirmed = singleAlert.mustBeConfirmed;
                this.addSingleAlert(singleAlert);
            });
        },

        /**
         * Just a wrapper method for the XHR request for the sake of testing.
         * @param {String} fetchBroadcastUrl fetchBroadcastUrl
         * @returns {void}
         */
        fetchBroadcast: function (fetchBroadcastUrl) {
            axios.get(fetchBroadcastUrl).then(this.axiosCallback).catch(function (error) {
                console.warn(error);
            });
        },
        /**
         * Toggles the modal
         * @param {Boolean} value value for showTheModal
         * @returns {void}
         */
        toggleModal: function (value) {
            this.$store.commit("Alerting/setShowTheModal", value);
        },
        /**
         * When closing the modal, update all alerts' have-been-read states.
         * @returns {void}
         */
        onModalClose: function () {
            this.cleanup();
            this.$store.commit("Alerting/setInitialClosed", true);
        },
        /**
         * Update a single alert's has-been-read state.
         * @param {string} hash hash
         * @returns {void}
         */
        markAsRead: function (hash) {
            this.alertHasBeenRead(hash);
        },
        /**
         * Remove an alert from the alert modal
         * @param {string} hash hash
         * @returns {void}
         */
        removeAlert: function (hash) {
            this.removeFromAlerts({hash: hash});
        },
        /**
         * Check category name to distiguish between news and alert categories
         * @param {String} category category name
         * @returns {void}
         */
        checkCategory: function (category) {
            const checkCategory = category.toLowerCase();

            if (checkCategory !== "error" && checkCategory !== "warning" && checkCategory !== "success") {
                return true;
            }
            return false;
        },
        /**
         * Select the class for the alert category.
         * @param {String} category category of the alert
         * @returns {void}
         */
        selectCategoryClass: function (category) {
            const generalizedCategory = category?.toLowerCase();

            if (generalizedCategory === "news" || generalizedCategory === "success") {
                return "badge rounded-pill bg-success";
            }
            else if (generalizedCategory === "warning") {
                return "badge rounded-pill bg-warning";
            }
            else if (generalizedCategory === "error") {
                return "badge rounded-pill bg-danger";
            }
            return "badge rounded-pill bg-info";
        }
    }
};
</script>

<template>
    <div
        v-if="showTheModal && alerts.length>0"
        id="alertModal"
        class="modal"
        tabindex="-1"
        aria-modal="true"
        role="dialog"
    >
        <div
            class="modal-dialog modal-dialog-centered modal-dialog-scrollable"
            role="document"
        >
            <div class="modal-content">
                <div class="modal-header">
                    <button
                        type="button"
                        class="btn-close"
                        aria-label="Close"
                        @click="toggleModal(false); onModalClose();"
                    />
                </div>
                <div
                    class="modal-body"
                >
                    <div
                        v-for="(alertCategory, categoryIndex) in sortedAlerts"
                        :key="alertCategory.category"
                        class="alertCategoryContainer"
                    >
                        <div
                            v-for="(singleAlert, singleAlertIndex) in alertCategory.content"
                            :key="singleAlert.hash"
                            :class="singleAlert.category"
                        >
                            <div
                                class="singleAlertContainer"
                            >
                                <hr
                                    v-if="singleAlertIndex>0 || categoryIndex>0"
                                >
                                <button
                                    v-if="!checkCategory(singleAlert.category)"
                                    type="button"
                                    class="btn btn-close btn-sm float-end mt-0"
                                    aria-label="Close"
                                    @click="removeAlert(singleAlert.hash);"
                                />
                                <div
                                    class="d-flex bd-highlight mb-3"
                                >
                                    <h2
                                        class="ms-auto p-2 bd-highlight"
                                    >
                                        <span :class="selectCategoryClass(singleAlert.category)">
                                            {{ $t(singleAlert.displayCategory) }}
                                        </span>
                                    </h2>
                                </div>
                                <h3
                                    class="mt-1"
                                >
                                    <b>
                                        {{ singleAlert.title }}
                                    </b>
                                </h3>
                                <div
                                    class="ms-2"
                                    v-html="singleAlert.content"
                                />
                                <div
                                    v-if="checkCategory(singleAlert.category)"
                                    class="d-flex justify-content-between small"
                                >
                                    <div
                                        class="mt-2"
                                        v-html="$t(`common:modules.alerting.created`)+singleAlert.creationDate"
                                    />
                                    <div
                                        v-if="singleAlert.initialConfirmed && availableLocalStorage"
                                        class="mt-1"
                                    >
                                        <div
                                            class="form-check form-check-reverse form-switch mt-1"
                                        >
                                            <label
                                                class="form-check-label"
                                                for="flexSwitchCheckDefault"
                                            >
                                                {{ singleAlert.mustBeConfirmed? $t(singleAlert.confirmText) : $t(singleAlert.reConfirmText) }}
                                            </label>
                                            <input
                                                id="flexSwitchCheckDefault"
                                                class="form-check-input"
                                                type="checkbox"
                                                @input="markAsRead(singleAlert.hash);"
                                            >
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    @import "~variables";
    #alertModal{
        display:block;
        background-color: rgba(0,0,0,0.5);
    }
    .badge-pill{
        font-size:12px;
    }
    div.alertCategoryContainer {
        margin-bottom:0px;
        &.last {
            margin-bottom:6px;
        }
        h3 {
            border:none;
            color: $secondary_contrast;
            font-size:14px;
            font-weight:bold;
            letter-spacing:initial;
            line-height:18px;
            margin:0 0 8px 0;
            padding:0;
        }

        div.singleAlertContainer {
            color:$secondary_contrast;
            font-size:12px;
            margin-top:0px;
            margin-bottom:5px;
            padding-bottom:0px;
            padding-bottom:0;
        }
    #flexSwitchCheckDefault{
    background-color: $light_blue;
    }
    }
</style>
