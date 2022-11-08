<script>

import axios from "axios";
import {mapActions, mapGetters} from "vuex";

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
         * Check category name to control if footer attributes should be shown
         * @param {String} category category name
         * @returns {void}
         */
        checkFooter: function (category) {
            const checkCategory = category.toLowerCase();

            if (checkCategory !== "error" && checkCategory !== "alert" && checkCategory !== "success") {
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
                return "badge rounded-pill bg-success offset-alert";
            }
            else if (generalizedCategory === "alert") {
                return "badge rounded-pill bg-warning offset-alert";
            }
            else if (generalizedCategory === "error") {
                return "badge rounded-pill bg-danger offset-alert";
            }
            return "badge rounded-pill bg-info offset-alert";
        }
    }
};
</script>

<template>
    <div
        v-if="showTheModal"
        id="alertModal"
        class="modal"
        tabindex="-1"
        aria-modal="true"
        role="dialog"
    >
        <div
            class="modal-dialog modal-dialog-centered"
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
                    v-for="(alertCategory, categoryIndex) in sortedAlerts"
                    :key="alertCategory.category"
                    class="alertCategoryContainer"
                    :class="{ last: categoryIndex === sortedAlerts.length-1 }"
                >
                    <div
                        v-for="(singleAlert, singleAlertIndex) in alertCategory.content"
                        :key="singleAlert.hash"
                        :class="singleAlert.displayClass"
                    >
                        <div
                            class="singleAlertContainer"
                        >
                            <hr
                                v-if="singleAlertIndex>0 || categoryIndex>0"
                            >
                            <h2>
                                <span :class="selectCategoryClass(singleAlert.category)">
                                    {{ $t(singleAlert.displayCategory) }}
                                </span>
                            </h2>
                            <div
                                class="modal-body"
                            >
                                <h3>
                                    <b>
                                        {{ singleAlert.title }}
                                    </b>
                                </h3>
                                <div
                                    v-html="singleAlert.content"
                                />
                            </div>
                            <div
                                v-if="checkFooter(singleAlert.category)"
                                class="d-flex justify-content-between offset-alert small"
                            >
                                <div
                                    class="mt-2"
                                    v-html="$t(`common:modules.alerting.created`)+singleAlert.creationDate"
                                />
                                <p
                                    v-if="singleAlert.mustBeConfirmed && availableLocalStorage"
                                    class="mt-1"
                                >
                                    <button
                                        type="button"
                                        class="btn btn-link btn-sm float-end"
                                        @click="markAsRead(singleAlert.hash)"
                                        @keydown.enter="markAsRead(singleAlert.hash)"
                                    >
                                        {{ $t(singleAlert.confirmText) }}
                                    </button>
                                </p>
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
    .offset-alert {
    margin-left:10px;
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
            margin-bottom:0px;
            padding-bottom:0px;
            padding-bottom:0;
        }
    }
</style>
