import {expect} from "chai";
import {
    createCsvBlob
} from "../../exportButtonUtils.js";

describe("src_3_0_0/shared/components/exportButtonUtils.js", () => {
    describe("createCsvBlob", () => {
        it("should create a blob object representing the given csv text", () => {
            const blob = createCsvBlob("csvText");

            expect(blob).to.be.an.instanceof(Blob);
            expect(blob.size).to.equal(10);
            expect(blob.type).to.equal("text/csv;charset=utf-8,%ef%bb%bf");
        });
    });
});
