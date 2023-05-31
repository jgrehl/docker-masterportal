import {generateSimpleGetters} from "../../../shared/js/utils/generators";
import stateDraw from "./stateDraw";

const getters = {
    ...generateSimpleGetters(stateDraw)
};

export default getters;
