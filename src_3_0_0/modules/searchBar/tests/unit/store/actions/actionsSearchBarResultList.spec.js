import actions from "../../../../store/actions/actionsSearchBarResultList";
import {expect} from "chai";
import sinon from "sinon";

const {
    activateActions
} = actions;

describe("src_3_0_0/modules/searchBar/store/actions/actionsSearchBarResultList.js", () => {
    let dispatch;

    beforeEach(() => {
        dispatch = sinon.spy();
    });

    afterEach(() => {
        sinon.restore();
    });

    describe("activateActions", () => {
        it("should dispatch the onClick event", () => {
            const searchResult = {
                    category: "Thema (externe Fachdaten)",
                    displayedInfo: "",
                    events: {
                        onClick: {
                            addLayerToTopicTree: {
                                layerid: "123456",
                                source: {
                                    abc: "xyz"
                                }
                            }
                        }
                    },
                    icon: "bi-list-ul",
                    id: "123456",
                    imagePath: "",
                    index: 2,
                    name: "abc",
                    searchInterfaceId: "elasticSearch",
                    toolTip: "my tip"
                },
                actionType = "onClick";

            activateActions({dispatch}, {searchResult, actionType});

            expect(dispatch.calledOnce).to.be.true;
            expect(dispatch.firstCall.args[0]).to.equals("addLayerToTopicTree");
            expect(dispatch.firstCall.args[1]).to.deep.equals({
                layerid: "123456",
                source: {
                    abc: "xyz"
                }
            });
        });
    });
});

