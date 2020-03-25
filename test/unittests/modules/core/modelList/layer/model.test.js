import Layer from "@modules/core/modelList/layer/model.js";
import {expect} from "chai";

describe("core/modelList/layer/model", function () {
    let model;

    before(function () {
        model = new Layer();
    });

    describe("toggleIsSelected", function () {
        let secondModel;

        before(function () {
            secondModel = new Layer({channel: Radio.channel("ThisDoesNotExist")});

            // Somehow some errors occur if the attributes for the models are set differently
            model.set("isSelected", false);
            model.set("parentId", "Baselayer");
            model.set("layerSource", {});
            secondModel.attributes.isSelected = true;
            secondModel.attributes.parentId = "Baselayer";
            secondModel.attributes.layerSource = {};

            Radio.trigger("ModelList", "addModel", model);
            Radio.trigger("ModelList", "addModel", secondModel);
        });

        after(function () {
            model = new Layer();
        });

        afterEach(function () {
            model.set("isSelected", false);
            secondModel.attributes.isSelected = true;
        });

        it("should deselect all other baselayers if the option singleBaseLayer is set to true", function () {
            model.set("singleBaseLayer", true);
            Radio.trigger("Layer", "toggleIsSelected");

            expect(model.attributes.isSelected).to.be.true;
            expect(secondModel.attributes.isSelected).to.be.false;
        });

        it("should lead to multiple baselayers being active if the option singleBaseLayer is set to false", function () {
            model.set("singleBaseLayer", false);
            Radio.trigger("Layer", "toggleIsSelected");

            expect(model.attributes.isSelected).to.be.true;
            expect(secondModel.attributes.isSelected).to.be.true;
        });
    });
});
