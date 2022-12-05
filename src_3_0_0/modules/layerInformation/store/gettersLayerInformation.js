import {generateSimpleGetters} from "../../../shared/js/utils/generators";
import stateLayerInformation from "./stateLayerInformation";

const getters = {
    ...generateSimpleGetters(stateLayerInformation)
};

export default getters;
