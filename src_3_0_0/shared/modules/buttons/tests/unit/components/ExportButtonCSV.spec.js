import {config, shallowMount} from "@vue/test-utils";
import {expect} from "chai";
import ExportButtonCSV from "../../../components/ExportButtonCSV.vue";

config.global.mocks.$t = key => key;

describe("src_3_0_0/shared/modules/buttons/components/exportButtonCSV.vue", () => {
    before(() => {
        i18next.init({
            lng: "cimode",
            debug: false
        });
    });
    it("createFilename", () => {
        const wrapper = shallowMount(ExportButtonCSV, {
            props: {}
        });

        expect(wrapper.vm.createFilename("prefix", "YYYY")).to.equal("prefix" + String(new Date().getFullYear()) + ".csv");
    });
    it("template", () => {
        const wrapper = shallowMount(ExportButtonCSV, {
            props: {}
        });

        expect(wrapper.find("button").exists()).to.be.true;
    });
});
