import {generateSimpleMutations} from "../../../shared/js/utils/generators";
import stateMaps from "./stateMaps";

const mutations = {
    ...generateSimpleMutations(stateMaps)
};

export default mutations;
