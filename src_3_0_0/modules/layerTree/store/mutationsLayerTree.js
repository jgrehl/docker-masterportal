import stateLayerTree from "./stateLayerTree";
import {generateSimpleMutations} from "../../../shared/js/utils/generators";

export default {
    ...generateSimpleMutations(stateLayerTree)
};
