import menuState from "./stateMenu";
import {generateSimpleMutations} from "../../app-store/utils/generators";

export default {
    ...generateSimpleMutations(menuState)
};
