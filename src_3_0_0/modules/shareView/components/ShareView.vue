<script>
import {mapActions, mapGetters, mapMutations} from "vuex";
import getters from "../store/gettersShareView";
import mutations from "../store/mutationsShareView";
import QRCode from "qrcode";

/**
 * Tool to switch the scale of the map. Listens to changes of the map's scale and sets the scale to this value.
 */
export default {
    name: "ShareView",
    data () {
        return {
            qrDataUrl: null
        };
    },
    computed: {
        ...mapGetters("Modules/ShareView", Object.keys(getters)),
        ...mapGetters("Maps", ["getView"]),
        ...mapActions("Modules/ShareView", ["createUrlParams"]),
        ...mapGetters(["visibleLayerConfigs", "isMobile"])
    },
    watch: {
        /**
         * Prepares the Url that can be copied and sets focus.
         * @param {Boolean} isActive - if active or not
         * @returns {void}
         */
        active (isActive) {
            debugger;
            if (isActive) {
                this.createUrlParams();
            }
        }
    },
    created () {
        // this.createUrlParams();
    },
    methods: {
        ...mapMutations("Tools/ShareView", Object.keys(mutations)),

        async share () {
            const shareData = {
                title: "Masterportal",
                text: "Schau mal!",
                url: "https://developer.mozilla.org"
            };

            try {
                await navigator.share(shareData);
            }
            catch (err) {
                // console.log(`Error: ${err}`);
            }
        },
        /**
         * Generates an qr code for the given coordinates with the configured url schema
         * @param {Number[]} coordinates An array with two entries for longitude and latitude coordinates in EPSG:25832
         * @returns {void}
         */
        generateQRCodeDataURL () {
            const url = "www.google.com";

            QRCode.toDataURL(url).then((qrDataUrl) => {
                this.qrDataUrl = qrDataUrl;
            });
        },
        downloadQr () {
            const link = document.createElement("a");

            document.body.appendChild(link);
            link.download = "qrCode.jpg";
            link.href = this.qrDataUrl;
            link.target = "_blank";
            link.click();
        }
    }
};
</script>

<template lang="html">
    <div class="start-btn">
        <h2>Diese Karte teilen via..</h2>
        <div v-if="isMobile">
            <button
                class="btn btn-primary"
                @click="share"
            >
                <i class="bi-share" />
                Teilen
            </button>
        </div>
        <div
            v-else
            class="row"
        >
            <div class="col-12">
                <a
                    aria-label="Auf Twitter teilen"
                    class="btn btn-primary"
                    href="https://twitter.com/share?url=google.com&text=GoogleHiervia=<USERNAME>"
                >
                    <i class="bi-twitter" />
                </a>
                Auf Twitter teilen
            </div>
            <div class="col-12">
                <a
                    aria-label="Auf Facebook teilen"
                    class="btn btn-primary"
                    href="https://www.facebook.com/sharer/sharer.php?u=google.com"
                >
                    <i class="bi-facebook" />
                </a>
                Auf Facebook teilen
            </div>
            <div class="col-12">
                <a
                    aria-label="Link kopieren"
                    class="btn btn-primary"
                    href="https://www.facebook.com/sharer/sharer.php?u=google.com"
                >
                    <i class="bi-link" />
                </a>
                Den Link kopieren
            </div>
            <div class="col-12">
                <button
                    aria-label="QR Code erstellen"
                    class="btn btn-primary"
                    @click="generateQRCodeDataURL"
                >
                    <i class="bi-qr-code" />
                </button>
                Einen QRCode erstellen
            </div>
            <div
                v-if="qrDataUrl"
            >
                <img
                    alt="qr Code"
                    id="qrCodeImg"
                    :src="qrDataUrl"
                >
                <button
                    class="btn btn-primary"
                    @click="downloadQr"
                >
                    QRCode herunterladen</a>
                </button>
            </div>
            <div class="form-group form-group-sm">
                <label for="tool-saveSelection-input-url">Test URL</label>
                <input
                    id="tool-saveSelection-input-url"
                    ref="tool-saveSelection-input-url"
                    type="text"
                    class="form-control form-control-sm"
                    :value="url"
                >
            </div>
        </div>
    </div>
</template>


<style lang="scss" scoped>
    @import "~/css/mixins.scss";
    @import "~variables";

.start-btn {
    z-index: 10;
    background-color: white;
    height: 500px;
    width: 300px;

}
</style>
