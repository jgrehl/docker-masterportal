export default {
    addEntry (state, entry) {
        state.entries[entry[0]].push(entry);
    },
    removeLastEntry (state, side) {
        state.entries[side + "Menu"].pop();
    }
};
