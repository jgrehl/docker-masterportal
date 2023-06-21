import {config, shallowMount} from "@vue/test-utils";
import {expect} from "chai";
import {Popover} from "bootstrap";
import sinon from "sinon";
import VectorSource from "ol/source/Vector";

import DrawTypesComponent from "../../../components/DrawTypes.vue";

config.global.mocks.$t = key => key;

describe("src_3_0_0/shared/modules/draw/components/DrawTypes.vue", () => {
    let source,
        wrapper;

    beforeEach(() => {
        source = new VectorSource();
    });

    afterEach(() => {
        sinon.restore();
    });

    it("renders the drawTypes with popovers", () => {
        wrapper = shallowMount(DrawTypesComponent, {
            propsData: {
                source: source
            }
        });

        expect(wrapper.find("#draw-pen").exists()).to.be.true;
        expect(wrapper.find("#draw-pen").attributes().aria).to.equals("common:shared.modules.draw.drawTypes.pen");

        expect(wrapper.find("#draw-geometries").exists()).to.be.true;
        expect(wrapper.find("#draw-geometries").attributes().aria).to.equals("common:shared.modules.draw.drawTypes.geometries");

        expect(wrapper.find("#draw-symbols").exists()).to.be.true;
        expect(wrapper.find("#draw-symbols").attributes().aria).to.equals("common:shared.modules.draw.drawTypes.symbols");

        expect(wrapper.find("div.draw-types-popovers").exists()).to.be.true;
        expect(wrapper.find("div.draw-types-popovers").attributes()).to.deep.equals({
            class: "draw-types-popovers",
            style: "display: none;"
        });
        expect(wrapper.find("#draw-types-geometries").exists()).to.be.true;
        expect(wrapper.find("#draw-types-symbols").exists()).to.be.true;
    });

    describe("processPopover", () => {
        it("should create a popover and add its to data popovers", () => {
            const element = document.createElement("div"),
                contentElementId = "contentId";

            wrapper = shallowMount(DrawTypesComponent, {
                propsData: {
                    source: source
                }
            });

            wrapper.vm.processPopover(element, contentElementId);
            expect(wrapper.vm.popovers.length).to.equals(1);
        });
    });

    describe("createPopover", () => {
        it("should create a popover element", () => {
            const element = document.createElement("div");

            wrapper = shallowMount(DrawTypesComponent, {
                propsData: {
                    source: source
                }
            });

            expect(wrapper.vm.createPopover(element)).to.be.not.undefined;
            expect(wrapper.vm.createPopover(element)).to.be.not.null;
            expect(wrapper.vm.createPopover(element) instanceof Popover).to.be.true;
        });
    });

    describe("setPopoverContent", () => {
        it("should set popover content", () => {
            const popoverElement = document.createElement("div"),
                bodyElement = document.createElement("p");
            let popover = null;

            bodyElement.innerHTML = "This is a paragraph.";

            wrapper = shallowMount(DrawTypesComponent, {
                propsData: {
                    source: source
                }
            });

            popover = wrapper.vm.createPopover(popoverElement);
            wrapper.vm.setPopoverContent(popover, bodyElement);

            expect(popover._newContent).to.deep.equals({
                ".popover-header": "",
                ".popover-body": bodyElement
            });
        });
    });

    describe("updateIcon", () => {
        it("should update the icon in mappingIcons", () => {
            const type = "geometries",
                icon = "bi-record-circle";

            wrapper = shallowMount(DrawTypesComponent, {
                propsData: {
                    source: source
                }
            });

            wrapper.vm.updateIcon(icon, type);

            expect(wrapper.vm.mappingIcons).to.deep.equals({
                geometries: "bi-record-circle",
                pen: "bi-pencil-fill",
                symbols: "bi-circle-square"
            });
        });
    });
});
