import menuNavigationState from "./stateMenuNavigation";
import {generateSimpleGetters} from "../../../../app-store/utils/generators";

const getters = {
    ...generateSimpleGetters(menuNavigationState),
    lastEntry () {
        return menuNavigationState.entries[menuNavigationState.entries.length - 1];
    }
};

export default getters;
