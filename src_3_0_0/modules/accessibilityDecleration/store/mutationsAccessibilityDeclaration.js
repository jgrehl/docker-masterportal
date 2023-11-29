import {generateSimpleMutations} from "../../../shared/js/utils/generators";
import stateAccessibilityDeclaration from "./stateAccessibilityDeclaration";

const mutations = {
    ...generateSimpleMutations(stateAccessibilityDeclaration)

};

export default mutations;
