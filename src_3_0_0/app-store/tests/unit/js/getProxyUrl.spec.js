import {expect} from "chai";
import sinon from "sinon";
import {getProxyUrl, updateProxyUrl} from "../../../js/getProxyUrl";


describe("src_3_0_0/app-store/js/getProxyUrl.js", () => {
    beforeEach(() => {
        sinon.stub(console, "warn");
    });

    describe("getProxyUrl", () => {
        it("should generate key without hostname from url", function () {

            expect(getProxyUrl("https://dies.ist.ein.test/PFAD_ZU_TEST-QUELLE")).to.be.equal("/dies_ist_ein_test/PFAD_ZU_TEST-QUELLE");
        });

        it("should generate key with hostname from url", function () {
            const url = "https://dies.ist.ein.test/PFAD_ZU_TEST-QUELLE",
                proxyHost = "https://test-proxy.example.com";

            expect(getProxyUrl(url, proxyHost)).to.be.equal("https://test-proxy.example.com/dies_ist_ein_test/PFAD_ZU_TEST-QUELLE");
        });
        it("shouldn't transform url for local resources I", function () {
            const url = "http://localhost/test.json",
                proxyHost = "https://test-proxy.example.com";

            expect(getProxyUrl(url, proxyHost)).to.be.equal("http://localhost/test.json");
        });
        it("shouldn't transform url for local resources II", function () {
            const url = "./test.json",
                proxyHost = "https://test-proxy.example.com";

            expect(getProxyUrl(url, proxyHost)).to.be.equal("./test.json");
        });
    });

    describe("updateProxyUrl", () => {
        it("replaces the url if useProxy is set in object", function () {
            const testproxyObject = {
                url: "https://test.proxyurl.de/folder/",
                useProxy: true,
                fetchBroadcastUrl: "./resources/newsFeedPortalAlerts.json"
            };

            updateProxyUrl(testproxyObject);

            expect(testproxyObject.url).to.be.equal("/test_proxyurl_de/folder/");
        });
        it("replaces the upperCase url if useProxy is set in object", function () {
            const testproxyObject = {
                url: "https://test.proxyURL.de/folder/",
                useProxy: true,
                fetchBroadcastUrl: "./resources/newsFeedPortalAlerts.json"
            };

            updateProxyUrl(testproxyObject);

            expect(testproxyObject.url).to.be.equal("/test_proxyurl_de/folder/");
        });
        it("replaces the url if useProxy is set in nested array", function () {
            const testproxyObject = {
                testproxyArray: [{url: "https://test.proxyurl.de/folder/", useProxy: true}, "string", "string2"]
            };

            updateProxyUrl(testproxyObject);

            expect(testproxyObject.testproxyArray[0].url).to.be.equal("/test_proxyurl_de/folder/");
        });
    });
});
