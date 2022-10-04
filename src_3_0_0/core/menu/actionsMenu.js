export default {
    loadMenuItems ({commit, getters}) {
        Object
            .keys(getters.configuration)
            .forEach(key => {
                if (getters.componentMap[key] && typeof getters.configuration[key] === "object" && getters.configuration[key].title) {
                    commit("addMenuItem", {
                        component: getters.componentMap[key],
                        props: getters.configuration[key],
                        key
                    });
                }
            });
    }
};
