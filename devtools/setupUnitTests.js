const {config, enableAutoUnmount} = require("@vue/test-utils");
const canvas = require("canvas");

global.ResizeObserver = require("resize-observer-polyfill");

/**
 * Mock for web worker
 */
class Worker {
    /**
     * Constructor
     * @param {String} stringUrl a string representing the URL of the script the worker will execute
     * @returns {void} void
     */
    constructor (stringUrl) {
        this.url = stringUrl;
        this.onmessage = () => {
            // empty
        };
    }

    /**
     * Post message
     * @param {String} msg message
     * @returns {void} void
     */
    postMessage (msg) {
        this.onmessage(msg);
    }
}
// a mock for web worker
global.Worker = Worker;
// renderStubDefaultSlot: https://test-utils.vuejs.org/migration/#shallowmount-and-renderstubdefaultslot
config.global.renderStubDefaultSlot = true;
// global.SVGElement: @see https://github.com/vuejs/core/issues/3590
global.SVGElement = window.SVGElement;
global.CanvasPattern = canvas.CanvasPattern;

/**
 * EnableAutoUnmount allows to automatically destroy Vue wrappers.
 * No wrapper.destroy() is needed in each test.
 * Destroy logic is passed as callback to hook Function.
 */
enableAutoUnmount(afterEach);
