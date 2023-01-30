/**
 * User type definition
 * @typedef {Object} FooterState
 * @property {Boolean} scaleLine Show scale line.
 * @property {Boolean} scaleLineWidth The scale line width in cm.
 * @property {String} seperator The seperator between urls.
 * @property {Object[]} urls Array of URL configuration objects
 * @property {String} urls[].alias Name of the link for desktop playout.
 * @property {String} urls[].alias_mobil Name of the link for mobile application.
 * @property {String} urls[].bezeichnung Name before the link.
 * @property {String} urls[].url The URL to be called.
 */
const state = {
    scaleLine: true,
    scaleLineWidth: 2,
    seperator: "&nbsp;|&nbsp;",
    urls: []
};

export default state;
