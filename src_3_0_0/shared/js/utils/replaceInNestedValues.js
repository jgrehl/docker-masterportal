import Vue from "vue";

/**
 * Replaces all entries for a key of an object with the replacement if condition is true at object to replace.
 * - returns a simple array as a list of the replaced objects
 * - does not add values of an object that is already recognized and added by the given key
 * - does not recognize recursions within objects (e.g. a = [a]), lower maxDepth to prevent infinit loops earlier
 * @param {Object} obj the object to search
 * @param {*} searchKey the key to search for
 * @param {Object} replacement to replace
 * @param {Object} condition to compare with
 * @param {String} condition.key to compare with
 * @param {String} condition.value to compare with
 * @param {*} searchKeyForArrays if an entry contains an array at 'searchKeyForArrays', the entries of the array are inspected with 'searchKey'
 * @param {Number} [maxDepth=200] maximum number of self calls, default: 200
 * @returns {*[]} the replaced objects
 */
export default function replaceInNestedValues (obj, searchKey, replacement, condition, searchKeyForArrays, maxDepth = 200) {
    if (typeof obj !== "object" || obj === null) {
        return [];
    }
    const result = [];

    replaceInNestedValuesHelper(obj, searchKey, maxDepth, result, 0, replacement, condition, searchKeyForArrays);
    return result;
}

/**
 * helper function for the recursion
 * @param {Object} obj the object to search
 * @param {*} searchKey the key to search for
 * @param {Number} maxDepth depth barrier
 * @param {Object|*[]} result collection of already found values
 * @param {Number} depth current depth
 * @param {Object} replacement to replace
 * @param {Object} condition to compare with
 * @param {String} condition.key to compare with
 * @param {String} condition.value to compare with
 * @param {*} searchKeyForArrays if an entry contains an array at 'searchKeyForArrays', the entries of the array are inspected with 'searchKey'
 * @returns {void}
 */
function replaceInNestedValuesHelper (obj, searchKey, maxDepth, result, depth, replacement, condition, searchKeyForArrays) {
    if (typeof obj !== "object" || obj === null || depth >= maxDepth) {
        return;
    }

    Object.keys(obj).forEach(key => {
        if (key === searchKey) {
            if (obj[key][condition.key] === condition.value && obj[key] !== replacement) {
                addToObserver(obj, key, replacement);
                obj[key] = replacement;
                result.push(replacement);
            }
            else if (Array.isArray(obj[key])) {
                obj[key].forEach(element => {
                    if (element[condition.key] === condition.value && element !== replacement) {
                        addToObserver(element, key, replacement);
                        Object.assign(element, replacement);
                        result.push(element);
                    }
                    else if (Array.isArray(element[searchKeyForArrays])) {
                        replaceInNestedValuesHelper(element[searchKeyForArrays], searchKey, maxDepth, result, depth + 1, replacement, condition, searchKeyForArrays);
                    }
                });
            }
        }
        else {
            replaceInNestedValuesHelper(obj[key], searchKey, maxDepth, result, depth + 1, replacement, condition, searchKeyForArrays);
        }
    });
}

/**
 * Informs Vue about new properties at obj to observe them.
 * @link https://v2.vuejs.org/v2/api/#Vue-set
 * @param {Object} obj to change porperties of
 * @param {String} key key of property
 * @param {*} replacement the replacement at the key
 * @returns {void}
 */
function addToObserver (obj, key, replacement) {
    if (typeof replacement === "object") {
        Object.keys(replacement).forEach(aKey => {
            if (!Object.hasOwn(obj, aKey)) {
                Vue.set(obj, aKey, replacement[aKey]);
            }
        });
    }
    else if (!Object.hasOwn(obj, key)) {
        Vue.set(obj, key, replacement);
    }
}
