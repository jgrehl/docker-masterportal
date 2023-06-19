import {generateSimpleGetters} from "../../../shared/js/utils/generators";
import stateSearchBar from "./stateSearchBar";
import AddLayer from "../components/featureButtons/AddLayer.vue";

const getters = {
    ...generateSimpleGetters(stateSearchBar),
    featureButtonsMap: () => {
        return {
            AddLayer
        };
    }
};

export default getters;
