define(function () {

    var Model = Backbone.Model.extend({
        defaults: {
            value: "",
            type: ""
        },
        // setter for value
        setValue: function (value) {
            this.set("value", value);
        },

        setIsSelected: function (value) {
            this.set("isSelected", value);
        },
        getDisplayString: function () {
            var displayString = "";

            switch (this.get("type")) {
                case "boolean": {
                    displayString = this.get("attr");
                    break;
                }
                case "searchInMapExtent": {
                    displayString = "Kartenausschnitt";
                }
                default: {
                    displayString += this.get("value");
                }
            }
            return displayString;
        }
    });

    return Model;
});
