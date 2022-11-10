import stateLayerTree from "./stateLayerTree";
import {generateSimpleGetters} from "../../../shared/js/utils/generators";

const layerTreeGetters = {
    ...generateSimpleGetters(stateLayerTree)

};

export default layerTreeGetters;
