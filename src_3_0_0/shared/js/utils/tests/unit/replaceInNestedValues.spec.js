import replaceInNestedValues from "../../replaceInNestedValues.js";
import {expect} from "chai";

describe("src_3_0_0/shared/js/utils/replaceInNestedValues.js", () => {
    let layerConfig;
    const backGroundLayer = {
        id: "452"
    };


    beforeEach(() => {
        layerConfig = {
            Hintergrundkarten: {
                Layer: [
                    {
                        id: "453",
                        visibility: true
                    },
                    backGroundLayer
                ]
            },
            Fachdaten: {
                Layer: [
                    {
                        id: "1132",
                        name: "100 Jahre Stadtgruen POIs",
                        visibility: true
                    },
                    {
                        id: "10220",
                        name: "Dauerzählstellen (Rad) Hamburg",
                        url: "https://geodienste.hamburg.de/HH_WMS_Dauerzaehlstellen_Rad",
                        typ: "WMS",
                        visibility: false,
                        layers: "dauerzaehlstellen_rad",
                        format: "image/png",
                        version: "1.3.0",
                        singleTile: true,
                        transparent: true,
                        transparency: 0,
                        urlIsVisible: true,
                        tilesize: 512,
                        gutter: 0
                    }
                ]
            }
        };
    });


    it("should return an empty array if only one param is given", () => {
        expect(replaceInNestedValues({})).to.be.empty;
    });

    it("should replace one element", () => {
        const replacement = {
                id: "453",
                visibility: true,
                name: "name",
                list: [{a: 1, b: 2}, {c: 3}]
            },
            result = replaceInNestedValues(layerConfig, "Layer", replacement, {key: "id", value: replacement.id});

        expect(result).to.be.an("array");
        expect(result.length).to.be.equals(1);
        expect(result[0]).to.be.deep.equals(replacement);
        expect(layerConfig.Hintergrundkarten.Layer[0]).to.be.deep.equals(replacement);
        expect(layerConfig.Hintergrundkarten.Layer[1]).to.be.deep.equals(backGroundLayer);
    });

    it("should replace one element twice", () => {
        let result = null;
        const layer = {
                id: "453"
            },
            replacement = {
                id: "453",
                visibility: true,
                name: "name",
                list: [{a: 1, b: 2}, {c: 3}]
            };

        layerConfig.Hintergrundkarten.Layer.push(layer);
        result = replaceInNestedValues(layerConfig, "Layer", replacement, {key: "id", value: replacement.id});

        expect(result).to.be.an("array");
        expect(result.length).to.be.equals(2);
        expect(result[0]).to.be.deep.equals(replacement);
        expect(result[1]).to.be.deep.equals(replacement);
        expect(layerConfig.Hintergrundkarten.Layer[0]).to.be.deep.equals(replacement);
        expect(layerConfig.Hintergrundkarten.Layer[2]).to.be.deep.equals(replacement);
        expect(layerConfig.Hintergrundkarten.Layer[1]).to.be.deep.equals(backGroundLayer);
    });

    it("should replace no element, obj must be unchanged", () => {
        const layerConfigCopy = {layerConfig},
            replacement = {
                id: "453",
                visibility: true,
                name: "name",
                list: [{a: 1, b: 2}, {c: 3}]
            },
            result = replaceInNestedValues(layerConfig, "Layer", replacement, {key: "id", value: "abc"});

        expect(result).to.be.an("array");
        expect(result.length).to.be.equals(0);
        expect(layerConfig).to.be.deep.equals(layerConfigCopy.layerConfig);

    });

    it("replace layers in special configuration with nested 'Ordner'", () => {
        const replacement = {
            id: "1103",
            name: "name"
        };
        let result = null;

        layerConfig = {
            Fachdaten: {
                Layer: [
                    {
                        id: "1132",
                        name: "100 Jahre Stadtgruen POIs",
                        visibility: true
                    },
                    {
                        id: "10220"
                    },
                    {
                        Titel: "Titel",
                        Ordner: [
                            {
                                Titel: "3 Layer",
                                Layer: [
                                    {
                                        id: "717",
                                        visibility: true
                                    },
                                    {
                                        id: "718",
                                        visibility: true
                                    },
                                    {
                                        id: "719"
                                    }
                                ],
                                Ordner: [
                                    {
                                        Titel: "Überschwemmungsgebiete",
                                        Layer: [
                                            {
                                                id: "1103",
                                                visibility: true
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        };

        result = replaceInNestedValues(layerConfig, "Layer", replacement, {key: "id", value: "1103"}, "Ordner");
        expect(result).to.be.an("array");
        expect(result.length).to.be.equals(1);
        expect(result[0]).to.be.deep.equals(Object.assign(replacement, {visibility: true}));
    });

    it("should replace visibility of one element, but previous attributes should remain present", () => {
        const replacement = {
                id: "10220",
                visibility: true
            },
            result = replaceInNestedValues(layerConfig, "Layer", replacement, {key: "id", value: replacement.id}),
            newResult = {
                id: "10220",
                name: "Dauerzählstellen (Rad) Hamburg",
                url: "https://geodienste.hamburg.de/HH_WMS_Dauerzaehlstellen_Rad",
                typ: "WMS",
                visibility: true,
                layers: "dauerzaehlstellen_rad",
                format: "image/png",
                version: "1.3.0",
                singleTile: true,
                transparent: true,
                transparency: 0,
                urlIsVisible: true,
                tilesize: 512,
                gutter: 0
            };

        expect(result).to.be.an("array");
        expect(result.length).to.be.equals(1);
        expect(result[0]).to.be.deep.equals(newResult);
        expect(layerConfig.Fachdaten.Layer[1]).to.be.deep.equals(newResult);
    });
});

