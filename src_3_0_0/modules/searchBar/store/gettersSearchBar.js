import {generateSimpleGetters} from "../../../shared/js/utils/generators";
import stateSearchBar from "./stateSearchBar";

export default {
    ...generateSimpleGetters(stateSearchBar)
};
