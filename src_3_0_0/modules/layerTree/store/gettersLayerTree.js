import {generateSimpleGetters} from "../../../shared/js/utils/generators";
import stateLayerTree from "./stateLayerTree";

const getters = {
    ...generateSimpleGetters(stateLayerTree)
};

export default getters;
