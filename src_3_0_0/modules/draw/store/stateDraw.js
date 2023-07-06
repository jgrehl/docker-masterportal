/**
 * User type definition
 * @typedef {Object} DrawState
 * @property {String} description The description that should be shown in the button in the right menu.
 * @property {Boolean} hasMouseMapInteractions If this attribute is true, then all other modules will be deactivated when this attribute is also true. Only one module with this attribute true may be open at the same time, since conflicts can arise in the card interactions.
 * @property {String} icon Icon next to title (config-param)
 * @property {String} name Displayed as title (config-param)
 * @property {Boolean} showDescription If true, description will be shown.
 * @property {String[]} supportedDevices Devices on which the module is displayed.
 * @property {String[]} supportedMapModes Map mode in which this module can be used.
 * @property {String} type The type of the module.
 *
 * @property {Object} circleOptions The circle Options
 * @property {Number} circleOptions.innerRadius The inner radius for feature of drawType: "circle and doubelCircle".
 * @property {Boolean} circleOptions.interactive The circle or doubleCircle is drawn interactively or not.
 * @property {Number} circleOptions.outerRadius The outer radius for feature of drawType: "doubleCircle".
 * @property {Object} currentLayout The current layout for the styling.
 * @property {Number[]} currentLayout.fillColor The fill color in rgb.
 * @property {Number} currentLayout.fillTransparency The fill transparency in percent.
 * @property {Number[]} currentLayout.strokeColor The stroke color in rgb.
 * @property {Number} currentLayout.strokeWidth The stroke width in pixel.
 * @property {Object} currentLayoutOuterCircle The current layout for styling the outer circle. Only used for double circle.
 * @property {Number[]} currentLayoutOuterCircle.fillColor The fill color in rgb.
 * @property {Number} currentLayoutOuterCircle.fillTransparency The fill transparency in percent.
 * @property {Number[]} currentLayoutOuterCircle.strokeColor The stroke color in rgb.
 * @property {Number} currentLayoutOuterCircle.strokeWidth The stroke width in pixel.
 * @property {Object} drawIcons The icons for draw buttons.
 * @property {String[]} drawTypesGeometrie The drawing types in geometries.
 * @property {String[]} drawTypesMain The top level (main) drawing types.
 * @property {String[]} drawTypesSymbols The drawing types in symbols.
 * @property {String} selectedDrawType The selected draw type.
 * @property {String} strokeRange The stroke range in the unit pixel.
 */
const state = {
    description: "",
    hasMouseMapInteractions: true,
    icon: "bi-pencil",
    name: "common:modules.draw.name",
    showDescription: false,
    supportedDevices: ["Desktop", "Mobile", "Table"],
    supportedMapModes: ["2D", "3D"],
    type: "draw",

    circleOptions: {
        innerRadius: 100,
        interactive: true,
        outerRadius: 500
    },
    currentLayout: {
        fillColor: [55, 126, 184],
        fillTransparency: 0,
        strokeColor: [0, 0, 0],
        strokeWidth: 1
    },
    currentLayoutOuterCircle: {
        fillColor: [0, 0, 0],
        fillTransparency: 100,
        strokeColor: [200, 0, 0],
        strokeWidth: 1
    },
    drawIcons: {
        box: "bi-square",
        circle: "bi-circle",
        doubleCircle: "bi-record-circle",
        geometries: "bi-hexagon-fill",
        line: "bi-slash-lg",
        pen: "bi-pencil-fill",
        point: "bi-circle-fill",
        polygon: "bi-octagon",
        symbols: "bi-circle-square"
    },
    drawTypesGeometrie: ["line", "box", "polygon", "circle", "doubleCircle"],
    drawTypesMain: ["pen", "geometries", "symbols"],
    drawTypesSymbols: ["point"],
    selectedDrawType: "",
    selectedDrawTypeMain: "",
    strokeRange: [1, 16]
};

export default state;
