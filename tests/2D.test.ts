import assert from "node:assert";
import test from "node:test";
import { Vector2D } from "../src/geometry/2D";

test("Vector2D functions are working properly", async (t) => {
    const v = new Vector2D(1, 1);
    const v2 = new Vector2D(1, 2);

    await t.test("Vector2D returns a correct magnitude", () => {
        const magnitude = Math.sqrt(1 + 1);
        // x^2 + y^2
        const magnitudeSquared = 1 + 1;

        assert.equal(v.magnitude(), magnitude);
        assert.equal(v.magnitudeSquared(), magnitudeSquared);
    });

    await t.test("Vector2D is normalized correctly", () => {
        const normVal = 0.7071067811865475;
        const nV = v.normalized();

        assert.equal(nV.x, normVal);
        assert.equal(nV.y, normVal);
    });

    await t.test("Vector2D returns a correct perpendicular coordinate relative to it", () => {
        const prp = v2.perp();

        assert.equal(prp.x, v2.y * -1);
        assert.equal(prp.y, v2.x);
    });
});
