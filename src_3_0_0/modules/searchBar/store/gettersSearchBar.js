import {generateSimpleGetters} from "../../../shared/js/utils/generators";
import stateSearchBar from "./stateSearchBar";

const getters = {
    ...generateSimpleGetters(stateSearchBar)
};

export default getters;
