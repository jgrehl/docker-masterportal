define([

    "config",
    "eventbus"
], function (Config, EventBus) {

        var Window = Backbone.Model.extend({
            defaults: {
                isCollapsed: false,
                isVisible: false,
                maxPosLeft: "",
                maxPosTop: "10px"
            },
            initialize: function () {
                EventBus.on("closeWindow", this.setVisible, this);
                EventBus.on("collapseWindow", this.collapseWindow, this);
                EventBus.on("uncollapseWindow", this.uncollapseWindow, this);
                var channel = Radio.channel("Window");

                channel.on({
                    "toggleWin": this.setParams,
                    "closeWin": this.setVisible,
                    "CollapseWin": this.collapseWindow,
                    "uncollapseWin": this.uncollapseWindow
                }, this);
            },
            collapseWindow: function () {
                this.setCollapse(true);
            },
            uncollapseWindow: function () {
                this.setCollapse(false);
            },
            setCollapse: function (value) {
                this.set("isCollapsed", value);
            },
            setVisible: function (value) {
                this.set("isVisible", value);
            },
            setParams: function (value) {
                this.setTool(value);
                this.set("title", value.getName());
                this.set("icon", value.getGlyphicon());
                this.set("winType", value.getId());
                if (value.getId() === "coord" || value.getId() === "gfi") {
                    this.set("isVisible", false);
                }
                else {
                    this.set("isVisible", true);
                }
            },
            sendParamsToWinCotent: function () {
                Radio.trigger("Window", "winParams", [this.get("isVisible"), this.get("isCollapsed"), this.getTool()]);
            },
            setTool: function (value) {
                this.set("tool", value);
            },
            getTool: function () {
                return this.get("tool");
            }
        });

        return new Window();
    }
);
