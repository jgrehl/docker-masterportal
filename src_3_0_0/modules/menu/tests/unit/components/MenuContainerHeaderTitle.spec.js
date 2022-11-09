import Vuex from "vuex";
import {config, mount, createLocalVue} from "@vue/test-utils";
import {expect} from "chai";
import MenuContainerHeaderTitle from "../../../components/MenuContainerHeaderTitle.vue";

const localVue = createLocalVue();

localVue.use(Vuex);
config.mocks.$t = key => key;

describe("src_3_0_0/modules/menu/MenuContainerHeaderTitle.vue", () => {
    const idAppendix = "mainMenu",
        id = `#mp-menu-header-title-${idAppendix}`,
        nameText = "My Portal";
    let store;

    beforeEach(() => {
        store = new Vuex.Store({
            namespaces: true
        });
    });

    it("should render the component and display an anchor tag with '#' as href and include the text if the view is not mobile and only text is given as a prop", () => {
        const wrapper = mount(MenuContainerHeaderTitle, {
                localVue,
                store,
                propsData: {idAppendix, text: nameText}
            }),
            anchor = wrapper.find(id);

        expect(anchor.exists()).to.be.true;
        expect(anchor.attributes("href")).to.equal("#");
        expect(anchor.attributes("target")).to.equal("_self");
        expect(anchor.attributes("title")).to.equal("");
        expect(anchor.classes()).to.eql(["mp-menu-header-title"]);
        expect(anchor.findAll("h1").length).to.equal(1);
        expect(anchor.find("h1").text()).to.equal(nameText);
        expect(anchor.find("img").exists()).to.be.false;
    });
    it("should render the component and display an anchor tag with the given link as href and include the text if the view is not mobile and text as well as link are given as props", () => {
        const link = "https://some.url.com",
            wrapper = mount(MenuContainerHeaderTitle, {
                localVue,
                store,
                propsData: {idAppendix, text: nameText, link}
            }),
            anchor = wrapper.find(id);

        expect(anchor.exists()).to.be.true;
        expect(anchor.attributes("href")).to.equal(link);
        expect(anchor.attributes("target")).to.equal("_blank");
        expect(anchor.attributes("title")).to.equal("");
        expect(anchor.classes()).to.eql(["mp-menu-header-title"]);
        expect(anchor.findAll("h1").length).to.equal(1);
        expect(anchor.find("h1").text()).to.equal(nameText);
        expect(anchor.find("img").exists()).to.be.false;
    });
    it("should render the component and display an anchor tag with '#' as href, include the text and display an image if the view is not mobile and text as well as logo are given as props", () => {
        const logo = "some png",
            wrapper = mount(MenuContainerHeaderTitle, {
                localVue,
                store,
                propsData: {idAppendix, text: nameText, logo}
            }),
            anchor = wrapper.find(id);

        expect(anchor.exists()).to.be.true;
        expect(anchor.attributes("href")).to.equal("#");
        expect(anchor.attributes("target")).to.equal("_self");
        expect(anchor.attributes("title")).to.equal("");
        expect(anchor.classes()).to.eql(["mp-menu-header-title"]);
        expect(anchor.findAll("h1").length).to.equal(1);
        expect(anchor.find("h1").text()).to.equal(nameText);
        expect(anchor.findAll("img").length).to.equal(1);
        expect(anchor.find("img").attributes("src")).to.equal(logo);
        expect(anchor.find("img").attributes("alt")).to.equal(nameText);
    });
    it("should render the component and display an anchor tag with '#' as href, include the text and use the toolTip as title prop of the anchor if the view is not mobile and text as well as toolTip are given as props", () => {
        const toolTip = "Opens something",
            wrapper = mount(MenuContainerHeaderTitle, {
                localVue,
                store,
                propsData: {idAppendix, text: nameText, toolTip}
            }),
            anchor = wrapper.find(id);

        expect(anchor.exists()).to.be.true;

        expect(anchor.attributes("href")).to.equal("#");
        expect(anchor.attributes("target")).to.equal("_self");
        expect(anchor.attributes("title")).to.equal(toolTip);
        expect(anchor.classes()).to.eql(["mp-menu-header-title"]);
        expect(anchor.findAll("h1").length).to.equal(1);
        expect(anchor.find("h1").text()).to.equal(nameText);
        expect(anchor.find("img").exists()).to.be.false;
    });
});
