define(function (require) {
    var Template = require("text!modules/snippets/slider/template.html"),
        SliderView;

    require("slider");

    SliderView = Backbone.View.extend({
        events: {
            // This event fires when the dragging stops or has been clicked on
            "slideStop input.slider": function (evt) {
                this.model.updateValues(evt.value);
                this.setInputControlValue(evt);
            },
            // This event fires when the slider is dragged
            "slide input.slider": "setInputControlValue",
            // This event is fired when the info button is clicked
            "click .info-icon": "toggleInfoText",
            // This event fires if key up
            "keyup .form-control": "checkWhichKeyUp"
        },

        initialize: function () {
            this.listenTo(this.model, {
                "render": this.render
            });
        },

        className: "slider-container",
        template: _.template(Template),

        render: function () {
            var attr = this.model.toJSON();

            this.$el.html(this.template(attr));
            this.initSlider();
            return this.$el;
        },

        /**
         * init the slider
         * @returns {void}
         */
        initSlider: function () {
            var valueModel = this.model.get("valueCollection").models[0];

            this.$el.find("input.slider").slider({
                min: valueModel.get("min"),
                max: valueModel.get("max"),
                step: 1,
                value: valueModel.value
            });
        },

        /**
         * set the input value
         * @param {Event} evt - slide
         * @returns {void}
         */
        setInputControlValue: function (evt) {
            this.$el.find("input.form-control").val(evt.value);
        },

        /**
         * set the input values
         * @param {array} values - contains minimum and maximum
         * @returns {void}
         */
        setInputMinAndMaxValue: function (values) {
            this.$el.find("input.form-minimum").val(values[0]);
            this.$el.find("input.form-maximum").val(values[1]);
        },

        /**
         * toggle the info text
         * @returns {void}
         */
        toggleInfoText: function () {
            this.model.trigger("hideAllInfoText");
            this.$el.find(".info-text").toggle();
        },

        /**
         * check which key is up
         * @param {event} event - key up
         * @returns {void}
         */
        checkWhichKeyUp: function (event) {
            if (event.keyCode === 13) {
                this.changeValuesByText();
            }
            else {
                this.changeSizeOfInputFiled(event);
            }
        },

        /**
         * change the values by input from inputfields
         * render change if enter is pressed
         * @returns {void}
         */
        changeValuesByText: function () {
            var min,
                max,
                initValues,
                values,
                lastValues;

            min = this.$el.find("input.form-minimum").prop("value");
            max = this.$el.find("input.form-maximum").prop("value");
            initValues = this.model.getValuesCollection().pluck("initValue");

            // check if input is allowed
            if (min === "" && max !== "") {
                max = this.checkInvalidInput(this.parseValue(max), initValues[1]);
                min = initValues[0];
            }
            else if (min !== "" && max === "") {
                min = this.checkInvalidInput(this.parseValue(min), initValues[0]);
                max = initValues[1];
            }
            else {
                lastValues = this.model.getValuesCollection().pluck("value");

                min = this.checkInvalidInput(this.parseValue(min), lastValues[0]);
                max = this.checkInvalidInput(this.parseValue(max), lastValues[1]);
            }

            values = [min, max];
            values.sort(function (a, b) {
                return a - b;
            });

            this.model.updateValues(values);
            this.setInputMinAndMaxValue(values);
        },

        /**
         * converts number to integer or decimal by type
         * @param {number} inputValue - input value
         * @returns {void} value
         */
        parseValue: function (inputValue) {
            var value = inputValue,
                type = this.model.getSelectedValues().type;

            if (type === "integer") {
                value = parseInt(value, 10);
            }
            else if (type === "decimal") {
                value = parseFloat(value);
            }

            return value;
        },

        /**
         * check if value is valid parameter or set value to initValue
         * @param {number} value - input value
         * @param {number} otherValue - value that be set if param value NaN
         * @returns {number} val
         */
        checkInvalidInput: function (value, otherValue) {
            var val = value;

            if (_.isNaN(val)) {
                val = otherValue;
                this.errorMessage();
            }

            return val;
        },

        /**
         * returns an error message for invalid inputs
         * @returns {void}
         */
        errorMessage: function () {
            Radio.trigger("Alert", "alert", {
                text: "<strong>Fehlerhafte Eingabe,"
                    + " Bitte eine ganze Zahl eingeben!</strong>",
                kategorie: "alert-danger"
            });
        },

        /**
         * change size from input field
         * @param {event} event - key up
         * @returns {void}
         */
        changeSizeOfInputFiled: function (event) {
            var defaultWidth = this.model.get("defaultWidth"),
                padding = parseInt(this.$(".form-control").css("padding").split("px")[1], 10),
                fontSize = parseInt(this.$(".form-control").css("font-size").split("px")[0], 10),
                buffer = 3,
                width = padding + fontSize + buffer,
                targetClass = this.chooseInputFiled(event.target.className);

            // get the default width for input field
            if (_.isUndefined(defaultWidth)) {
                defaultWidth = parseInt(this.$(".form-control").css("width").split("px")[0], 10);
                this.model.setDefaultWidth(defaultWidth);
            }

            // add a temporary span to get width from input text
            this.$(".form-inline").append("<span class='hiddenSpan'>" + event.target.value + "</span>");
            this.$(".hiddenSpan").text(this.$(targetClass).val());
            width = this.$(".hiddenSpan").width() + width;

            if (width > defaultWidth) {
                this.$(targetClass).css("width", width + "px");
            }
            else {
                this.$(targetClass).css("width", defaultWidth + "px");
            }
            this.$(".hiddenSpan").remove();
        },

        /**
         *  check which input field is used
         * @param {String} className - classes from input field
         * @returns {String} targetClass
         */
        chooseInputFiled: function (className) {
            var targetClass = "";

            if (className.includes("form-maximum")) {
                targetClass = ".form-maximum";
            }
            else if (className.includes("form-minimum")) {
                targetClass = ".form-minimum";
            }

            return targetClass;
        }
    });

    return SliderView;
});
