<script>
import {mapGetters, mapMutations} from "vuex";
import mutations from "../store/mutationsShareView";
import QRCode from "qrcode";
import FlatButton from "../../../shared/components/FlatButton.vue";

/**
 * Tool to share a view via link to twitter, facebook, qrCode or copy the link as well as any other app on mobile.
 */
export default {
    name: "ShareView",
    components: {FlatButton},
    data () {
        return {
            qrDataUrl: null,
            qrIcon: "bi-qr-code",
            downloadIcon: "bi-download",
            linkIcon: "bi-link"
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
                class="btn btn-secondary btn-icon"
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
                    class="btn btn-secondary btn-icon mb-3"
                    :href="twitter"
                    target="_blank"
                    role="button"
                >
                    <i class="bi-twitter" />
                    {{ $t("modules.tools.shareView.shareTwitter") }}
                </a>
            </div>
            <div class="col-12">
                <a
                    id="facebook-btn"
                    aria-label="$t('modules.tools.shareView.shareFacebook')"
                    class="btn btn-secondary btn-icon mb-3"
                    :href="facebook"
                    target="_blank"
                    role="button"
                >
                    <i class="bi-facebook" />
                    {{ $t("modules.tools.shareView.shareFacebook") }}
                </a>
            </div>
            <div class="col-12">
                <FlatButton
                    id="copy-btn"
                    aria-label="$t('modules.tools.shareView.shareLink')"
                    :interaction="copyToClipboard"
                    :text="$t('modules.tools.shareView.shareLink')"
                    :icon="linkIcon"
                />
            </div>
            <div class="col-12">
                <FlatButton
                    id="qr-btn"
                    aria-label="$t('modules.tools.shareView.shareQR')"
                    :interaction="generateQRCodeDataURL"
                    :text="$t('modules.tools.shareView.shareQR')"
                    :icon="qrIcon"
                />
            </div>
            <div
                v-if="qrDataUrl"
            >
                <img
                    id="qrCodeImg"
                    alt="qr Code"
                    :src="qrDataUrl"
                >
                <FlatButton
                    aria-label="$t('modules.tools.shareView.downloadQR')"
                    :interaction="downloadQr"
                    :text="$t('modules.tools.shareView.downloadQR')"
                    :icon="downloadIcon"
                />
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "~variables";

</style>
