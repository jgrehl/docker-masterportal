import store from "../../app-store";
import layerCollection from "./layerCollection";
import LayerOl2dRasterWms from "./layerOl2dRasterWms";

/**
 * Starts the creation of the layer in the layer factory.
 * @param {Object} layerConfig The layer configurations.
 * @returns {void}
 */
export default function runLayerFactory (layerConfig) {
    registerLayerVisibility();
    layerConfig.Hintergrundkarten.Layer.forEach(layerConf => {
        layerCollection.addLayer(createLayer(layerConf));
    });
    layerConfig.Fachdaten.Layer.forEach(layerConf => {
        layerCollection.addLayer(createLayer(layerConf));
    });

    // console.log(layerCollection.getLayers());
    // Todo: Attribute der erzeugten Layer über eine Mutation zurück an die layerConf geben.

    // only for testing
    store.commit("setLayerConfig", {
        Hintergrundkarten: {
            Layer: [
                {
                    id: "453",
                    visibility: false,
                    typ: "WMS",
                    legend: "test"
                }
            ]
        },
        Fachdaten: {
            Layer: [
                // {
                //     id: "1711",
                //     visibility: true
                // }
            ]
        }
    });
}

/**
 * Regsiter to visibility of layers in layerConfig
 * @returns {void}
 */
function registerLayerVisibility () {
    store.watch((state, getters) => getters.layerConfig, layerConfig => {
        // console.log(layerConfig); // Lauschen auf Veränderungen der sichtbaren layer
        /**
         * 1. Prüfen ob sichtbare layer in layerCollection sind
         *      => true: Dem vorhandenen Layer neue Attribute zuordnen
         *      => false: Layer anlegen und zur LayerCollection hinzufügen
         * 2. Alle nicht mehr vorhandenen Layer aus visibility: false setzen
         */

        // Exemplarisch für Hintergrundkarten bis Getter fertig
        layerConfig.Hintergrundkarten.Layer.forEach(layerConf => {
            const layer = layerCollection.getLayerById(layerConf.id);

            if (layer === undefined) {
                createLayer(layerConf);
            }
            else {
                updateLayerAtributes(layer, layerConf);
            }
        });

        // console.log(layerCollection.getLayers());
    });
}

/**
 * Creates layer instances.
 * @param {Object} layerConf The layer configuration.
 * @returns {Layer} The layer instance.
 */
function createLayer (layerConf) {
    const typ = layerConf?.typ?.toUpperCase();
    let layer;

    if (typ === "WMS") {
        layer = new LayerOl2dRasterWms(layerConf);
    }

    return layer;
}

/**
 * Update the layer attributes of the already extistering layer.
 * @param {Layer} layer Layer of the layer collection.
 * @param {Object} layerConf The layer config.
 * @returns {void}
 */
function updateLayerAtributes (layer, layerConf) {
    Object.assign(layer.attributes, layerConf);
}

