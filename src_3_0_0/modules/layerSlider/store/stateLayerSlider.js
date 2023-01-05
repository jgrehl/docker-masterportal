/**
 * User type definition
 * @typedef {Object} LayerSliderState
 * @property {Boolean} active If true, LayerSlider will rendered.
 * @property {String} description The descritption that should be shown in the button in the menu.
 * @property {String} icon "bi-hourglass-split" Icon.
 * @property {Objet[]} layerIds The configured layer with their ids and titles.
 * @property {String} name "Name of the LayerSlider.
 * @property {Boolean} showDescription If true, description will be shown.
 * @property {String} sliderType The Slidertype. "player" or "handle".
 * @property {Number} timeInterval Time interval.
 * @property {String} title The title of the currently selected layer.
 * @property {String} type Type of the LayerSlider component.
 *
 * @property {object} activeLayer The Active layer.
 * @property {String} currentProgressBarWidth The style of the progress bar.
 * @property {Number} progressBarWidth The Width of the progress bar.
 * @property {Function} windowsInterval The Windows Interval used to iterate through the layers.
 *
 * @property {String} sliderMax Slider max. Used for slider input.
 * @property {String} sliderMin Slider min. Used for slider input.
 * @property {String} sliderTicks Slider ticks. Show the positions of the layers in the slider. Used for slider input.
 */
const state = {
    active: false,
    description: "",
    icon: "bi-hourglass-split",
    layerIds: [],
    name: "common:menu.tools.layerSlider",
    showDescription: false,
    sliderType: "player",
    timeInterval: 2000,
    title: "common:modules.tools.layerSlider.title",
    type: "layerSlider",

    activeLayer: {
        layerId: "",
        index: -1
    },
    currentProgressBarWidth: "width: 0%; margin-left: 0%",
    progressBarWidth: 0,
    windowsInterval: null,

    sliderMax: "",
    sliderMin: "0",
    sliderTicks: ""
};

export default state;
