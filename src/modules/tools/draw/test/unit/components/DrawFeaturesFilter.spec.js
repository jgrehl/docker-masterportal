import {shallowMount} from "@vue/test-utils";
import {expect} from "chai";
import DrawFeaturesFilter from "../../../components/DrawFeaturesFilter.vue";
import Feature from "ol/Feature";
import sinon from "sinon";

describe("src/tools/draw/components/DrawFeaturesFilter.vue", () => {
    let testFeatures,
        filterListConfig,
        spySetFeaturesVisibility;
    const requiredProps = {filterList: [], features: []},
        factory = {
            getShallowMount: (props = requiredProps) => {
                return shallowMount(DrawFeaturesFilter, {
                    propsData: {
                        ...props
                    }
                });
            }
        };

    before(() => {
        spySetFeaturesVisibility = sinon.spy(DrawFeaturesFilter.methods, "setFeaturesVisibility");
    });

    beforeEach(function () {
        testFeatures = [
            new Feature({
                isVisible: false,
                drawState: {
                    drawType: {
                        id: "drawSymbol"
                    }
                }
            }),
            new Feature({
                isVisible: false,
                drawState: {
                    drawType: {
                        id: "drawArea"
                    }
                }
            }),
            new Feature({
                isVisible: false,
                drawState: {
                    drawType: {
                        id: "drawCircle"
                    }
                }
            })
        ];
        filterListConfig = [{
            drawTypes: ["drawSymbol", "writeText"],
            name: "Taktische Zeichen und Beschriftung"
        }, {
            drawTypes: ["drawArea", "drawCircle", "drawDoubleCircle"],
            name: "Polygone und Radien"
        }];
    });

    describe("Component DOM", () => {
        it("should exist", () => {
            const wrapper = factory.getShallowMount();

            expect(wrapper.exists()).to.be.true;
        });

        it("should have a form element", () => {
            const wrapper = factory.getShallowMount(),
                formElement = wrapper.find("form");

            expect(formElement.exists()).to.be.true;
        });

        it("should have a form element with the id 'draw-filter", () => {
            const wrapper = factory.getShallowMount(),
                formElement = wrapper.find("form");

            expect(formElement.attributes("id")).to.equal("draw-filter");
        });

        it("should have a form element with no checkboxes", () => {
            const wrapper = factory.getShallowMount();

            expect(wrapper.findAll(".checkbox")).to.have.lengthOf(0);
        });

        it("should have a form element with two checkboxes", () => {
            const props = {filterList: filterListConfig, features: testFeatures},
                wrapper = factory.getShallowMount(props);

            expect(wrapper.findAll(".checkbox")).to.have.lengthOf(2);
        });

        it("should have the right labels for the checkboxes", () => {
            const props = {filterList: filterListConfig, features: testFeatures},
                wrapper = factory.getShallowMount(props);

            wrapper.findAll("label").wrappers.forEach((label, index) => {
                expect(label.text()).to.equal(filterListConfig[index].name);
            });
        });

        it("should have no checked checkboxes", () => {
            const props = {filterList: filterListConfig, features: testFeatures},
                wrapper = factory.getShallowMount(props);

            wrapper.findAll("input").wrappers.forEach(input => {
                expect(input.element.checked).to.be.false;
            });
        });

        it("should have only checked checkboxes", () => {
            testFeatures.forEach(feature => {
                feature.set("isVisible", true);
            });
            const props = {filterList: filterListConfig, features: testFeatures},
                wrapper = factory.getShallowMount(props);

            wrapper.findAll("input").wrappers.forEach(input => {
                expect(input.element.checked).to.be.true;
            });
        });

        it("should have one checked and one unchecked checkbox", () => {
            testFeatures[0].set("isVisible", true);
            const props = {filterList: filterListConfig, features: testFeatures},
                wrapper = factory.getShallowMount(props),
                inputElements = wrapper.findAll("input").wrappers;

            expect(inputElements[0].element.checked).to.be.true;
            expect(inputElements[1].element.checked).to.be.false;
        });
    });

    describe("User Interactions", () => {
        it("should call setFeaturesVisibility if checkbox change event is triggered", async () => {
            const props = {filterList: filterListConfig, features: testFeatures},
                wrapper = factory.getShallowMount(props),
                inputElement = wrapper.find("input");

            await inputElement.setChecked();
            expect(spySetFeaturesVisibility.calledOnce).to.be.true;
        });
    });

    describe("Properties", () => {
        it("should return groupedFeatures as an object ", () => {
            const props = {filterList: filterListConfig, features: testFeatures},
                wrapper = factory.getShallowMount(props);

            expect(wrapper.vm.groupedFeatures).is.an("object");
        });

        it("groupedFeatures should have the keys 'Taktische Zeichen und Beschriftung' and 'Polygone und Radien'", () => {
            const props = {filterList: filterListConfig, features: testFeatures},
                wrapper = factory.getShallowMount(props);

            expect(wrapper.vm.groupedFeatures).to.have.all.keys("Taktische Zeichen und Beschriftung", "Polygone und Radien");
        });

        it("groupedFeatures['Taktische Zeichen und Beschriftung'] should have an array with one feature", () => {
            const props = {filterList: filterListConfig, features: testFeatures},
                wrapper = factory.getShallowMount(props);

            expect(wrapper.vm.groupedFeatures["Taktische Zeichen und Beschriftung"]).to.have.lengthOf(1);
        });

        it("groupedFeatures['Polygone und Radien'] should have an array with two features in the attribute", () => {
            const props = {filterList: filterListConfig, features: testFeatures},
                wrapper = factory.getShallowMount(props);

            expect(wrapper.vm.groupedFeatures["Polygone und Radien"]).to.have.lengthOf(2);
        });
    });
});
