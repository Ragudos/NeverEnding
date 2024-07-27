import assert from "node:assert";
import test from "node:test";
import { moveToward } from "../src/lib/movement";

test("movement utilities work properly", async (t) => {
    const initialVel = 10;
    const finalVel = 0;
    const speed = 0.5;

    await t.test("moveToward() returns an expected value", async () => {
        let iterations = 0;
        let newPos = moveToward(initialVel, finalVel, speed);

        assert.equal(newPos, 9.5);

        while (newPos) {
            newPos = moveToward(newPos, finalVel, speed);
            iterations++;
        }

        assert.equal(iterations, 19);
    });
});
