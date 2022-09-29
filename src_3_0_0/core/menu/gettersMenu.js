import menuState from "./stateMenu";
import {generateSimpleGetters} from "../../app-store/utils/generators";


const defaultConfiguration = {
        initiallyOpen: false
    },
    getters = {
        ...generateSimpleGetters(menuState),
        configuration (_, __, ___, rootGetters) {
            if (rootGetters.loadedConfigs.configJson) {
                return rootGetters.portalConfig.menu;
            }
            return defaultConfiguration;
        }
    };

export default getters;
