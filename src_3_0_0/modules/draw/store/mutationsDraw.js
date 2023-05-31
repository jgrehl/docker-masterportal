import {generateSimpleMutations} from "../../../shared/js/utils/generators";
import stateDraw from "./stateDraw";

const mutations = {
    ...generateSimpleMutations(stateDraw)
};

export default mutations;
