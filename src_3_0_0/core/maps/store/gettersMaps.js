import {generateSimpleGetters} from "../../../app-store/utils/generators";
import stateMaps from "./stateMaps";

const getters = {
    ...generateSimpleGetters(stateMaps)
};

export default getters;
