import {generateSimpleMutations} from "../../../shared/js/utils/generators";
import stateNewsView from "./stateNewsView";

const mutations = {
    /**
     * Creates from every state-key a setter.
     * For example, given a state object {key: value}, an object
     * {setKey:   (state, payload) => *   state[key] = payload * }
     * will be returned.
     */
    ...generateSimpleMutations(stateNewsView),

    addNews (state, news) {
        state.news.push(news);
    }
};

export default mutations;
