const {config, enableAutoUnmount} = require("@vue/test-utils");

config.global.renderStubDefaultSlot = true;
// global.SVGElement @see https://github.com/vuejs/core/issues/3590
global.SVGElement = window.SVGElement;

/**
 * EnableAutoUnmount allows to automatically destroy Vue wrappers.
 * Destroy logic is passed as callback to hook Function.
 */
enableAutoUnmount(afterEach);
