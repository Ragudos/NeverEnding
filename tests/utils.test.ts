import assert from "node:assert";
import test from "node:test";
import { clamp, minMax } from "../src/lib/utils";

test("Test util functions", async (t) => {
    await t.test("clamp() works properly", () => {
        const orig = 5;
        const min = 0;
        const max = 4;

        assert.deepEqual(clamp(orig, min, max), max);
    });

    await t.test("minMax() works properly", () => {
        const min = 5;
        const max = 10;
        const minMaxVal = minMax(min, max);

        assert.equal(minMaxVal[0], min);
        assert.equal(minMaxVal[1], max);
    });
});
