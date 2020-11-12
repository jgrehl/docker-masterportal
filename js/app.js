import Vue from "vue";
import VueI18Next from "@panter/vue-i18next";
import App from "../src/App.vue";
import store from "../src/app-store";
import loadAddons from "../src/addons";
import RestReaderList from "../modules/restReader/collection";
import Autostarter from "../modules/core/autostarter";
import Util from "../modules/core/util";
import StyleList from "../modules/vectorStyle/list";
import Preparser from "../modules/core/configLoader/preparser";
import ParametricURL from "../modules/core/parametricURL";
import Map from "../modules/core/map";
import AddGeoJSON from "../modules/tools/addGeoJSON/model";
import WPS from "../modules/core/wps";
import RemoteInterface from "../modules/remoteInterface/model";
import RadioMasterportalAPI from "../modules/remoteInterface/radioMasterportalAPI";
import CswParserModel from "../modules/cswParser/model";
import WFSTransactionModel from "../modules/wfsTransaction/model";
import GraphModel from "../modules/tools/graph/model";
import ColorScale from "../modules/tools/colorScale/model";
import MenuLoader from "../modules/menu/menuLoader";
import ZoomToGeometry from "../modules/zoomToGeometry/model";
import ZoomToFeature from "../modules/zoomToFeature/model";
import FeatureViaURL from "../modules/featureViaURL/model";
import SliderView from "../modules/snippets/slider/view";
import SliderRangeView from "../modules/snippets/slider/range/view";
import DropdownView from "../modules/snippets/dropdown/view";
import LayerinformationModel from "../modules/layerInformation/model";
import ClickCounterModel from "../modules/clickCounter/model";
import MouseHoverPopupView from "../modules/mouseHover/view";
import QuickHelpView from "../modules/quickHelp/view";
import WindowView from "../modules/window/view";
import SidebarView from "../modules/sidebar/view";
import MeasureView from "../modules/tools/measure/view";
import ShadowView from "../modules/tools/shadow/view";
import ParcelSearchView from "../modules/tools/parcelSearch/view";
import SearchByCoordView from "../modules/tools/searchByCoord/view";
import LineView from "../modules/tools/pendler/lines/view";
import AnimationView from "../modules/tools/pendler/animation/view";
import FilterView from "../modules/tools/filter/view";
import SaveSelectionView from "../modules/tools/saveSelection/view";
import StyleWMSView from "../modules/tools/styleWMS/view";
import StyleVTView from "../modules/tools/styleVT/view";
import LayerSliderView from "../modules/tools/layerSlider/view";
import CompareFeaturesView from "../modules/tools/compareFeatures/view";
import RemoteInterfaceVue from "../src/plugins/remoteInterface/RemoteInterface";

/**
 * WFSFeatureFilterView
 * @deprecated in 3.0.0
 */
import WFSFeatureFilterView from "../modules/wfsFeatureFilter/view";
/**
 * ExtendedFilterView
 * @deprecated in 3.0.0
 */
import ExtendedFilterView from "../modules/tools/extendedFilter/view";
import AddWMSView from "../modules/tools/addWMS/view";
import RoutingView from "../modules/tools/viomRouting/view";
import Contact from "../modules/tools/contact/view";
import TreeFilterView from "../modules/treeFilter/view";
import FeatureLister from "../modules/tools/featureLister/view";
import PrintView from "../modules/tools/print_/view";
/**
 * PrintView2
 * @deprecated in 3.0.0
 * remove "version" in doc and config.
 * rename "print_" to "print"
 * only load PrintView
 */
import PrintView2 from "../modules/tools/print/view";
import WfstView from "../modules/tools/wfst/view";
// controls
import ControlsView from "../modules/controls/view";
import OrientationView from "../modules/controls/orientation/view";
import MapMarkerView from "../modules/mapMarker/view";
import SearchbarView from "../modules/searchbar/view";
import HighlightFeature from "../modules/highlightFeature/model";
import Button3DView from "../modules/controls/button3d/view";
import ButtonObliqueView from "../modules/controls/buttonOblique/view";
import Orientation3DView from "../modules/controls/orientation3d/view";
import VirtualcityModel from "../modules/tools/virtualCity/model";
import SelectFeaturesView from "../modules/tools/selectFeatures/view";

let sbconfig,
    controls,
    controlsView;

/* eslint-disable no-process-env */
if (process.env.NODE_ENV === "development") {
    Vue.config.devtools = true;
}

/**
 * load the configuration of master portal
 * @return {void}.
 */
async function loadApp () {
    /* eslint-disable no-undef */
    const legacyAddons = Object.is(ADDONS, {}) ? {} : ADDONS,
        utilConfig = {},
        layerInformationModelSettings = {},
        cswParserSettings = {},
        mapMarkerConfig = Config.hasOwnProperty("mapMarker") ? Config.mapMarker : {},
        style = Radio.request("Util", "getUiStyle");
    /* eslint-disable no-undef */
    let app = {},
        searchbarAttributes = {};

    if (Config.hasOwnProperty("uiStyle")) {
        utilConfig.uiStyle = Config.uiStyle.toUpperCase();
    }
    if (Config.hasOwnProperty("proxyHost")) {
        utilConfig.proxyHost = Config.proxyHost;
    }
    if (Config.hasOwnProperty("proxy")) {
        utilConfig.proxy = Config.proxy;
    }

    // RemoteInterface laden
    if (Config.hasOwnProperty("remoteInterface")) {
        new RemoteInterface(Config.remoteInterface);
        new RadioMasterportalAPI();
        Vue.use(RemoteInterfaceVue, Config.remoteInterface);
    }

    if (Config.hasOwnProperty("quickHelp")) {
        new QuickHelpView(Config.quickHelp);
    }

    // import and register Vue addons according the config.js
    await loadAddons(Config.addons);

    Vue.config.productionTip = false;

    store.commit("setConfigJs", Config);

    Vue.use(VueI18Next);

    app = new Vue({
        el: "#masterportal-root",
        name: "VueApp",
        render: h => h(App),
        store,
        i18n: new VueI18Next(i18next, {namespaces: ["additional", "common"]})
    });


    // Core laden
    new Autostarter();
    new Util(utilConfig);
    // Pass null to create an empty Collection with options
    new RestReaderList(null, {url: Config.restConf});
    new Preparser(null, {url: Config.portalConf});


    new StyleList();
    if (!Config.hasOwnProperty("allowParametricURL") || Config.allowParametricURL === true) {
        new ParametricURL();
    }
    new Map(Radio.request("Parser", "getPortalConfig").mapView);
    new WPS();
    new AddGeoJSON();
    new WindowView();

    app.$mount();

    if (Config.hasOwnProperty("cswId")) {
        cswParserSettings.cswId = Config.cswId;
    }

    new CswParserModel(cswParserSettings);
    new GraphModel();
    new WFSTransactionModel();
    new MenuLoader();
    new ColorScale();

    if (Config.hasOwnProperty("zoomToGeometry")) {
        new ZoomToGeometry(Config.zoomToGeometry);
    }
    if (Config.hasOwnProperty("zoomToFeature")) {
        new ZoomToFeature(Config.zoomToFeature);
    }
    if (Config.hasOwnProperty("featureViaURL")) {
        new FeatureViaURL(Config.featureViaURL);
    }

    new SliderView();
    new SliderRangeView();
    new DropdownView();

    if (Config.hasOwnProperty("metaDataCatalogueId")) {
        layerInformationModelSettings.metaDataCatalogueId = Config.metaDataCatalogueId;
    }
    new LayerinformationModel(layerInformationModelSettings);

    if (Config.hasOwnProperty("footer")) {
        // new FooterView(Config.footer);
    }

    if (Config.hasOwnProperty("clickCounter") && Config.clickCounter.hasOwnProperty("desktop") && Config.clickCounter.desktop !== "" && Config.clickCounter.hasOwnProperty("mobile") && Config.clickCounter.mobile !== "") {
        new ClickCounterModel(Config.clickCounter.desktop, Config.clickCounter.mobile, Config.clickCounter.staticLink);
    }

    if (Config.hasOwnProperty("mouseHover")) {
        new MouseHoverPopupView(Config.mouseHover);
    }

    // Module laden
    // Tools
    new SidebarView();

    Radio.request("ModelList", "getModelsByAttributes", {type: "tool"}).forEach(tool => {
        switch (tool.id) {
            case "compareFeatures": {
                new CompareFeaturesView({model: tool});
                break;
            }
            case "lines": {
                new LineView({model: tool});
                break;
            }
            case "animation": {
                new AnimationView({model: tool});
                break;
            }
            case "filter": {
                new FilterView({model: tool});
                break;
            }
            case "shadow": {
                new ShadowView({model: tool});
                break;
            }
            case "measure": {
                new MeasureView({model: tool});
                break;
            }
            case "print": {
                /**
                 * PrintView2
                 * @deprecated in 3.0.0
                 * remove "version" in doc and config.
                 * rename "print_" to "print"
                 * only load correct view
                 */
                if (tool.has("version") && (tool.get("version") === "mapfish_print_3" || tool.get("version") === "HighResolutionPlotService")) {
                    new PrintView({model: tool});
                }
                else {
                    new PrintView2({model: tool});
                }
                break;
            }
            case "parcelSearch": {
                new ParcelSearchView({model: tool});
                break;
            }
            case "searchByCoord": {
                new SearchByCoordView({model: tool});
                break;
            }
            case "saveSelection": {
                new SaveSelectionView({model: tool});
                break;
            }
            /**
             * wfsFeatureFilter
             * @deprecated in 3.0.0
             */
            case "wfsFeatureFilter": {
                new WFSFeatureFilterView({model: tool});
                break;
            }
            /**
             * extendedFilter
             * @deprecated in 3.0.0
             */
            case "extendedFilter": {
                new ExtendedFilterView({model: tool});
                break;
            }
            case "treeFilter": {
                new TreeFilterView({model: tool});
                break;
            }
            case "routing": {
                new RoutingView({model: tool});
                break;
            }
            case "contact": {
                new Contact({model: tool});
                break;
            }
            case "addWMS": {
                new AddWMSView({model: tool});
                break;
            }
            case "featureLister": {
                new FeatureLister({model: tool});
                break;
            }
            case "styleWMS": {
                new StyleWMSView({model: tool});
                break;
            }
            case "wfst": {
                new WfstView({model: tool});
                break;
            }
            case "styleVT": {
                new StyleVTView({model: tool});
                break;
            }
            /**
             * layerslider
             * @deprecated in 3.0.0
             */
            case "layerslider": {
                new LayerSliderView({model: tool});
                break;
            }
            case "layerSlider": {
                new LayerSliderView({model: tool});
                break;
            }
            case "virtualCity": {
                new VirtualcityModel(tool.attributes);
                break;
            }
            case "selectFeatures": {
                new SelectFeaturesView({model: tool});
                break;
            }
            default: {
                break;
            }
        }
    });

    if (!style || style !== "SIMPLE") {
        controls = Radio.request("Parser", "getItemsByAttributes", {type: "control"});
        controlsView = new ControlsView();

        controls.forEach(control => {
            const orientationConfigAttr = typeof control.attr === "string" ? {zoomMode: control.attr} : control;
            let element;

            switch (control.id) {
                case "orientation": {
                    element = controlsView.addRowTR(control.id, true);
                    orientationConfigAttr.epsg = Radio.request("MapView", "getProjection").getCode();
                    new OrientationView({el: element, config: orientationConfigAttr});
                    break;
                }
                case "button3d": {
                    if (control.attr === true) {
                        element = controlsView.addRowTR(control.id);
                        new Button3DView({el: element});
                    }
                    break;
                }
                case "buttonOblique": {
                    if (control.attr === true) {
                        element = controlsView.addRowTR(control.id);
                        new ButtonObliqueView({el: element});
                    }
                    break;
                }
                case "orientation3d": {
                    if (control.attr === true) {
                        element = controlsView.addRowTR(control.id);
                        new Orientation3DView({el: element});
                    }
                    break;
                }
                default: {
                    break;
                }
            }
        });
    }

    new MapMarkerView(mapMarkerConfig);

    searchbarAttributes = Radio.request("Parser", "getItemsByAttributes", {type: "searchBar"})[0].attr;
    sbconfig = Object.assign({}, Config.hasOwnProperty("quickHelp") ? {quickHelp: Config.quickHelp} : {});
    sbconfig = Object.assign(sbconfig, searchbarAttributes);

    if (searchbarAttributes !== undefined && sbconfig) {
        new SearchbarView(sbconfig);
    }

    new HighlightFeature();

    if (Config.addons !== undefined) {
        Radio.channel("Addons");
        const i18nextLanguages = i18next && i18next.options.hasOwnProperty("getLanguages") ? i18next.options.getLanguages() : {};
        let initCounter = 0;

        Config.addons.forEach((addonKey) => {
            if (legacyAddons[addonKey] !== undefined) {
                initCounter++;
            }
        });

        initCounter = initCounter * Object.keys(i18nextLanguages).length;

        // loads all language files from addons for backbone- and vue-addons
        Config.addons.forEach((addonKey) => {
            if (legacyAddons[addonKey] !== undefined) {
                Object.keys(i18nextLanguages).forEach((lng) => {
                    import(
                        /* webpackChunkName: "additionalLocales" */
                        /* webpackInclude: /[\\\/]additional.json$/ */
                        `../addons/${addonKey}/locales/${lng}/additional.json`)
                        .then(({default: additionalLocales}) => {
                            i18next.addResourceBundle(lng, "additional", additionalLocales, true);
                            initCounter--;
                            checkInitCounter(initCounter, legacyAddons);
                        }).catch(error => {
                            initCounter--;
                            console.warn(error);
                            console.warn("Translation files of addon " + addonKey + " could not be loaded or does not exist. Addon is not translated.");
                            checkInitCounter(initCounter, legacyAddons);
                        });
                });
            }
        });
    }

    Radio.trigger("Util", "hideLoader");
}

/**
 * Checks if all addons are initialized.
 * @param {Number} initCounter init counter
 * @param {Object} legacyAddons all addons from the config.js
 * @returns {void}
 */
function checkInitCounter (initCounter, legacyAddons) {
    if (initCounter === 0) {
        Radio.trigger("Addons", "initialized");
        loadAddOnsAfterLanguageLoaded(legacyAddons);
        store.commit("setI18Nextinitialized", true);
    }
}

/**
 * Loads AddOns after the language is loaded
 * @param {Object} legacyAddons all addons from the config.js
 * @returns {void}
 */
function loadAddOnsAfterLanguageLoaded (legacyAddons) {
    Config.addons.forEach((addonKey) => {
        if (legacyAddons[addonKey] !== undefined) {
            // .js need to be removed so we can specify specifically in the import statement that
            // webpack only searches for .js files
            const entryPoint = legacyAddons[addonKey].replace(/\.js$/, "");

            import(
                /* webpackChunkName: "[request]" */
                /* webpackInclude: /addons[\\\/].*[\\\/]*.js$/ */
                /* webpackExclude: /(node_modules)|(.+unittests.)+/ */
                "../addons/" + entryPoint + ".js").then(module => {
                /* eslint-disable new-cap */
                let addon;

                try {
                    addon = new module.default();
                }
                catch (err) {
                    // cannot load addon, is maybe a Vue addon
                    return;
                }

                // addons are initialized with 'new Tool(attrs, options);', that produces a rudimental model. Now the model must be replaced in modellist:
                if (addon.model) {
                    // set this special attribute, because it is the only one set before this replacement
                    const model = Radio.request("ModelList", "getModelByAttributes", {"id": addon.model.id});

                    if (!model) {
                        console.warn("wrong configuration: addon " + addonKey + " is not in tools menu or cannot be called from somewhere in the view! Defined this in config.json.");
                    }
                    else {
                        addon.model.set("i18nextTranslate", model.get("i18nextTranslate"));
                    }
                    Radio.trigger("ModelList", "replaceModelById", addon.model.id, addon.model);
                }
            }).catch(error => {
                console.error(error);
                Radio.trigger("Alert", "alert", "Entschuldigung, diese Anwendung konnte nicht vollständig geladen werden. Bitte wenden sie sich an den Administrator.");
            });
        }
    });
}

export {loadApp};
