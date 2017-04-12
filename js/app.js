
function decModulesLoading () {
    modulesLoading--;

    if (modulesLoading === 0 && lastModuleRequired) {
        window.postMessage("portalReady", "*");
    }
}
function incModulesLoading () {
    modulesLoading++;
}


define("app",
    [
    "config",
    "modules/core/util",
    "modules/core/rawLayerList",
    "modules/restReader/collection",
    "modules/core/configLoader/preparser",
    "modules/core/map",
    "modules/core/parametricURL",
    "modules/core/crs",
    "modules/core/autostarter",
    "modules/alerting/view",
    "bootstrap"
], function (Config, Util, RawLayerList, RestReaderList, Preparser, Map, ParametricURL, CRS, Autostarter, Alert) {

    // Core laden
    new Alert();
    new Autostarter();
    new Util({lgvConfigPath: Config.lgvConfigPath,
              imgPath: Config.imgPath,
              imgProjektPath: Config.imgProjektPath
              });
    new RawLayerList();
    new Preparser();
    new ParametricURL();
    new CRS();
    new Map();
    new RestReaderList();
    // Module laden
    var configJSON = Radio.request("Parser","getPortalConfig");

    if (configJSON && configJSON.menu && configJSON.menu.hide !== true) {
        incModulesLoading();
        require(["modules/menu/menuLoader"], function (MenuLoader) {
            new MenuLoader();
            decModulesLoading();
        });
    }

    incModulesLoading();
    require(["modules/remoteinterface/model"], function (Remoteinterface) {
         new Remoteinterface();
         decModulesLoading();
     });

    if (Config.allowParametricURL && Config.allowParametricURL === true && Config.zoomtofeature) {
        incModulesLoading();
        require(["modules/zoomtofeature/model"], function (ZoomToFeature) {
             new ZoomToFeature();
             decModulesLoading();
         });
    }

    // load customModules from config
    if (Config.customModules) {
        _.each(Config.customModules, function (element) {
            incModulesLoading();
            require([element], function (CustomModule) {
                 new CustomModule();
                 decModulesLoading();
             });
         });
    }

    // Macht noch Probleme
    // if (Config.attributions && Config.attributions === true) {
     //     require(["modules/attribution/view"], function (AttView) {
    //         new AttView();
    //     });
    // }

    if (Config.geoAPI && Config.geoAPI === true) {
        incModulesLoading();
        require(["geoapi"], function () {
            decModulesLoading();
        });
    }

    require([
        "config"
    ], function (Config) {

        if (Radio.request("Util", "isAny")) {
             incModulesLoading();
             require(["modules/layerinformation/viewMobile"], function (MobileLayerInformationView) {
                 new MobileLayerInformationView();
                 decModulesLoading();
             });
        }
        else {
            incModulesLoading();
            require(["modules/layerinformation/view"], function (LayerInformationView) {
                 new LayerInformationView();
                 decModulesLoading();
             });
        }

        if (Config.footer && Config.footer.visibility === true) {
            incModulesLoading();
            require(["modules/footer/view"], function (FooterView) {
                 new FooterView();
                 decModulesLoading();
             });
        }

        if (Config.clickCounter && Config.clickCounter.desktop && Config.clickCounter.desktop !== "" && Config.clickCounter.mobile && Config.clickCounter.mobile !== "") {
            incModulesLoading();
             require(["modules/clickCounter/view"], function (ClickCounterView) {
                 new ClickCounterView(Config.clickCounter.desktop, Config.clickCounter.mobile);
                 decModulesLoading();
             });
        }

        if (Config.mouseHover && Config.mouseHover === true) {
            incModulesLoading();
             require(["modules/mouseHover/view"], function (MouseHoverPopupView) {
                 new MouseHoverPopupView();
                 decModulesLoading();
             });
        }

        if (Config.quickHelp && Config.quickHelp === true) {
            incModulesLoading();
             require(["modules/quickhelp/view"], function (QuickHelpView) {
                 new QuickHelpView();
                 decModulesLoading();
             });
        }

        if (Config.scaleLine && Config.scaleLine === true) {
            incModulesLoading();
             require(["modules/scaleline/view"], function (ScaleLineView) {
                 new ScaleLineView();
                 decModulesLoading();
             });
        }
        if (Config.mmlMobileHeader) {
            incModulesLoading();
            require(["modules/mmlMobileHeader/mmlMobileHeaderLoader"], function (mmlMobileHeaderLoader) {
                new mmlMobileHeaderLoader();
                decModulesLoading();
            });
        }

        incModulesLoading();
         require(["modules/window/view"], function (WindowView) {
             new WindowView();
             decModulesLoading();
         });

        if (configJSON && configJSON.simpleLister) {
            incModulesLoading();
            require(["modules/simpleLister/view"], function (SimpleListerView) {
                new SimpleListerView();
                decModulesLoading();
            });
        }

        if (configJSON && configJSON.mmlFilter) {
            incModulesLoading();
            require(["modules/mmlFilter/mmlFilterLoader"], function (MMLFilterLoader) {
                    new MMLFilterLoader();
                    decModulesLoading();
            });
        }

        // Tools
        _.each(Radio.request("Parser", "getItemsByAttributes", {type: "tool"}), function (tool) {
            incModulesLoading();
            switch (tool.id) {
                case "animation": {

                     require(["modules/tools/animation/view"], function (AnimationView) {
                         new AnimationView();
                         decModulesLoading();
                     });
                    break;
                }
                case "gfi": {
                    require(["modules/tools/gfi/model"], function (GfiModel) {
                        new GfiModel();
                        decModulesLoading();
                    });
                    break;
                }
                case "coord": {
                     require(["modules/coordpopup/view"], function (CoordPopupView) {
                         new CoordPopupView();
                         decModulesLoading();
                     });
                    break;
                }
                case "measure": {
                     require(["modules/tools/measure/view"], function (MeasureView) {
                         new MeasureView();
                         decModulesLoading();
                     });
                    break;
                }
                case "draw": {
                     require(["modules/tools/draw/view"], function (DrawView) {
                         new DrawView();
                         decModulesLoading();
                     });
                    break;
                }
                case "print": {
                     require(["modules/tools/print/view"], function (PrintView) {
                         new PrintView();
                         decModulesLoading();
                     });
                    break;
                }
                case "parcelSearch": {
                     require(["modules/tools/parcelSearch/view"], function (ParcelSearchView) {
                         new ParcelSearchView();
                         decModulesLoading();
                     });
                    break;
                }
                case "searchByCoord": {
                     require(["modules/tools/searchByCoord/view"], function (SearchByCoordView) {
                         new SearchByCoordView();
                         decModulesLoading();
                     });
                    break;
                }
                case "saveSelection": {
                     require(["modules/tools/saveSelection/view"], function (SaveSelectionView) {
                         new SaveSelectionView();
                         decModulesLoading();
                     });
                    break;
                }
                case "kmlimport": {
                     require(["modules/tools/kmlimport/view"], function (ImportView) {
                         new ImportView();
                         decModulesLoading();
                     });
                    break;
                }
                case "wfsFeatureFilter": {
                     require(["modules/wfsfeaturefilter/view"], function (WFSFeatureFilterView) {
                         new WFSFeatureFilterView();
                         decModulesLoading();
                     });
                    break;
                }
                case "extendedFilter": {
                     require(["modules/tools/extendedFilter/view"], function (ExtendedFilterView) {
                         new ExtendedFilterView();
                         decModulesLoading();
                     });
                    break;
                }
                case "treeFilter": {
                     require(["modules/treefilter/view"], function (TreeFilterView) {
                         new TreeFilterView();
                         decModulesLoading();
                     });
                    break;
                }
                case "routing": {
                     require(["modules/viomRouting/view"], function (RoutingView) {
                         new RoutingView();
                         decModulesLoading();
                     });
                    break;
                }
                case "contact": {
                     require(["modules/contact/view"], function (Contact) {
                         new Contact();
                         decModulesLoading();
                     });
                    break;
                }
                case "addWMS": {
                     require(["modules/tools/addwms/view"], function (AddWMSView) {
                         new AddWMSView();
                         decModulesLoading();
                     });
                    break;
                }
                case "featureLister": {
                     require(["modules/featurelister/view"], function (FeatureLister) {
                         new FeatureLister();
                         decModulesLoading();
                     });
                    break;
                }
                case "formular": {
                     require(["modules/formular/view"], function (Formular) {
                         new Formular(tool.modelname);
                         decModulesLoading();
                     });
                    break;
                }
                case "legend": {
                     require(["modules/legend/view", "modules/legend/viewMobile"], function (LegendView, MobileLegendView) {
                        if (Radio.request("Util", "isAny")) {
                            new MobileLegendView();
                        }
                        else {
                            new LegendView();
                        }
                        decModulesLoading();
                    });
                    break;
                }
                default: {
                    break;
                }
            }
        });
        // controls
        incModulesLoading();
         require(["modules/controls/view"], function (ControlsView) {
            var controls = Radio.request("Parser", "getItemsByAttributes", {type: "control"}),
                controlsView = new ControlsView();

            _.each(controls, function (control) {
                var el;

                incModulesLoading();
                switch (control.id) {
                    case "toggleMenu": {
                        if (control.attr === true) {
                            el = controlsView.addRow(control.id);

                             require(["modules/controls/togglemenu/view"], function (ToggleMenuControlView) {
                                 new ToggleMenuControlView({el: el});
                             });
                        }
                        decModulesLoading();
                        break;
                    }
                    case "zoom": {
                        if (control.attr === true) {
                            el = controlsView.addRow(control.id);
                             require(["modules/controls/zoom/view"], function (ZoomControlView) {
                                 new ZoomControlView({el: el});
                             });
                        }
                        decModulesLoading();
                        break;
                    }
                    case "orientation": {
                        if (control.attr !== false) {
                            el = controlsView.addRow(control.id);
                             require(["modules/controls/orientation/view"], function (OrientationView) {
                                 new OrientationView({el: el});
                             });
                        }
                        decModulesLoading();
                        break;
                    }
                    case "mousePosition": {
                        if (control.attr === true) {
                             require(["modules/controls/mousePosition/view"], function (MousePositionView) {
                                 new MousePositionView();
                             });
                        }
                        decModulesLoading();
                        break;
                    }
                    case "fullScreen": {
                        if (control.attr === true) {
                            el = controlsView.addRow(control.id);
                             require(["modules/controls/fullScreen/view"], function (FullScreenView) {
                                 new FullScreenView({el: el});
                             });
                        }
                        decModulesLoading();
                        break;
                    }
                    case "attributions": {
                        if (control.attr === true) {
                             require(["modules/controls/attributions/view"], function (AttributionsView) {
                                 new AttributionsView();
                             });
                        }
                        decModulesLoading();
                        break;
                    }
                    case "toggleBaselayer": {
                        if (control.attr === true) {
                            require(["modules/controls/baselayerToggle/view"], function (BaselayerView) {
                                new BaselayerView();
                            });
                        }
                        decModulesLoading();
                        break;
                    }
                    case "mmlNewIssueButton": {
                        require(["modules/controls/mmlAssistentCaller/viewButton", "modules/controls/mmlAssistentCaller/viewWelcome"], function (MmlAssistentCallerButtonView, MmlAssistentCallerWelcomeView) {
                            if (Radio.request("Util", "isViewMobile") === false) {
                                new MmlAssistentCallerWelcomeView();
                            }
                            new MmlAssistentCallerButtonView();
                        });
                        decModulesLoading();
                        break;
                    }
                    case "mmlFilterButton": {
                        require(["modules/controls/mmlFilterButton/view"], function (MmlFilterButton) {
                            new MmlFilterButton();
                        });
                        decModulesLoading();
                        break;
                    }
                    default: {
                        decModulesLoading();
                        break;
                    }
                }
            });
            decModulesLoading();
        });


        // Prüfung, ob MapMarker geladen werden soll. In MML disabled.
        if (configJSON && configJSON.mapMarkerModul) {
            if (_.isUndefined(configJSON.mapMarkerModul) === true || configJSON.mapMarkerModul.marker !== "dragMarker") {
                incModulesLoading();
                require(["modules/mapMarker/view"], function (MapMarkerView) {
                    new MapMarkerView();
                    decModulesLoading();
                });
            }
            else {
                incModulesLoading();
                require(["modules/dragMarker/model", "modules/reverseGeocoder/model"], function (DragMarkerModel, reverseGeocoder) {
                    new reverseGeocoder();
                    new DragMarkerModel();
                    decModulesLoading();
                });
            }
        }
        searchbar = Radio.request("Parser", "getItemsByAttributes", {type: "searchBar"});
        if (searchbar) {
            var sbconfig = searchbar[0].attr;

            if (sbconfig) {
                incModulesLoading();
                 require(["modules/searchbar/view"], function (SearchbarView) {
                    var title = Radio.request("Parser", "getPortalConfig").PortalTitle;

                    new SearchbarView(sbconfig);
                    if (title) {
                        incModulesLoading();
                         require(["modules/title/view"], function (TitleView) {
                             new TitleView(title);
                             decModulesLoading();
                         });
                    }
                    decModulesLoading();
                });
            }
        }

        incModulesLoading();
         require(["modules/tools/styleWMS/view"], function (StyleWMSView) {
             new StyleWMSView();
             decModulesLoading();
         });

        incModulesLoading();
         require(["modules/tools/addGeoJSON/model"], function (AddGeoJSON) {
             new AddGeoJSON();
             decModulesLoading();
         });

        Radio.trigger("Util", "hideLoader");
    });
    // Dient dazu, den Zeitpunkt zu makieren, an dem alle require-Aufrufe ->abgeschickt<- wurden
    incModulesLoading();
     require([""], function () {
        lastModuleRequired = true;
        decModulesLoading();
    });
});
