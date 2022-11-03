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
            "showTheModal",
            "sortedAlerts"
        ]),

        /**
         * Reads current URL and returns it without hash and without get params, always ending with slash.
         * This is needed to have a normalized URL tocompare with configured BroadcastConfig URLs;
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
         * @param {object} newDisplayedAlerts newly changed displayedAlerts object
         * @returns {void}
         */
        displayedAlerts (newDisplayedAlerts) {
            if (this.availableLocalStorage) {
                // Local storage is synced with this.displayedAlert
                localStorage[this.localStorageDisplayedAlertsKey] = JSON.stringify(newDisplayedAlerts);
            }
        }
        /*   visible: function(newVal, oldVal) { // watch it
            this.visible = newVal;
            console.log('new' +newVal+ '==' +oldVal)
        } */

    },

    /**
     * Created hook: Creates event listener for legacy Radio calls (to be removed seometime).
     * Checks if localstorage is available.
     * @returns {void}
     */
    created () {
        /*  Backbone.Events.listenTo(Radio.channel("Alert"), {
            "alert": newAlert => {
                this.addSingleAlert(newAlert);
            }
        }); */

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
         * @param {object} response received response object
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
                // singleAlert.multipleAlert = true;
                singleAlert.initial = true;
                this.addSingleAlert(singleAlert);
            });
        },

        /**
         * Just a wrapper method for the XHR request for the sake of testing.
         * @param {string} fetchBroadcastUrl fetchBroadcastUrl
         * @returns {void}
         */
        fetchBroadcast: function (fetchBroadcastUrl) {
            axios.get(fetchBroadcastUrl).then(this.axiosCallback).catch(function (error) {
                console.warn(error);
            });
        },
        /**
         * Just a wrapper method for the XHR request for the sake of testing.
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
         * Select the class for the alert category.
         * @param {String} category category of the alert
         * @returns {void}
         */
        selectCategoryClass: function (category) {
            if (category === "News") {
                return "badge rounded-pill bg-success offset-alert";
            }
            else if (category === "Alert") {
                return "badge rounded-pill bg-warning offset-alert";
            }
            else if (category === "Error") {
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
                        class="singleAlertWrapper"
                        :class="singleAlert.displayClass"
                    >
                        <div
                            class="singleAlertContainer"
                            :class="{
                                singleAlertIsImportant: singleAlert.mustBeConfirmed,
                                last: singleAlertIndex === alertCategory.content.length-1
                            }"
                        >
                            <hr
                                v-if="singleAlertIndex>0 || categoryIndex>0"
                            >
                            <h2>
                                <span :class="selectCategoryClass(singleAlert.category)">
                                    {{ $t(singleAlert.category) }}
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
                                    class="singleAlertMessage"
                                    v-html="singleAlert.content"
                                />
                            </div>
                            <div
                                class="d-flex justify-content-between offset-alert small"
                            >
                                <div
                                    v-html="'Created: '+singleAlert.creationDate"
                                />
                                <p
                                    v-if="singleAlert.mustBeConfirmed && availableLocalStorage"
                                    class="confirm"
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
