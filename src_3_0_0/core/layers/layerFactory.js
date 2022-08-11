
import layerCollection from "./layerCollection";
import LayerOl2dRasterWms from "./layerOl2dRasterWms";

/**
 * The layer factory.
 * @returns {Layer} The layer instance.
 */
function LayerFactory () {
    this.createLayer = (layerConf) => {
        const typ = layerConf.typ.toUpperCase();
        let layer;

        if (typ === "WMS") {
            layer = new LayerOl2dRasterWms(layerConf);
        }

        return layer;
    };
}

/**
 * Starts the creation of the layer in the layer factory.
 * @param {Object} layerConfig The layer configurations.
 * @returns {*} todo
 */
export default function runLayerFactory (layerConfig) {
    const layerFactory = new LayerFactory();

    layerConfig.Hintergrundkarten.Layer.forEach(layerConf => {
        layerCollection.addLayer(layerFactory.createLayer(layerConf));
    });
    layerConfig.Fachdaten.Layer.forEach(layerConf => {
        layerCollection.addLayer(layerFactory.createLayer(layerConf));
    });
}

