import {generateSimpleMutations} from "../../../app-store/utils/generators";
import stateMaps from "./stateMaps";

const mutations = {
    ...generateSimpleMutations(stateMaps)
};

export default mutations;
