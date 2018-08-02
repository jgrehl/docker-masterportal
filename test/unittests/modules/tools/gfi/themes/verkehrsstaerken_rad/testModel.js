define(function (require) {
    var expect = require("chai").expect,
        Model = require("../../../../../../../modules/tools/gfi/themes/verkehrsstaerken_rad/model.js"),
        model;

    before(function () {
        model = new Model();
    });

    describe("tools/gfi/themes/verkehrsstaerken_rad", function () {
        var tageslinie = "13.02.2018,00:00:00,4|13.02.2018,00:15:00,5|13.02.2018,00:30:00,5|13.02.2018,00:45:00,0|13.02.2018,01:00:00,0|13.02.2018,01:15:00,0|13.02.2018,01:30:00,0|13.02.2018,01:45:00,0|13.02.2018,02:00:00,0|13.02.2018,02:15:00,2|13.02.2018,02:30:00,0|13.02.2018,02:45:00,1|13.02.2018,03:00:00,0|13.02.2018,03:15:00,0|13.02.2018,03:30:00,1|13.02.2018,03:45:00,0|13.02.2018,04:00:00,1|13.02.2018,04:15:00,2|13.02.2018,04:30:00,3|13.02.2018,04:45:00,1|13.02.2018,05:00:00,3|13.02.2018,05:15:00,8|13.02.2018,05:30:00,6|13.02.2018,05:45:00,12|13.02.2018,06:00:00,8|13.02.2018,06:15:00,20|13.02.2018,06:30:00,14|13.02.2018,06:45:00,33|13.02.2018,07:00:00,35|13.02.2018,07:15:00,37|13.02.2018,07:30:00,81|13.02.2018,07:45:00,77|13.02.2018,08:00:00,100|13.02.2018,08:15:00,120|13.02.2018,08:30:00,150|13.02.2018,08:45:00,166|13.02.2018,09:00:00,110|13.02.2018,09:15:00,81|13.02.2018,09:30:00,82|13.02.2018,09:45:00,59|13.02.2018,10:00:00,49|13.02.2018,10:15:00,42|13.02.2018,10:30:00,35|13.02.2018,10:45:00,31|13.02.2018,11:00:00,27|13.02.2018,11:15:00,40|13.02.2018,11:30:00,34|13.02.2018,11:45:00,27|13.02.2018,12:00:00,31|13.02.2018,12:15:00,40|13.02.2018,12:30:00,40|13.02.2018,12:45:00,42|13.02.2018,13:00:00,29|13.02.2018,13:15:00,56|13.02.2018,13:30:00,51|13.02.2018,13:45:00,54|13.02.2018,14:00:00,43|13.02.2018,14:15:00,48|13.02.2018,14:30:00,56|13.02.2018,14:45:00,51|13.02.2018,15:00:00,47|13.02.2018,15:15:00,58|13.02.2018,15:30:00,76|13.02.2018,15:45:00,64|13.02.2018,16:00:00,53|13.02.2018,16:15:00,62|13.02.2018,16:30:00,88|13.02.2018,16:45:00,75|13.02.2018,17:00:00,64|13.02.2018,17:15:00,88|13.02.2018,17:30:00,100|13.02.2018,17:45:00,100|13.02.2018,18:00:00,93|13.02.2018,18:15:00,86|13.02.2018,18:30:00,98|13.02.2018,18:45:00,79|13.02.2018,19:00:00,78|13.02.2018,19:15:00,43|13.02.2018,19:30:00,41|13.02.2018,19:45:00,41|13.02.2018,20:00:00,31|13.02.2018,20:15:00,30|13.02.2018,20:30:00,21|13.02.2018,20:45:00,20|13.02.2018,21:00:00,18|13.02.2018,21:15:00,23|13.02.2018,21:30:00,24|13.02.2018,21:45:00,30|13.02.2018,22:00:00,19|13.02.2018,22:15:00,17|13.02.2018,22:30:00,12|13.02.2018,22:45:00,7|13.02.2018,23:00:00,5|13.02.2018,23:15:00,16|13.02.2018,23:30:00,10|13.02.2018,23:45:00,8",
            wochenlinie = "7,12.02.2018,3103|7,13.02.2018,3778",
            jahrgangslinie = "2018,5,22200|2018,6,24896|2018,4,27518|2018,3,19464|2018,2,27534|2018,1,17096|2018,7,3103";

        describe("splitTageslinieDataset", function () {
            it("should return array with length of 96", function () {
                expect(model.splitTageslinieDataset(tageslinie)).to.be.an("array").to.have.lengthOf(96);
            });
        });

        describe("splitWochenlinieDataset", function () {
            it("should return array with length of 2", function () {
                expect(model.splitWochenlinieDataset(wochenlinie)).to.be.an("array").to.have.lengthOf(2);
            });
        });

        describe("splitJahrgangslinieDataset", function () {
            it("should return array with length of 7", function () {
                expect(model.splitJahrgangslinieDataset(jahrgangslinie)).to.be.an("array").to.have.lengthOf(7);
            });
        });
    });
});
