import {generateSimpleGetters} from "../../../../app-store/utils/generators";
import stateTotalView from "./stateTotalView";

export default {
    ...generateSimpleGetters(stateTotalView)
};
