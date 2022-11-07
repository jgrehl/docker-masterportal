export default {
    alertProto: {
        title: "",
        category: "info", // Kategorien festlegen  "News", "Alert"
        confirmText: "common:modules.alerting.hideMessage",
        content: "",
        displayFrom: false, // "2020-01-01 00:00:00" (see moment.js)
        displayUntil: false, // "2030-01-01 00:00:00" (see moment.js)
        creationDate: "",
        hash: "",
        multipleAlert: false,
        legacy_onConfirm: false, // for legacy only, thats why no doc
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
