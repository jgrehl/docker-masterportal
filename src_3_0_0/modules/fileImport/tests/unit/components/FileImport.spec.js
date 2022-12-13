import {createStore} from "vuex";
import {config, shallowMount} from "@vue/test-utils";
import FileImportComponent from "../../../components/FileImport.vue";
import {expect} from "chai";
import sinon from "sinon";

config.global.mocks.$t = key => key;

describe.only("src_3_0_0/modules/fileImport/components/FileImport.vue", () => {
    const
        mockConfigJson = {
            Portalconfig: {
                navigationSecondary: {
                    sections: [
                        {
                            "type": "fileImport"
                        }
                    ]
                }
            }
        };

    let store, wrapper;

    beforeEach(() => {
        mapCollection.clear();

        store = createStore({
            namespaces: true,
            modules: {
                namespaced: true,
                Modules: {
                    namespaced: true,
                    modules: {
                        namespaced: true,
                        FileImport: {
                            namespaced: true,
                            getters: {
                                layer: () => {
                                    return {
                                        getSource: () => ({getFeatures: () => []})
                                    };
                                },
                                active: () => true,
                                importedFileNames: () => [],
                                selectedFiletype: () => "auto",
                                featureExtents: () => ({
                                    "file1": [0, 1, 2, 3],
                                    "file3": [0, 1, 2, 3]
                                })
                            },
                            mutations: {
                                setImportedFileNames: sinon.stub(),
                                setFeatureExtents: sinon.stub()
                            }
                        }
                    }
                },
                Alerting: {
                    namespaced: true,
                    actions: {
                        addSingleAlert: sinon.stub()
                    }
                }
            },
            state: {
                configJson: mockConfigJson
            }
        });
    });

    afterEach(() => {
        sinon.restore();
    });

    it("renders the fileImport", () => {
        wrapper = shallowMount(FileImportComponent, {
            global: {
                plugins: [store]
            }});

        expect(wrapper.find("#file-import").exists()).to.be.true;
    });
    it("sets focus to first input control", async () => {
        const elem = document.createElement("div");

        if (document.body) {
            document.body.appendChild(elem);
        }

        wrapper = shallowMount(FileImportComponent, {
            global: {
                plugins: [store]
            },
            attachTo: elem});
        wrapper.vm.setFocusToFirstControl();
        await wrapper.vm.$nextTick();
        expect(wrapper.find(".btn-secondary").element).to.equal(document.activeElement);
    });
    it("modifies the imported file names", () => {
        const fileNames = ["file1", "file3"];

        store = createStore({
            namespaces: true,
            modules: {
                namespaced: true,
                Modules: {
                    namespaced: true,
                    modules: {
                        namespaced: true,
                        FileImport: {
                            namespaced: true,
                            getters: {
                                layer: () => {
                                    return {
                                        getSource: () => ({getFeatures: () => []})
                                    };
                                },
                                active: () => true,
                                importedFileNames: () => []
                            },
                            mutations: {
                                setImportedFileNames: sinon.stub()
                            }
                        }
                    }
                },
                Alerting: {
                    namespaced: true,
                    actions: {
                        addSingleAlert: sinon.stub()
                    }
                }
            },
            state: {
                configJson: mockConfigJson
            }
        });

        wrapper = shallowMount(FileImportComponent, {
            global: {
                plugins: [store]
            }});
        wrapper.vm.modifyImportedFileNames(fileNames);

        expect(wrapper.vm.importedFileNames).to.deep.equal([]);
    });
    it("modifies the imported file extent", () => {
        const featureExtents = {
                "file1": [0, 1, 2, 3],
                "file2": [0, 1, 2, 3],
                "file3": [0, 1, 2, 3]
            },
            fileNames = ["file1", "file3"];

        wrapper = shallowMount(FileImportComponent, {
            global: {
                plugins: [store]
            }});
        wrapper.vm.modifyImportedFileExtent(featureExtents, fileNames);

        expect(wrapper.vm.featureExtents).to.deep.equal({"file1": [0, 1, 2, 3], "file3": [0, 1, 2, 3]});
    });
});
