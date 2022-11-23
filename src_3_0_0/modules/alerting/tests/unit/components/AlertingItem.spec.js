import Vuex from "vuex";
import {config, shallowMount, createLocalVue} from "@vue/test-utils";
import AlertingStoreModule from "../../../store/indexAlerting";
import AlertingItemComponent from "../../../components/AlertingItem.vue";
import {expect} from "chai";
import sinon from "sinon";

const
    localVue = createLocalVue(),
    Storage = require("dom-storage");

global.localStorage = new Storage(null, {strict: true});
localVue.use(Vuex);
config.mocks.$t = key => key;
config.mocks.$i18n = {
    i18next: {
        options: {
            isEnabled: () => sinon.stub(),
            getLanguages: () => sinon.stub()
        }
    }
};

describe("src/modules/alerting/components/AlertingItem.vue", function () {
    let
        wrapper,
        store;

    const
        mockConfigJs = {
            alerting: {
                fetchBroadcastUrl: "foo",
                localStorageDisplayedAlertsKey: "bar"
            }
        },
        alertingData = {
            data: {
                "globalAlerts": ["Test1", "Test4"],

                "restrictedAlerts": {
                    "https://localhost:9001/portal/master_3_0_0/": ["Test2"],
                    "https://localhost:9001/portal/basic/": ["Test3"]
                },

                "alerts": {
                    "Test1": {
                        "title": "Test 1",
                        "category": "error",
                        "content": "Lorem Ipsum 1 (global content)",
                        "displayFrom": "2020-03-01 20:15:55",
                        "displayUntil": "2052-05-17 14:30",
                        "mustBeConfirmed": true,
                        "once": {"seconds": 15},
                        "multipleAlert": true
                    },
                    "Test2": {
                        "title": "Test 2",
                        "category": "info",
                        "content": "Lorem Ipsum 2 (content for master)",
                        "displayFrom": false,
                        "displayUntil": "2052-05-17 14:30",
                        "mustBeConfirmed": true,
                        "once": {"seconds": 30},
                        "multipleAlert": true
                    },
                    "Test3": {
                        "title": "Test 3",
                        "category": "error",
                        "content": "Lorem Ipsum 3 (content for basic)",
                        "displayFrom": false,
                        "displayUntil": "2052-05-17 14:30",
                        "mustBeConfirmed": true,
                        "once": {"seconds": 45},
                        "multipleAlert": true
                    },
                    "Test4": {
                        "title": "Test 4",
                        "category": "info",
                        "content": "Lorem Ipsum 4 (global content)",
                        "displayFrom": false,
                        "displayUntil": "2052-05-17 14:30",
                        "mustBeConfirmed": true,
                        "once": {"seconds": 60},
                        "multipleAlert": true
                    }
                }
            }
        };

    beforeEach(() => {
        store = new Vuex.Store({
            modules: {
                Alerting: AlertingStoreModule
            },
            state: {
                configJs: mockConfigJs,
                availableLocalStorage: true
            },
            mutations: {
                configJs (state, value) {
                    state.configJs = value;
                }
            }
        });
    });

    it("Checking the initially displayed alerts", async function () {
        const
            mountingSettings = {
                store,
                computed: {
                    currentUrl: () => "https://localhost:9001/portal/master_3_0_0/"
                },
                methods: {
                    fetchBroadcast: function () {
                        this.axiosCallback(alertingData);
                    }
                },
                localVue
            };

        let
            categoryContainers = [],
            alertWrappers = [];

        wrapper = shallowMount(AlertingItemComponent, mountingSettings);

        await wrapper.vm.$nextTick();

        categoryContainers = wrapper.findAll(".alertCategoryContainer");
        alertWrappers = wrapper.findAll(".singleAlertContainer");

        describe("Expecting initially shown 2 category groups with 2 alerts", function () {
            it("There are 2 category groups", function () {
                expect(categoryContainers.exists()).to.be.true;
                expect(categoryContainers.length).to.equal(2);
            });

            it("1st category group is named \"Test 1\"", function () {
                expect(categoryContainers.at(0).find("h3").exists()).to.be.true;
                expect(categoryContainers.at(0).find("h3").text()).to.equal("Test 1");
            });
            it("and contains 1 alerts", function () {
                expect(categoryContainers.at(0).findAll(".singleAlertContainer").length).to.equal(1);
            });

            it("1st alert is of category \"error\"", function () {
                expect(alertWrappers.at(0).html().indexOf("bg-danger")).not.to.equal(-1);
            });
            it("and has no confirmation link", function () {
                expect(alertWrappers.at(0).html().indexOf("form-check-label")).to.equal(-1);
            });
            it("2nd alert is of category \"info\"", function () {
                expect(alertWrappers.at(1).html().indexOf("bg-info")).not.to.equal(-1);
            });
            it("and has confirmation link", function () {
                expect(alertWrappers.at(1).html().indexOf("form-check form-check-reverse form-switch mt-1")).not.to.equal(-1);
            });

            it("2st category group is named \"Test 2\"", function () {
                expect(categoryContainers.at(1).find("h3").exists()).to.be.true;
                expect(categoryContainers.at(1).find("h3").text()).to.equal("Test 2");
            });
            it("and contains 2 alert", function () {
                expect(categoryContainers.at(1).findAll(".singleAlertContainer").length).to.equal(2);
            });

        });

        describe("Now clicking on 2nd alert's confirmation switch", function () {
            it("click", function () {
                alertWrappers.at(1).find("#flexSwitchCheckDefault").trigger("click");
            });

            it("confirmation switch of second alert is checked", function () {
                expect(alertWrappers.at(1).findAll(".form-check-input:checked").exists()).to.be.true;
            });
        });

        describe("Close the modal", function () {
            it("4 first alerts have vanished", async function () {
                wrapper.vm.onModalClose();
                await wrapper.vm.$nextTick();
                expect(wrapper.findAll(".singleAlertWrapper").length).to.equal(0);
            });
        });

        describe("Add some alerts", function () {

            it("displayed alert is the new one", async function () {
                await store.dispatch("Alerting/addSingleAlert", {
                    "category": "error",
                    "content": "copycat",
                    "displayFrom": "2020-03-01 20:15:55",
                    "displayUntil": "2052-05-17 14:30",
                    "mustBeConfirmed": true,
                    "once": {"seconds": 30},
                    "multipleAlert": true
                });
                await wrapper.vm.$nextTick();
                expect(wrapper.findAll(".singleAlertContainer").at(0).html().indexOf("copycat")).not.to.equal(-1);

                await wrapper.vm.$nextTick();
            });
            it("Adding the exact same alert again does nothing", async function () {
                await store.dispatch("Alerting/addSingleAlert", {
                    "category": "error",
                    "content": "copycat",
                    "displayFrom": "2020-03-01 20:15:55",
                    "displayUntil": "2052-05-17 14:30",
                    "mustBeConfirmed": true,
                    "once": true,
                    "multipleAlert": true
                });
                await wrapper.vm.$nextTick();
                expect(wrapper.findAll(".singleAlertContainer").length).to.equal(1);
            });
            it("Adding an expired alert does nothing", async function () {
                store.dispatch("Alerting/addSingleAlert", {
                    "content": "No one ever looks at me only because I'm expired.",
                    "displayFrom": "2020-03-01 20:15:55",
                    "displayUntil": "2020-05-17 14:30",
                    "mustBeConfirmed": true,
                    "once": true,
                    "multipleAlert": true
                });
                await wrapper.vm.$nextTick();
                expect(wrapper.findAll(".singleAlertContainer").length).to.equal(1);
            });
            it("Adding an alert from the future does nothing", async function () {
                store.dispatch("Alerting/addSingleAlert", {
                    "content": "I am too avant garde for this 'unalerted' society.",
                    "displayFrom": "2050-03-01 20:15:55",
                    "displayUntil": "2060-05-17 14:30",
                    "multipleAlert": true
                });
                await wrapper.vm.$nextTick();
                expect(wrapper.findAll(".singleAlertContainer").length).to.equal(1);
            });
        });

        it("axiosCallback adds alert", async function () {
            const parseObject = {
                "data": {
                    "globalAlerts": [
                    ],
                    "restrictedAlerts": {
                        "https://localhost:9001/portal/master_3_0_0/": [
                            "testParsing"
                        ]
                    },
                    "alerts": {
                        "testParsing": {
                            "category": "info",
                            "title": "testParsing",
                            "content": "testParsing",
                            "displayFrom": "2022-08-24 05:00",
                            "displayUntil": "2088-09-28 23:59",
                            "creationDate": "01/09/22",
                            "mustBeConfirmed": true,
                            "once": true,
                            "initial": true,
                            "initialConfirmed": true,
                            "displayCategory": "common:modules.alerting.categories.info"
                        }
                    }
                }
            };

            await wrapper.vm.axiosCallback(parseObject);
            expect(wrapper.findAll(".singleAlertContainer").at(1).html().indexOf("testParsing")).not.to.equal(-1);
            expect(wrapper.findAll(".singleAlertContainer").length).to.equal(2);
        });
    });
});