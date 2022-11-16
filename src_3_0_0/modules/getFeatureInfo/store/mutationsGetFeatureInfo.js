import {generateSimpleMutations} from "../../../shared/js/utils/generators";
import stateGetFeatureInfo from "./stateGetFeatureInfo";

const mutations = {
    ...generateSimpleMutations(stateGetFeatureInfo)
};

export default mutations;
