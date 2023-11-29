import {generateSimpleGetters} from "../../../shared/js/utils/generators";
import stateAccessibilityDeclaration from "./stateAccessibilityDeclaration";

const getters = {
    ...generateSimpleGetters(stateAccessibilityDeclaration)
};

export default getters;
