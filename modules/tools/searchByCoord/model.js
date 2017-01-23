define([

    "openlayers",
    "eventbus",
    "proj4"
], function (ol, EventBus, proj4) {

    var SearchByCoord = Backbone.Model.extend({

        defaults: {
            "coordSystem": "ETRS89",
            "coordSystems": ["ETRS89", "WGS84", "WGS84(Dezimalgrad)"],
            "coordinatesEasting": "",
            "coordinatesNorthing": ""
        },
        initialize: function () {

            this.listenTo(Radio.channel("Window"), {
                "winParams": this.setStatus
            });
        },
        validate: function (attributes) {
            var validETRS89 = /^[0-9]{6,7}[.]{0,1}[0-9]{0,3}$/,
                validWGS84 = /^\d[0-9]{0,2}[°′″'"]{0,1}$/,
                validWGS84_dez = /^[0-9]{1,3}[.]{1}[0-9]{0,5}\d[°]{0,1}$/;

            if (attributes.coordSystem === "ETRS89") {
                _.each(attributes.coordinates, function (value, key) {

                    var fieldName;

                    $(fieldName + ".text-danger").html("");
                    if (key === 0) {
                        fieldName = "#coordinatesEastingField";
                    }
                    else {
                        fieldName = "#coordinatesNorthingField";
                    }
                    if (value.coord.length < 1) {
                        value.ErrorMsg = "Bitte geben Sie ihren " + value.key + " ein";
                        $(fieldName + "+ .text-danger").html("");
                        $(fieldName).after("<span class='text-danger'><small>" + value.ErrorMsg + "</small></span>");
                        $(fieldName).parent().addClass("has-error");
                    }
                    else if (!value.coord.match(validETRS89)) {
                        value.ErrorMsg = "Die Eingabe für den " + value.key + " ist nicht korrekt! (Beispiel: " + value.example + ")";
                        $(fieldName + "+ .text-danger").html("");
                        $(fieldName).after("<span class='text-danger'><small>" + value.ErrorMsg + "</small></span>");
                        $(fieldName).parent().addClass("has-error");
                    }
                    else {
                        $(fieldName + "+ .text-danger").html("");
                        $(fieldName).parent().removeClass("has-error");
                        Radio.trigger("Alert", "alert:remove");
                    }
                }
                      );
            }

            else if (attributes.coordSystem === "WGS84") {
                _.each(attributes.coordinates[0].coord, function (value, key) {
                        if (attributes.coordinates[0].coord[key].length < 1) {
                                attributes.coordinates[0].ErrorMsg = "Bitte geben Sie ihren " + attributes.coordinates[0].key + " ein";
                                $("#coordinatesEastingField + .text-danger").html("");
                                $("#coordinatesEastingField").after("<span class='text-danger'><small>" + attributes.coordinates[0].ErrorMsg + "</small></span>");
                                $("#coordinatesEastingField").parent().addClass("has-error");
                            }
                            else if (!attributes.coordinates[0].coord[key].match(validWGS84)) {
                                attributes.coordinates[0].ErrorMsg = "Die Eingabe für den " + attributes.coordinates[0].key + " ist nicht korrekt! (Beispiel: " + attributes.coordinates[0].example + ")";
                                $("#coordinatesEastingField + .text-danger").html("");
                                $("#coordinatesEastingField").after("<span class='text-danger'><small>" + attributes.coordinates[0].ErrorMsg + "</small></span>");
                                $("#coordinatesEastingField").parent().addClass("has-error");
                                throw new IllegalArgumentException();
                            }
                            else {
                                $("#coordinatesEastingField + .text-danger").html("");
                                $("#coordinatesEastingField").parent().removeClass("has-error");
                                Radio.trigger("Alert", "alert:remove");
                            }
                    });
                    _.each(attributes.coordinates[1].coord, function (value, key) {
                        if (attributes.coordinates[1].coord[key].length < 1) {
                            attributes.coordinates[1].ErrorMsg = "Bitte geben Sie ihren " + attributes.coordinates[1].key + " ein";
                            $("#coordinatesNorthingField + .text-danger").html("");
                            $("#coordinatesNorthingField").after("<span class='text-danger'><small>" + attributes.coordinates[1].ErrorMsg + "</small></span>");
                            $("#coordinatesNorthingField").parent().addClass("has-error");
                        }
                        else if (!attributes.coordinates[1].coord[key].match(validWGS84)) {
                            attributes.coordinates[1].ErrorMsg = "Die Eingabe für den " + attributes.coordinates[1].key + " ist nicht korrekt! (Beispiel: " + attributes.coordinates[1].example + ")";
                            $("#coordinatesNorthingField + .text-danger").html("");
                            $("#coordinatesNorthingField").after("<span class='text-danger'><small>" + attributes.coordinates[1].ErrorMsg + "</small></span>");
                            $("#coordinatesNorthingField").parent().addClass("has-error");
                            throw new IllegalArgumentException();
                        }
                        else {
                            $("#coordinatesNorthingField + .text-danger").html("");
                            $("#coordinatesNorthingField").parent().removeClass("has-error");
                            Radio.trigger("Alert", "alert:remove");
                        }
                    });
            }

            else if (attributes.coordSystem === "WGS84(Dezimalgrad)") {
                _.each(attributes.coordinates[0].coord, function (value, key) {
                    if (attributes.coordinates[0].coord[key].length < 1) {
                        attributes.coordinates[0].ErrorMsg = "Bitte geben Sie ihren " + attributes.coordinates[0].key + " ein";
                        $("#coordinatesEastingField + .text-danger").html("");
                        $("#coordinatesEastingField").after("<span class='text-danger'><small>" + attributes.coordinates[0].ErrorMsg + "</small></span>");
                        $("#coordinatesEastingField").parent().addClass("has-error");
                    }
                    else if (!attributes.coordinates[0].coord[key].match(validWGS84_dez)) {
                        attributes.coordinates[0].ErrorMsg = "Die Eingabe für den " + attributes.coordinates[0].key + " ist nicht korrekt! (Beispiel: " + attributes.coordinates[0].example + ")";
                        $("#coordinatesEastingField + .text-danger").html("");
                        $("#coordinatesEastingField").after("<span class='text-danger'><small>" + attributes.coordinates[0].ErrorMsg + "</small></span>");
                        $("#coordinatesEastingField").parent().addClass("has-error");
                    }
                    else {
                        $("#coordinatesEastingField + .text-danger").html("");
                        $("#coordinatesEastingField").parent().removeClass("has-error");
                        Radio.trigger("Alert", "alert:remove");
                    }
                });
                _.each(attributes.coordinates[1].coord, function (value, key) {
                    if (attributes.coordinates[1].coord[key].length < 1) {
                        attributes.coordinates[1].ErrorMsg = "Bitte geben Sie ihren " + attributes.coordinates[1].key + " ein";
                        $("#coordinatesNorthingField + .text-danger").html("");
                        $("#coordinatesNorthingField").after("<span class='text-danger'><small>" + attributes.coordinates[1].ErrorMsg + "</small></span>");
                        $("#coordinatesNorthingField").parent().addClass("has-error");
                    }
                    else if (!attributes.coordinates[1].coord[key].match(validWGS84_dez)) {
                        attributes.coordinates[1].ErrorMsg = "Die Eingabe für den " + attributes.coordinates[1].key + " ist nicht korrekt! (Beispiel: " + attributes.coordinates[1].example + ")";
                        $("#coordinatesNorthingField + .text-danger").html("");
                        $("#coordinatesNorthingField").after("<span class='text-danger'><small>" + attributes.coordinates[1].ErrorMsg + "</small></span>");
                        $("#coordinatesNorthingField").parent().addClass("has-error");
                    }
                    else {
                        $("#coordinatesNorthingField + .text-danger").html("");
                        $("#coordinatesNorthingField").parent().removeClass("has-error");
                        Radio.trigger("Alert", "alert:remove");
                    }
                });

            }

            if (attributes.coordinates[0].ErrorMsg || attributes.coordinates[1].ErrorMsg) {
                return "Fehlerhafte Eingabe!";
            }
        },
        setStatus: function (args) {
            if (args[2].getId() === "searchByCoord") {
                this.set("isCollapsed", args[1]);
                this.set("isCurrentWin", args[0]);
            }
            else {
                this.set("isCurrentWin", false);
            }
        },
        setCoordSystem: function (value) {
            this.set("coordSystem", value);
        },
        setCoordinates: function (easting, northing) {
            var coordinateArray = [];

            if (this.get("coordSystem") === "WGS84") {
                var resultEasting = easting.split(/[\s]+/),
                resultNorthing = northing.split(/[\s]+/);
                this.set("eastingCoords", easting.split(/[\s°′″'"]+/));
                this.set("northingCoords", northing.split(/[\s°′″'"]+/));
                coordinateArray = [{"coord": resultEasting, "key": "Ostwert", "example": "9° 59′ 50″"}, {"coord": resultNorthing, "key": "Nordwert", "example": "53° 33′ 25″"}];
            }
            else if (this.get("coordSystem") === "WGS84(Dezimalgrad)") {
                var resultEasting = easting.split(/[\s]+/),
                resultNorthing = northing.split(/[\s]+/);

                this.set("eastingCoords", easting.split(/[\s°]+/));
                this.set("northingCoords", northing.split(/[\s°]+/));
                coordinateArray = [{"coord": resultEasting, "key": "Ostwert", "example": "10.01234°"},{"coord": resultNorthing, "key": "Nordwert", "example": "53.55555°"}];
            }
            else {
                coordinateArray = [{"coord": easting, "key": "Rechtswert", "example": "564459.13"}, {"coord": northing, "key": "Hochwert", "example": "5935103.67"}];
            }
            this.set("coordinates", coordinateArray);
            this.validateCoordinates();
        },
        validateCoordinates: function () {
            if (this.isValid()) {
                this.getNewCenter();
            }
        },
        getNewCenter: function () {

            if (this.get("coordSystem") === "WGS84") {
                var easting = (this.get("eastingCoords")[0] * 1) + (this.get("eastingCoords")[1] * 1 / 60) + (this.get("eastingCoords")[2] * 1 / 60 / 60),
                northing = (this.get("northingCoords")[0] * 1) + ((this.get("northingCoords")[1] * 1) / 60) + ((this.get("northingCoords")[2] * 1) / 60 / 60);

                this.set("newCenter", proj4(proj4("EPSG:4326"), proj4("EPSG:25832"), [easting, northing]));
                }
            else if (this.get("coordSystem") === "WGS84(Dezimalgrad)") {
               var easting = this.get("eastingCoords")[0],
                northing = this.get("northingCoords")[0];
                this.set("newCenter", proj4(proj4("EPSG:4326"), proj4("EPSG:25832"), [easting, northing]));
            }
            else if(this.get("coordSystem") === "ETRS89") {
                this.set("newCenter", [this.get("coordinates")[0].coord, this.get("coordinates")[1].coord]);
            }
            EventBus.trigger("mapHandler:zoomTo", {type: "SearchByCoord", coordinate: this.get("newCenter")});
        }
    });

    return new SearchByCoord();
});
