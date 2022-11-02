import {generateSimpleMutations} from "../../../../app-store/utils/generators";
import stateTotalView from "./stateTotalView";

export default {
    ...generateSimpleMutations(stateTotalView)
};
