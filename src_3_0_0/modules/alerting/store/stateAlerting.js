/**
 * User type definition
 * @typedef {Object} AlertingItemState
 * @property {Object} alertProto Blueprint of an alert
 * @property {String} alertProto.title Title of an alert
 * @property {String} alertProto.category Category of an alert
 * @property {String} alertProto.confirmText Text for don't showing the alert again
 * @property {String} alertProto.content content of an alert
 * @property {Boolean/String} alertProto.displayFrom start date of a time limited alert
 * @property {Boolean/String} alertProto.displayUntil end date of a time limited alert
 * @property {String} alertProto.creationDate creation date of an alert
 * @property {String} alertProto.hash hash id of an alert
 * @property {Boolean} alertProto.multipleAlert flag to show multiple alerts or a single alert
 * @property {Boolean} alertProto.mustBeConfirmed flag if an alert can be marked to show not again
 * @property {Boolean/Object} alertProto.once flag if alert is shown once or not. Can also be an object with information when the alert is shown again

 * @property {Object[]} alerts array of current loaded alerts
 * @property {Object} displayedAlerts object of available alerts
 * @property {Boolean/String} fetchBroadcastUrl URL of the alert json
 * @property {Boolean} initialClosed flag to check if the initial modal was closed once
 * @property {String[]} availableCategories available alert categories
 * @property {String} localStorageDisplayedAlertsKey key name for localStorage
 * @property {Boolean} showTheModal flag to control if modal is shown or not
*/
export default {
    alertProto: {
        title: "",
        category: "info",
        confirmText: "common:modules.alerting.hideMessage",
        content: "",
        displayFrom: false, // "2020-01-01 00:00:00" (see moment.js)
        displayUntil: false, // "2030-01-01 00:00:00" (see moment.js)
        creationDate: "",
        hash: "",
        multipleAlert: false,
        mustBeConfirmed: false, // Boolean
        once: false // {seconds: 59, minutes: ...} (see moment.js)
    },
    alerts: [],
    displayedAlerts: {},
    fetchBroadcastUrl: false,
    initialClosed: false,
    availableCategories: ["news", "success", "alert", "error", "info"],
    localStorageDisplayedAlertsKey: "displayedAlerts",
    showTheModal: false
};
