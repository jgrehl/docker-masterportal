import store from "../../../app-store";

const urlParamsFacade = {
    ISINITOPEN_MAIN: {
        getter: () => {
            const currentComponentName = "Menu/currentComponentName";

            return store.getters[currentComponentName]("mainMenu");
        },
        setter: (type) => {
            store.dispatch("Menu/changeCurrentComponent", {
                side: "mainMenu",
                type: type,
                props: []
            }, {root: true});
        }
    },
    ISINITOPEN_SECONDARY: {
        getter: () => {
            const currentComponentName = "Menu/currentComponentName";

            return store.getters[currentComponentName]("secondaryMenu");
        },
        setter: (type) => {
            store.dispatch("Menu/changeCurrentComponent", {
                side: "secondaryMenu",
                type: type,
                props: []
            }, {root: true});
        }
    },
    ZOOMLEVEL: {
        getter: () => {
            return store.getters["Maps/zoom"];
        },
        setter: (zoomLevel) => {
            store.dispatch("Maps/setZoom", zoomLevel);
        }
    }
};

export default urlParamsFacade;
