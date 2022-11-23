<script>
import {mapGetters, mapMutations} from "vuex";
import mutations from "../store/mutationsShareView";
import QRCode from "qrcode";

/**
 * Tool to share a view via link to twitter, facebook, qrCode or copy the link as well as any other app on mobile.
 */
export default {
    name: "ShareView",
    data () {
        return {
            qrDataUrl: null
        };
    },
    computed: {
        ...mapGetters("Modules/ShareView", ["active", "url"]),
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
            return "https://twitter.com/share?url=" + this.url + "&text=" + this.$t("modules.tools.shareView.myMap");
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
                title: this.$t("modules.tools.shareView.myMap"),
                text: this.$t("modules.tools.shareView.myMap"),
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
    <div
        v-if="active"
        id="share-view"
    >
        <h2>{{ $t("modules.tools.shareView.shareHeadline") }}</h2>
        <div v-if="isMobile">
            <button
                aria-label="$t('modules.tools.shareView.share')"
                class="btn btn-primary"
                @click="share"
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
                    id="twitter-btn"
                    aria-label="$t('modules.tools.shareView.shareTwitter')"
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
                    id="facebook-btn"
                    aria-label="$t('modules.tools.shareView.shareFacebook')"
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
                    id="copy-btn"
                    aria-label="$t('modules.tools.shareView.shareLink')"
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
                    aria-label="$t('modules.tools.shareView.shareQR') "
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
                    aria-label="$t('modules.tools.shareView.downloadQR')"
                    class="btn btn-primary"
                    @click="downloadQr"
                >
                    {{ $t("modules.tools.shareView.downloadQR") }}
                </button>
            </div>
        </div>
    </div>
</template>
