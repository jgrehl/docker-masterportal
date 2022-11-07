export default {
    alertProto: {
        title: "",
        category: "info", // Kategorien festlegen  "News", "Alert"
        confirmText: "Als gelesen markieren",
        content: "",
        displayClass: "info", // "error" mitgeben bei string-Funktion
        displayFrom: false, // "2020-01-01 00:00:00" (see moment.js)
        displayUntil: false, // "2030-01-01 00:00:00" (see moment.js)
        creationDate: "",
        hash: "",
        legacy_onConfirm: false, // for legacy only, thats why no doc
        mustBeConfirmed: false, // Boolean
        once: false // {seconds: 59, minutes: ...} (see day.js)
    },
    alerts: [],
    displayedAlerts: {},
    fetchBroadcastUrl: false,
    localStorageDisplayedAlertsKey: "displayedAlerts",
    showTheModal: false
};
