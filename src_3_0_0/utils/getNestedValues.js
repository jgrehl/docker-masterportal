/**
 * gets all entries for a key of an object, following its knots into a given depth
 * - returns a simple array as a list of the found values of the keys
 * - does not add values of an object that is already recognized and added by the given key
 * - does not recognize recursions within objects (e.g. a = [a]), lower maxDepth to prevent infinit loops earlier
 * @param {Object} obj the object to search
 * @param {*} searchKey the key to search for
 * @param {*} searchKeyForArrays if a result entry contains an array at 'searchKeyForArrays', the entries of the array are inspected with 'searchKey'
 * @param {Number} [maxDepth=200] maximum number of self calls, default: 200
 * @returns {*[]} the found nested values as simple array of values
 */
export default function getNestedValues (obj, searchKey, searchKeyForArrays, maxDepth = 200) {
    if (typeof obj !== "object" || obj === null) {
        return [];
    }
    const result = [];

    getNestedValuesHelper(obj, searchKey, maxDepth, result, 0);
    if (searchKeyForArrays) {
        const flatResult = result.flat(Infinity);

        flatResult.forEach((value, index) => {
            if (Array.isArray(value[searchKeyForArrays])) {
                value[searchKeyForArrays].forEach(subValue => {
                    getNestedValuesHelper(subValue, searchKey, maxDepth, flatResult, 0);
                });
                flatResult.splice(index, 1);
            }
        });
        return flatResult;
    }
    return result;
}

/**
 * helper function for the recursion
 * @param {Object} obj the object to search
 * @param {*} searchKey the key to search for
 * @param {Number} maxDepth depth barrier
 * @param {Object|*[]} result collection of already found values
 * @param {Number} depth current depth
 * @returns {void}
 */
function getNestedValuesHelper (obj, searchKey, maxDepth, result, depth) {
    if (typeof obj !== "object" || obj === null || depth >= maxDepth) {
        return;
    }

    Object.keys(obj).forEach(key => {
        if (key === searchKey) {
            result.push(obj[key]);
        }
        else {
            getNestedValuesHelper(obj[key], searchKey, maxDepth, result, depth + 1);
        }
    });
}
