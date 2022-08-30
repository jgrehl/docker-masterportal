import getNestedValues from "../../getNestedValues.js";
import {expect} from "chai";

describe("src_3_0_0/utils/getNestedValues.js", () => {
    const starks = {
        Ned: {
            fullName: "Eddard Stark",
            details: {
                age: 47,
                stillAlive: false
            },
            children: ["Robb", "Sans", "Arya"]
        },
        Catelyn: {
            fullName: "Catelyn Tully",
            details: {
                age: 49,
                stillAlive: false
            },
            children: ["Robb", "Sans", "Arya"]
        },
        Rickard: {
            fullName: "Rickard Stark",
            details: {
                stillAlive: false
            },
            children: ["Ned", "Brandon", "Lyanna", "Benjen"]
        },
        Arya: {
            fullName: "Arya Stark",
            details: {
                age: 17,
                stillAlive: true
            }
        }
    };

    it("should return an empty array if only one param is given", () => {
        expect(getNestedValues({})).to.be.empty;
    });

    it("should return an empty array if the first param is not an object", () => {
        expect(getNestedValues(undefined, "age")).to.be.empty;
        expect(getNestedValues(null, "age")).to.be.empty;
        expect(getNestedValues(false, "age")).to.be.empty;
        expect(getNestedValues(true, "age")).to.be.empty;
        expect(getNestedValues("Hello", "age")).to.be.empty;
        expect(getNestedValues(42, "age")).to.be.empty;
    });

    it("should return an empty array if the given key is not existing", () => {
        expect(getNestedValues(starks, undefined)).to.be.empty;
        expect(getNestedValues(starks, null)).to.be.empty;
        expect(getNestedValues(starks, [])).to.be.empty;
        expect(getNestedValues(starks, {})).to.be.empty;
        expect(getNestedValues(starks, false)).to.be.empty;
        expect(getNestedValues(starks, true)).to.be.empty;
        expect(getNestedValues(starks, 5)).to.be.empty;
        expect(getNestedValues(starks, "status")).to.be.empty;
        expect(getNestedValues(starks, "")).to.be.empty;
    });

    it("should return an array with valid values", () => {
        expect(getNestedValues(starks, "Arya")).to.deep.equal([{
            fullName: "Arya Stark",
            details: {
                age: 17,
                stillAlive: true
            }
        }]);
        expect(getNestedValues(starks, "age")).to.deep.equal([47, 49, 17]);
        expect(getNestedValues(starks, "children")).to.deep.equal([["Robb", "Sans", "Arya"], ["Robb", "Sans", "Arya"], ["Ned", "Brandon", "Lyanna", "Benjen"]]);
        expect(getNestedValues(starks, "stillAlive")).to.deep.equal([false, false, false, true]);
        expect(getNestedValues(starks, "details")).to.deep.equal([
            {
                "age": 47,
                "stillAlive": false
            },
            {
                "age": 49,
                "stillAlive": false
            },
            {
                "stillAlive": false
            },
            {
                "age": 17,
                "stillAlive": true
            }
        ]);
    });

    it("should respect searchKeyForArrays", () => {
        const json = {
                Fachdaten: {
                    Layer: [
                        {
                            id: "1132",
                            name: "100 Jahre Stadtgruen POIs",
                            visibility: true
                        },
                        {
                            id: "10220"
                        },
                        {
                            Titel: "Titel",
                            Ordner: [
                                {
                                    Titel: "3 Layer",
                                    Layer: [
                                        {
                                            id: "717",
                                            visibility: true
                                        },
                                        {
                                            id: "718",
                                            visibility: true
                                        },
                                        {
                                            id: "719"
                                        }
                                    ],
                                    Ordner: [
                                        {
                                            Titel: "Überschwemmungsgebiete",
                                            Layer: [
                                                {
                                                    id: "1103",
                                                    visibility: true
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            },
            result = getNestedValues(json, "Layer", "Ordner").flat(Infinity);

        expect(result.length).to.equal(6);
        expect(result[0].id).to.equal("1132");
        expect(result[1].id).to.equal("10220");
        expect(result[2].id).to.equal("717");
        expect(result[3].id).to.equal("718");
        expect(result[4].id).to.equal("719");
        expect(result[5].id).to.equal("1103");
    });
});

