import "regenerator-runtime/runtime";

import "./assets/css/bootstrap.scss";
import "./assets/css/style.css";

import {createApp} from "vue";
import App from "./App.vue";
import store from "./app-store";
import "bootstrap/js/dist/offcanvas";

import remoteInterface from "./plugins/remoteInterface";
// import {instantiateVuetify} from "./plugins/vuetify";
import {initiateVueI18Next, initLanguage} from "./plugins/i18next";

let app;
const configPath = window.location.pathname.substring(0, window.location.pathname.lastIndexOf("/") + 1) + "config.js",
    loadConfigJs = new Promise((resolve, reject) => {
        const script = document.createElement("script");

        document.body.appendChild(script);
        script.onload = resolve;
        script.onerror = reject;
        script.async = true;
        script.src = configPath;
    }),
    main = {

        /**
         * Returns the app.
         * @returns {Object} the app
         */
        getApp: () => app
    };


// Wait until config.js is loaded
loadConfigJs.then(() => {
    initLanguage(Config.portalLanguage);

    app = createApp(App);


    // Load remoteInterface
    if (Object.prototype.hasOwnProperty.call(Config, "remoteInterface")) {
        app.use(remoteInterface, Config.remoteInterface);
    }

    initiateVueI18Next(app);
    app.use(store);
<<<<<<< HEAD

    initLanguage(Config.portalLanguage)
        .then(() => {
            app.mount("#masterportal-root");
        });
=======
    app.mount("#masterportal-root");
>>>>>>> 762b58ca17 (BG-3809: adapt test and cleanup)
});

export default main;
