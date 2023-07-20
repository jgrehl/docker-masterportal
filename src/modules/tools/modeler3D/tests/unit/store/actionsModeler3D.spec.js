import {expect} from "chai";
import sinon from "sinon";
import actions from "../../../store/actionsModeler3D";
import store from "../../../../../../app-store";
import proj4 from "proj4";

describe("Actions", () => {
    let entities,
        scene,
        getters;
    const map3D = {
        id: "1",
        mode: "3D",
        getCesiumScene: () => {
            return scene;
        }
    };

    beforeEach(() => {
        mapCollection.clear();
        mapCollection.addMap(map3D, "3D");
        global.Cesium = {
            PolygonGraphics: function (options) {
                this.extrudedHeight = {
                    _value: options.extrudedHeight,
                    getValue: () => this.extrudedHeight._value
                };
                this.height = {
                    _value: options.height,
                    getValue: () => this.height._value
                };
            },
            ModelGraphics: function (options) {
                this.model = {
                    scale: {
                        _value: options.scale,
                        getValue: () => this.model.scale._value
                    }
                };
            },
            Cartesian3: function () {
                this.x = 0;
                this.y = 0;
                this.z = 0;
            },
            Cartographic: {
                fromCartesian: () => ({
                    longitude: 0.17443853256965697,
                    latitude: 0.9346599366554966,
                    height: 6.134088691520464
                }),
                toCartesian: () => ({
                    x: 10,
                    y: 20,
                    z: 30
                }),
                fromDegrees: () => ({
                    longitude: 0.17443853256965697,
                    latitude: 0.9346599366554966,
                    height: 6.134088691520464
                })
            },
            Math: {
                toDegrees: () => 9.99455657887449,
                toRadians: () => 0.97
            }
        };

        global.Cesium.Cartesian3.fromDegrees = () => ({
            x: 3739310.9273738265,
            y: 659341.4057539968,
            z: 5107613.232959453
        });
        global.Cesium.Cartesian3.subtract = (pos1, pos2, res) => {
            res.x = pos1.x - pos2.x;
            res.y = pos1.y - pos2.y;
            res.z = pos1.z - pos2.z;
            return res;
        };
        global.Cesium.Cartesian3.add = (pos1, pos2, res) => {
            res.x = pos1.x + pos2.x;
            res.y = pos1.y + pos2.y;
            res.z = pos1.z + pos2.z;
            return res;
        };

        store.state.Maps.mode = "3D";
        store.getters = {
            "Maps/mode": store.state.Maps.mode
        };
        scene = {
            globe: {
                getHeight: () => 5.7896
            },
            sampleHeight: () => 9
        };
    });
    afterEach(() => {
        sinon.restore();
    });
    describe("deleteEntity", () => {
        it("should delete the entity from list and entityCollection", (done) => {
            const commit = sinon.spy(),
                state = {importedModels: [{id: 1}]},
                id = 1;

            entities = {
                getById: sinon.stub().returns({id: id}),
                removeById: sinon.spy()
            };
            getters = {
                scene: scene,
                entities: entities
            };

            actions.deleteEntity({state, getters, commit}, id);
            setTimeout(() => {
                expect(entities.removeById.calledWith(1)).to.be.true;
                expect(commit.calledWith("setCurrentModelId", null)).to.be.true;
                done();
            }, 20);
        });

        it("should not delete the entity when not found in list", (done) => {
            const commit = sinon.spy(),
                state = {importedModels: [{id: 5}]},
                id = 1;

            entities = {
                getById: sinon.stub().returns(null),
                removeById: sinon.spy()
            };
            getters = {
                scene: scene,
                entities: entities
            };

            actions.deleteEntity({state, getters, commit}, id);
            setTimeout(() => {
                expect(entities.removeById.calledWith(1)).to.be.false;
                expect(commit.calledWith("setCurrentModelId", null)).to.be.false;
                done();
            }, 20);
        });
    });

    describe("confirmDeletion", () => {
        it("should open the modal dialog to confirm action", () => {
            const dispatch = sinon.spy(),
                id = 1;

            store.dispatch = sinon.spy();
            getters = {
                getModelNameById: sinon.stub().returns("House")
            };

            actions.confirmDeletion({dispatch, getters}, id);
            expect(store.dispatch.firstCall.args[0]).to.equal("ConfirmAction/addSingleAction");
        });
    });

    describe("changeVisibility", () => {
        it("should change the entities show attribute", () => {
            const model = {
                    id: "someId",
                    show: false
                },
                entity = {
                    id: "someId",
                    show: false
                };

            entities = {getById: sinon.stub().returns(entity)};
            getters = {
                entities: entities
            };

            actions.changeVisibility({getters}, model);

            expect(model.show).to.be.true;
            expect(entity.show).to.be.true;
        });
    });

    describe("newProjectionSelected", () => {
        it("should set the current projection and dispatch 'updatePositionUI'", () => {
            const dispatch = sinon.spy(),
                commit = sinon.spy(),
                value = "projectionId";

            getters = {getProjectionById: sinon.stub().returns({id: "projectionId"})};

            actions.newProjectionSelected({dispatch, commit, getters}, value);
            expect(commit.calledWith("setCurrentProjection", {id: "projectionId"})).to.be.true;
            expect(dispatch.calledWith("updatePositionUI")).to.be.true;
        });
    });

    describe("updateEntityPosition", () => {
        it("should update the entity position when it exists", () => {
            const dispatch = sinon.spy(),
                state = {
                    currentModelId: "entityId",
                    currentModelPosition: {x: 10, y: 20, z: 30}
                };

            entities = {
                getById: sinon.stub().returns({position: {}})
            };
            getters = {
                scene: scene,
                entities: entities
            };

            actions.updateEntityPosition({dispatch, state, getters});

            expect(entities.getById.calledWith("entityId")).to.be.true;
            expect(dispatch.calledWith("transformToCartesian")).to.be.true;
            expect(entities.getById().position).to.deep.equal({x: 10, y: 20, z: 30});
        });

        describe("updateEntityPosition with polygons", () => {
            const state = {
                    currentModelId: "polygonId",
                    currentModelPosition: {x: 10, y: 20, z: 30},
                    cylinderPosition: [{x: 11, y: 21, z: 31}, {x: 12, y: 22, z: 32}, {x: 13, y: 23, z: 33}]
                },
                polygon = {
                    polygon: {
                        height: 5,
                        extrudedHeight: 25
                    }
                },
                cylinders = [
                    {
                        position: {x: 11, y: 21, z: 31},
                        positionIndex: 0,
                        cylinder: {
                            length: 5
                        }
                    },
                    {
                        position: {x: 12, y: 22, z: 32},
                        positionIndex: 1,
                        cylinder: {
                            length: 5
                        }
                    },
                    {
                        position: {x: 13, y: 23, z: 33},
                        positionIndex: 2,
                        cylinder: {
                            length: 5
                        }
                    }
                ];

            it("should update the polygon position clamped to ground when it exists", () => {
                const dispatch = sinon.spy();

                entities = {
                    values: cylinders,
                    getById: sinon.stub().returns(polygon)
                };
                getters = {
                    scene: scene,
                    entities: entities
                };
                polygon.clampToGround = true;

                actions.updateEntityPosition({dispatch, state, getters});

                expect(entities.getById.calledWith("polygonId")).to.be.true;
                expect(dispatch.calledWith("transformToCartesian")).to.be.true;
                expect(dispatch.calledWith("movePolygon", {entity: polygon, position: {x: 10, y: 20, z: 30}})).to.be.true;
                expect(cylinders[0].cylinder.length).to.equal(25);
                expect(cylinders[0].position).to.eql({x: 10, y: 20, z: 30});
            });

            it("should update the polygon position not clamped to ground when it exists", () => {
                const dispatch = sinon.spy();

                entities = {
                    values: cylinders,
                    getById: sinon.stub().returns(polygon)
                };
                getters = {
                    scene: scene,
                    entities: entities
                };
                polygon.clampToGround = false;

                actions.updateEntityPosition({dispatch, state, getters});

                expect(entities.getById.calledWith("polygonId")).to.be.true;
                expect(dispatch.calledWith("transformToCartesian")).to.be.true;
                expect(dispatch.calledWith("movePolygon", {entity: polygon, position: {x: 10, y: 20, z: 30}})).to.be.true;
                expect(cylinders[0].cylinder.length).to.equal(21);
                expect(cylinders[0].position).to.eql({x: 10, y: 20, z: 30});
            });
        });

        it("should not update the entity position when it doesn't exist", () => {
            const dispatch = sinon.spy(),
                state = {currentModelId: "nonExistentId"};

            entities = {
                getById: sinon.stub().returns(null)
            };
            getters = {
                scene: scene,
                entities: entities
            };

            actions.updateEntityPosition({dispatch, state, getters});

            expect(entities.getById.calledWith("nonExistentId")).to.be.true;
            expect(dispatch.calledWith("transformToCartesian")).to.be.false;
        });
    });

    describe("updatePositionUI", () => {
        it("should transform entity position when it exists", () => {
            const dispatch = sinon.spy(),
                commit = sinon.spy(),
                state = {
                    currentModelId: "entityId"
                };

            entities = {
                getById: sinon.stub().returns({position: {getValue: sinon.stub().returns({x: 10, y: 20, z: 30})}})
            };
            getters = {
                scene: scene,
                entities: entities
            };

            actions.updatePositionUI({commit, dispatch, state, getters});

            expect(entities.getById.calledWith("entityId")).to.be.true;
            expect(dispatch.calledWith("transformFromCartesian", {x: 10, y: 20, z: 30})).to.be.true;
            expect(commit.called).to.be.false;
        });

        it("should commit height when entity is polygon", () => {
            const dispatch = sinon.spy(),
                commit = sinon.spy(),
                state = {
                    currentModelId: "polygonId"
                };

            entities = {
                getById: sinon.stub().returns({polygon: {height: {getValue: () => 5}}})
            };
            getters = {
                scene: scene,
                entities: entities,
                getCenterFromPolygon: sinon.stub().returns({x: 10, y: 20, z: 30})
            };

            actions.updatePositionUI({commit, dispatch, state, getters});

            expect(entities.getById.calledWith("polygonId")).to.be.true;
            expect(dispatch.calledWith("transformFromCartesian", {x: 10, y: 20, z: 30})).to.be.true;
            expect(commit.calledWith("setHeight", 5)).to.be.true;
        });

        it("should not transform entity position when it doesn't exist", () => {
            const dispatch = sinon.spy(),
                commit = sinon.spy(),
                state = {
                    currentModelId: "nonExistentId"
                };

            entities = {
                getById: sinon.stub().returns(null)
            };
            getters = {
                scene: scene,
                entities: entities,
                getCenterFromPolygon: sinon.stub().returns(undefined)
            };

            actions.updatePositionUI({dispatch, state, getters});

            expect(entities.getById.calledWith("nonExistentId")).to.be.true;
            expect(dispatch.calledWith("transformFromCartesian")).to.be.false;
            expect(commit.called).to.be.false;
        });
    });

    describe("updateUI", () => {
        const entity = {
            clampToGround: true
        };

        it("should update the entity UI when entity is a polygon", () => {
            entity.polygon = new Cesium.PolygonGraphics({
                extrudedHeight: 25,
                height: 10
            });

            entities = {
                getById: sinon.stub().returns(entity)
            };
            getters = {
                entities: entities
            };

            const commit = sinon.spy(),
                dispatch = sinon.spy(),
                state = {currentModelId: "polygonId"};

            actions.updateUI({commit, dispatch, getters, state});

            expect(entities.getById.calledWith("polygonId")).to.be.true;
            expect(commit.firstCall.args[0]).to.equal("setAdaptToHeight");
            expect(commit.firstCall.args[1]).to.be.true;
            expect(commit.secondCall.args[0]).to.equal("setExtrudedHeight");
            expect(commit.secondCall.args[1]).to.equal(15);
            expect(dispatch.calledWith("updatePositionUI"));
        });
    });

    describe("transformFromCartesian", () => {
        proj4.defs("EPSG:25832", "+title=ETRS89/UTM 32N +proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
        it("should transform Cartesian3 coordinates to the currently selected projection", () => {
            const commit = sinon.spy(),
                state = {
                    currentProjection: proj4("EPSG:4326")
                },
                entityPosition = {x: 3739808.2763608, y: 659066.6974853853, z: 5107286.890340484};

            actions.transformFromCartesian({state, commit}, entityPosition);

            expect(commit.firstCall.args[0]).to.equal("setCoordinateEasting");
            expect(commit.firstCall.args[1]).to.eql(9.99455657887449);
            expect(commit.secondCall.args[0]).to.equal("setCoordinateNorthing");
            expect(commit.secondCall.args[1]).to.eql(9.99455657887449);
            expect(commit.thirdCall.args[0]).to.equal("setHeight");
            expect(commit.thirdCall.args[1]).to.eql(6.134088691520464);

        });

        it("should transform Cartesian3 coordinates to the currently selected projection with different conditions", () => {
            const commit = sinon.spy(),
                state = {
                    currentProjection: proj4("EPSG:25832")
                },
                entityPosition = {x: 3739808.2763608, y: 659066.6974853853, z: 5107286.890340484};

            actions.transformFromCartesian({state, commit}, entityPosition);

            expect(commit.firstCall.args[0]).to.equal("setCoordinateEasting");
            expect(commit.firstCall.args[1]).to.eql(609005.9265606481);
            expect(commit.secondCall.args[0]).to.equal("setCoordinateNorthing");
            expect(commit.secondCall.args[1]).to.eql(1104974.8560725104);
            expect(commit.thirdCall.args[0]).to.equal("setHeight");
            expect(commit.thirdCall.args[1]).to.eql(6.134088691520464);
        });
    });

    describe("transformToCartesian", () => {
        proj4.defs("EPSG:25832", "+title=ETRS89/UTM 32N +proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
        it("should transform coordinates of the currently selected projection to cartesian", () => {
            const commit = sinon.spy(),
                dispatch = sinon.spy(),
                state = {
                    adaptToHeight: false,
                    coordinateEasting: 10.00,
                    coordinateNorthing: 53.557,
                    height: 6.0,
                    currentProjection: {
                        epsg: "EPSG:4326",
                        id: "someId",
                        projName: "longlat"
                    }
                };

            actions.transformToCartesian({state, dispatch, commit});

            expect(commit.firstCall.args[0]).to.equal("setCurrentModelPosition");
            expect(commit.firstCall.args[1]).to.eql({x: 3739310.9273738265, y: 659341.4057539968, z: 5107613.232959453});
        });

        it("should transform coordinates of the currently selected projection to cartesian with different conditions", () => {
            const commit = sinon.spy(),
                dispatch = sinon.spy(),
                state = {
                    adaptToHeight: false,
                    coordinateEasting: 566242.52,
                    coordinateNorthing: 5934700.15,
                    height: 6.0,
                    currentProjection: {
                        epsg: "EPSG:25832",
                        id: "someId",
                        projName: "utm"
                    }
                };

            actions.transformToCartesian({state, dispatch, commit});

            expect(commit.firstCall.args[0]).to.equal("setCurrentModelPosition");
            expect(commit.firstCall.args[1]).to.eql({x: 3739310.9273738265, y: 659341.4057539968, z: 5107613.232959453});
        });

        it("should transform coordinates of the currently selected projection to cartesian and correct the height to globe height", () => {
            const commit = sinon.spy(),
                dispatch = sinon.spy(),
                state = {
                    adaptToHeight: true,
                    coordinateEasting: 10.00,
                    coordinateNorthing: 53.557,
                    height: 6.0,
                    currentProjection: {
                        epsg: "EPSG:4326",
                        id: "someId",
                        projName: "longlat"
                    }
                };

            getters = {
                scene: scene,
                entities: entities
            };

            actions.transformToCartesian({state, dispatch, commit, getters});

            expect(commit.firstCall.args[0]).to.equal("setHeight");
            expect(commit.firstCall.args[1]).to.eql(5.7896);
            expect(commit.secondCall.args[0]).to.equal("setCurrentModelPosition");
            expect(commit.secondCall.args[1]).to.eql({x: 3739310.9273738265, y: 659341.4057539968, z: 5107613.232959453});
        });
    });

    describe("generateCylinders", () => {
        it("should generate cylinder on every polygon point", () => {
            const commit = sinon.spy(),
                dispatch = sinon.stub().callsFake(() => {
                    state.cylinderId += 1;
                }),
                state = {
                    currentModelId: "polygonId",
                    cylinderId: 0
                },
                entity = {
                    wasDrawn: true,
                    clampToGround: true,
                    polygon: {
                        extrudedHeight: 20,
                        height: 5,
                        hierarchy: {
                            getValue: () => ({positions: [{x: 10, y: 20, z: 30}, {x: 20, y: 30, z: 10}, {x: 30, y: 10, z: 20}]})
                        }
                    }
                };

            entities = {
                getById: sinon.stub().returns(entity),
                values: [
                    {
                        id: 1,
                        cylinder: {length: {_value: 10}}
                    },
                    {
                        id: 2,
                        cylinder: {length: {_value: 10}}
                    },
                    {
                        id: 3,
                        cylinder: {length: {_value: 10}}
                    }
                ]
            };

            getters = {
                entities: entities
            };

            actions.generateCylinders({commit, dispatch, getters, state});

            expect(commit.calledWith("setActiveShapePoints", entity.polygon.hierarchy.getValue().positions)).to.be.true;
            expect(dispatch.callCount).to.eql(3);
            entities.values.forEach(ent => {
                expect(ent.position).to.eql({x: 10, y: 20, z: 30});
            });
        });

        it("should generate cylinder on every polyline point", () => {
            const commit = sinon.spy(),
                dispatch = sinon.stub().callsFake(() => {
                    state.cylinderId += 1;
                }),
                state = {
                    currentModelId: "polylineId",
                    cylinderId: 0
                },
                entity = {
                    wasDrawn: true,
                    clampToGround: true,
                    polyline: {
                        positions: {getValue: () => [{x: 10, y: 20, z: 30}, {x: 20, y: 30, z: 10}, {x: 30, y: 10, z: 20}]}
                    }
                };

            entities = {
                getById: sinon.stub().returns(entity),
                values: [
                    {
                        id: 1,
                        cylinder: {length: {_value: 10}}
                    },
                    {
                        id: 2,
                        cylinder: {length: {_value: 10}}
                    },
                    {
                        id: 3,
                        cylinder: {length: {_value: 10}}
                    }
                ]
            };

            getters = {
                entities: entities
            };

            actions.generateCylinders({commit, dispatch, getters, state});

            expect(commit.calledWith("setActiveShapePoints", entity.polyline.positions.getValue())).to.be.true;
            expect(dispatch.callCount).to.eql(3);
            entities.values.forEach(ent => {
                expect(ent.position).to.eql({x: 10, y: 20, z: 30});
            });
        });
    });

    describe("createCylinder", () => {
        it("creates a cylinder with the passed options", () => {
            const commit = sinon.spy(),
                state = {
                    cylinderId: null,
                    extrudedHeight: 20
                },
                position = {x: 10, y: 20, z: 30},
                posIndex = 1,
                length = 25;

            entities = {
                values: [],
                add: sinon.stub().returns({
                    id: "cylId",
                    position: position,
                    positionIndex: posIndex,
                    cylinder: {
                        length: length
                    }
                })
            };
            getters = {
                entities: entities
            };

            global.Cesium.ColorMaterialProperty = function (color) {
                this.color = color;
            };
            global.Cesium.Color = {RED: 2};

            actions.createCylinder({commit, getters, state}, {position, posIndex, length});

            expect(commit.calledWith("setCylinderId", "cylId")).to.be.true;
        });
    });

    describe("movePolygon", () => {
        it("should move a polygon and update the UI with center coordinates", () => {
            const dispatch = sinon.spy(),
                state = {
                    height: 10,
                    extrudedHeight: 20,
                    cylinderPosition: []
                },
                entity = {
                    wasDrawn: true,
                    clampToGround: true,
                    polygon: {
                        extrudedHeight: 20,
                        height: 5,
                        hierarchy: {
                            getValue: () => ({positions: [{x: 10, y: 20, z: 30}, {x: 20, y: 30, z: 10}, {x: 30, y: 10, z: 20}]})
                        }
                    }
                },
                position = {x: 50, y: 50, z: 50};

            getters = {
                scene: scene,
                getCenterFromPolygon: sinon.stub().returns({x: 50, y: 50, z: 50})
            };

            actions.movePolygon({dispatch, getters, state}, {entity, position});

            expect(dispatch.calledWith("transformFromCartesian", {x: 50, y: 50, z: 50})).to.be.true;
        });
    });
});
