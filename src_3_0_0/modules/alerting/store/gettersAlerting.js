export default {
    /**
     * Getter for fetchBroadcastUrl.
     * @param {Object} state state
     * @returns {String} fetchBroadcastUrl
     */
    fetchBroadcastUrl: (state) => {
        return state.fetchBroadcastUrl;
    },
    /**
     * Getter for localStorageDisplayedAlertsKey.
     * @param {Object} state state
     * @returns {String} localStorageDisplayedAlertsKey
     */
    localStorageDisplayedAlertsKey: (state) => {
        return state.localStorageDisplayedAlertsKey;
    },
    /**
     * Getter for displayedAlerts.
     * @param {Object} state state
     * @returns {Object} displayedAlerts
     */
    displayedAlerts: (state) => {
        return state.displayedAlerts;
    },
    /**
     * Getter for showTheModal.
     * @param {Object} state state
     * @returns {Boolean} showTheModal
     */
    showTheModal: (state) => {
        return state.showTheModal;
    },
    /**
     * Getter for alerts.
     * @param {Object} state state
     * @returns {Object[]} alerts
     */
    alerts: (state) => {
        return state.alerts;
    },
    /**
     * This returns the alerts queue array grouped by the alerts' category property.
     * And show error-warning-success -Alerts before info and news
     * @param {Object} state state
     * @returns {Object[]} sortedAlerts
     */
    sortedAlerts: (state) => {
        const
            resultByCategory = {},
            results = [];

        state.alerts.forEach(singleAlert => {
            if (resultByCategory[singleAlert.category] === undefined) {
                resultByCategory[singleAlert.category] = [];
            }
            resultByCategory[singleAlert.category].push({...singleAlert});
        });

        Object.keys(resultByCategory).forEach(key => {
            results.push({category: key, content: resultByCategory[key]});
        });

        results.sort(function (a, b) {
            const sortingArr = ["success", "warning", "error"];

            return sortingArr.indexOf(b.category) - sortingArr.indexOf(a.category);
        });
        return results;
    }
};
