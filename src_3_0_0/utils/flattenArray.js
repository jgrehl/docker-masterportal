/**
 * Flattens an array with depth 1, means array that contains arrays.
 * @param {Array} arr to flatten
 * @returns {Array} the flattened array
 */
export default function flattenArray (arr) {
    if (!Array.isArray(arr)) {
        return arr;
    }
    let result = [];

    arr.forEach(value => {
        if (Array.isArray(value)) {
            result = result.concat(value);
        }
        else {
            result.push(value);
        }
    });

    return result;
}
