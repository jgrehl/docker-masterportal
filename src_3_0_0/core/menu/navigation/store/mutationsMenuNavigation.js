export default {
    addEntry (state, entry) {
        state.entries.push(entry);
    },
    removeLastEntry (state) {
        state.entries.pop();
    }
};
