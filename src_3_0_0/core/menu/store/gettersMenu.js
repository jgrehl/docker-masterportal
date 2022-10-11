import titlePortalState from "./stateMenu";
import {generateSimpleGetters} from "../../../app-store/utils/generators";


const getters = {
    ...generateSimpleGetters(titlePortalState),
};

export default getters;
