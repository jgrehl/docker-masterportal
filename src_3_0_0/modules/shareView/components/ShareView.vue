<script>
import {mapGetters, mapMutations} from "vuex";
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
        ...mapGetters("Modules/ShareView", ["url"]),
        ...mapGetters("Maps", ["getView"]),
        ...mapGetters(["visibleLayerConfigs", "isMobile"]),

        /**
         * Generates the link for facebook.
         * @returns {String} url with params
         */
        facebook () {
            return "https://www.facebook.com/sharer/sharer.php?u=" + this.url;
        },

        /**
         * Generates the link for twitter.
         * @returns {String} url with params
         */
        twitter () {
            return "https://twitter.com/share?url=" + this.url + "&text=Meine Karte: ";
        }
    },
    methods: {
        ...mapMutations("Modules/ShareView", Object.keys(mutations)),

        /**
         * Shares the link on a mobile device.
         * @returns {void}
         */
        share () {
            const shareData = {
                title: "Masterportal",
                text: "Schau mal!",
                url: this.url
            };

            navigator.share(shareData)
                .catch((err) => {
                    console.error(`Error: ${err}`);
                });
        },
        /**
         * Generates a qrCode for the given url.
         * @returns {void}
         */
        generateQRCodeDataURL () {
            const url = this.url;

            QRCode.toDataURL(url).then((qrDataUrl) => {
                this.qrDataUrl = qrDataUrl;
            });
        },
        /**
         * Downloads the qrCode.
         * @returns {void}
         */
        downloadQr () {
            const link = document.createElement("a");

            document.body.appendChild(link);
            link.download = "qrCode.jpg";
            link.href = this.qrDataUrl;
            link.target = "_blank";
            link.click();
        },
        /**
         * Lets you copy the url to the clipboard.
         * ToDo: add "link copied" Hinweis
         * @returns {void}
         */
        copyToClipboard () {
            navigator.clipboard.writeText(this.url);
        }
    }
};
</script>

<template lang="html">
    <div id="share-view">
        <h2>{{ $t("modules.tools.shareView.shareHeadline") }}</h2>
        <div v-if="isMobile">
            <button
                class="btn btn-primary"
                @click="share1"
            >
                <i class="bi-share" />
                {{ $t("modules.tools.shareView.share") }}
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
                    :href="twitter"
                    target="_blank"
                >
                    <i class="bi-twitter" />
                    {{ $t("modules.tools.shareView.shareTwitter") }}
                </a>
            </div>
            <div class="col-12">
                <a
                    aria-label="Auf Facebook teilen"
                    class="btn btn-primary"
                    :href="facebook"
                    target="_blank"
                >
                    <i class="bi-facebook" />
                    {{ $t("modules.tools.shareView.shareFacebook") }}
                </a>
            </div>
            <div class="col-12">
                <button
                    aria-label="Link kopieren"
                    class="btn btn-primary"
                    @click="copyToClipboard"
                >
                    <i class="bi-link" />
                    {{ $t("modules.tools.shareView.shareLink") }}
                </button>
            </div>
            <div class="col-12">
                <button
                    id="qr-btn"
                    aria-label="QR Code erstellen"
                    class="btn btn-primary"
                    @click="generateQRCodeDataURL"
                >
                    <i class="bi-qr-code" />
                    {{ $t("modules.tools.shareView.shareQR") }}
                </button>
            </div>
            <div
                v-if="qrDataUrl"
            >
                <img
                    id="qrCodeImg"
                    alt="qr Code"
                    :src="qrDataUrl"
                >
                <button
                    class="btn btn-primary"
                    @click="downloadQr"
                >
                    {{ $t("modules.tools.shareView.downloadQR") }}
                </button>
            </div>
        </div>
    </div>
</template>
