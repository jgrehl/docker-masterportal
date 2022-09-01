<style lang="scss">
    @import "~variables";
    /* using this classname to scope css effects; can not use scoped scss here since controls are not within scope, but added by jQuery */
    .backwards-compatibility-controls {
        /* use old styling way for icons for old controls */
        .bootstrap-icon {
            color: $white;
            background-color: $primary;
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
        }
        > .toggleButtonPressed {
            background-color: $light_blue;
        }
        /* forcing compatibility by overriding old-style layouting */
        .controls-row-right {
            position: relative;
            margin-right: 0;
            min-height: 0;
        }
        .row {
            margin-right: 0;
            margin-left: 0;

            > * {
                padding-right: 0;
                padding-left: 0;
            }
        }
        > div {
            padding: 5px;
            > div {
                margin-top: 0;
            }
        }
    }
</style>
