define(function(require) {
    var expect = require("chai").expect,
        Model = require("../../../../modules/core/map.js"),
        Util = require("util");

    describe("core/map", function () {
        var model,
            utilModel,
            features;

        before(function () {
            model = new Model();
            utilModel = new Util();
            features = utilModel.createTestFeatures();
        });

        describe("calculateExtent", function () {
            it("should return extent that is not undefined", function () {
                expect(model.calculateExtent(features)).not.to.be.undefined;
            });
            it("should return extent of test-features with xMin = 547858.468", function () {
                expect(model.calculateExtent(features)[0]).to.equal(547858.468);
            });
            it("should return extent of test-features with yMin = 5924016.116", function () {
                expect(model.calculateExtent(features)[1]).to.equal(5924016.116);
            });
            it("should return extent of test-features with xMax = 584635.381", function () {
                expect(model.calculateExtent(features)[2]).to.equal(584635.381);
            });
            it("should return extent of test-features with yMax = 5984174.061", function () {
                expect(model.calculateExtent(features)[3]).to.equal(5984174.061);
            });
        });
    });
});
