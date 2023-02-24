import {createStore} from "vuex";
import {config, shallowMount} from "@vue/test-utils";
import SnippetDownload from "../../../components/SnippetDownload.vue";
import {expect} from "chai";

config.global.mocks.$t = key => key;

describe("src/modules/tools/filter/components/SnippetDownload.vue", () => {
    let wrapper = null,
        store;

    beforeEach(() => {
        store = createStore({
        });
    });

    describe("getDownloadHandler", () => {
        it.skip("should hand over an empty array if filteredItems is an array but has no objects in it", () => {
            let last_result = false;
            const dummy = {
                handler: result => {
                    last_result = result;
                }
            };

            wrapper = shallowMount(SnippetDownload, {
                propsData: {
                    layerConfig: {
                        service: {
                            type: "something external"
                        }
                    },
                    filteredItems: [undefined, null, 1234, "string", true, false, []],
                    layerId: ""
                },
                global: {
                    plugins: [store]
                }
            });
            wrapper.vm.getDownloadHandler(dummy.handler);
            expect(last_result).to.be.an("array").that.is.empty;
        });
        it.skip("should hand over an empty array if filteredItems is an array with objects but without getProperties function", () => {
            let last_result = false;
            const dummy = {
                handler: result => {
                    last_result = result;
                }
            };

            wrapper = shallowMount(SnippetDownload, {
                propsData: {
                    layerConfig: {
                        service: {
                            type: "something external"
                        }
                    },
                    filteredItems: [{
                        notGetProperties: () => false
                    }],
                    layerId: ""
                },
                global: {
                    plugins: [store]
                }
            });
            wrapper.vm.getDownloadHandler(dummy.handler);
            expect(last_result).to.be.an("array").that.is.empty;
        });
        it.skip("should hand over an array of properties", () => {
            let last_result = false;
            const dummy = {
                    handler: result => {
                        last_result = result;
                    }
                },
                expected = [
                    {a: 1, b: 2},
                    {a: 3, b: 4},
                    {a: 5, b: 6},
                    {a: 7, b: 8}
                ],
                filteredItems = [
                    {getProperties: () => {
                        return {a: 1, b: 2};
                    }},
                    {getProperties: () => {
                        return {a: 3, b: 4};
                    }},
                    {getProperties: () => {
                        return {a: 5, b: 6};
                    }},
                    {getProperties: () => {
                        return {a: 7, b: 8};
                    }}
                ];

            wrapper = shallowMount(SnippetDownload, {
                propsData: {
                    layerConfig: {
                        service: {
                            type: "something external"
                        }
                    },
                    filteredItems: filteredItems,
                    layerId: ""
                },
                global: {
                    plugins: [store]
                }
            });
            wrapper.vm.getDownloadHandler(dummy.handler);

            expect(last_result).to.deep.equal(expected);
        });
        it.skip("should hand over an array of properties, excluding the geometry", () => {
            let last_result = false;
            const dummy = {
                    handler: result => {
                        last_result = result;
                    }
                },
                expected = [
                    {a: 1},
                    {a: 3},
                    {a: 5},
                    {a: 7}
                ],
                filteredItems = [
                    {getProperties: () => {
                        return {a: 1, b: 2};
                    }, getGeometryName: () => "b"},
                    {getProperties: () => {
                        return {a: 3, b: 4};
                    }, getGeometryName: () => "b"},
                    {getProperties: () => {
                        return {a: 5, b: 6};
                    }, getGeometryName: () => "b"},
                    {getProperties: () => {
                        return {a: 7, b: 8};
                    }, getGeometryName: () => "b"}
                ];

            wrapper = shallowMount(SnippetDownload, {
                propsData: {
                    layerConfig: {
                        service: {
                            type: "something external"
                        }
                    },
                    filteredItems: filteredItems,
                    layerId: ""
                },
                global: {
                    plugins: [store]
                }
            });
            wrapper.vm.getDownloadHandler(dummy.handler);
            expect(last_result).to.deep.equal(expected);
        });
    });
});
