import menuState from "./stateMenu";
import {generateSimpleGetters} from "../../app-store/utils/generators";


const getters = {
    ...generateSimpleGetters(menuState)
};

export default getters;
