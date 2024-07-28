import { todo, unimplemented, unreachable } from "../debug/Assert";
import { clamp, minMax } from "../lib/utils";

/**
 * Credits to:
 * @see https://github.com/OneLoneCoder/olcUTIL_Geometry2D/blob/main/olcUTIL_Geometry2D.h
 *
 * To visualize polar and cartesian coordinates interchangeably in action,
 * @see https://pgetinker.com/s/XR9T-9O2NKu
 */
class Vector2D {
    /**
     * Error margin for floating points
     */
    static epsilon: number = 0.001;

    static filterDuplicateVectors(vectors: Array<Vector2D>): Array<Vector2D> {
        return vectors.reduce((prev, currV) => {
            for (let i = 0; i < prev.length; ++i) {
                if (
                    Math.abs(currV.x - prev[i].x) < Vector2D.epsilon &&
                    Math.abs(currV.y - prev[i].y) < Vector2D.epsilon
                ) {
                    // Don't add `currV` to filter it out since it's a duplicate.
                    return prev;
                }
            }

            prev.push(currV);

            return prev;
        }, [] as Array<Vector2D>);
    }

    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    /**
     * @returns Rectangular area of vector
     *
     * L * W
     * or
     * Squared of the sides of a square
     */
    area(): number {
        return this.x * this.y;
    }

    /**
     * @returns magnitude or length of vector
     * (Can be used to normalize the vector)
     *
     * Pythagorean's Theorem a^2 + b^2 = c^2
     */
    magnitude(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    /**
     * @returns magnitude squared of vector
     */
    magnitudeSquared(): number {
        return this.x * this.x + this.y * this.y;
    }

    /**
     * Normalizes the vector.
     * So, if the vector is diagonal,
     * it will be where it's supposed to be
     * in a cartesian plane.
     *
     * **i.e. (1, 1) will be (0.707107, 0.0707107)**
     *
     * This returns a new instance of {@link Vector2D},
     * leaving the caller untouched.
     */
    normalized(): Vector2D {
        const rad = 1 / this.magnitude();

        return new Vector2D(this.x * rad, this.y * rad);
    }

    /**
     * Returns a new {@link Vector2D}
     * equal to **90 degrees** to the caller's,
     * leaving the caller untouched.
     */
    perp(): Vector2D {
        return new Vector2D(this.y * -1, this.x);
    }

    /**
     * Rounds the vector down,
     * returning a new {@link Vector2D}
     */
    floor(): Vector2D {
        return new Vector2D(Math.floor(this.x), Math.floor(this.y));
    }

    /**
     * Rounds the vector up,
     * returning a new {@link Vector2D}
     */
    ceil(): Vector2D {
        return new Vector2D(Math.ceil(this.x), Math.ceil(this.y));
    }

    /**
     * Compares this vector and the passed vector,
     * returning a new {@link Vector2D} with the contents
     * of the max between the compared two.
     */
    max(v: Vector2D): Vector2D {
        return new Vector2D(Math.max(this.x, v.x), Math.max(this.y, v.y));
    }

    /**
     * Compares this vector and the passed vector,
     * returning a new {@link Vector2D} with the contents
     * of the min between the compared two.
     */
    min(v: Vector2D): Vector2D {
        return new Vector2D(Math.min(this.x, v.x), Math.min(this.y, v.y));
    }

    /**
     * Calculates the dot product between this and the passed vector.
     */
    dot(v: Vector2D): number {
        return this.x * v.x + this.y * v.y;
    }

    /**
     * Calculates the cross product between this and the passed vector.
     */
    cross(v: Vector2D): number {
        return this.x * v.x - this.y * v.y;
    }

    /**
     * Treat this vector as a polar coordinate (R/magnitude, Theta/angle in radians),
     * returning a new {@link Vector2D} with its cartesian equivalent (x, y) coordinate
     */
    cartesian(): Vector2D {
        return new Vector2D(
            Math.cos(this.y) * this.x,
            Math.sin(this.y) * this.x,
        );
    }

    /**
     * Treat this as a cartesian coordinate (x, y),
     * returning a new {@link Vector2D} with its polar coordinate equivalent (R/magnitude, Theta/angle in radians)
     *
     * The returned {@link Vector2D} will have its `x` coordinate equal to
     * the caller's magnitude acquired from {@link magnitude()} and its
     * `y` coordinate equal to the angle where this vector is at.
     *
     * For example, if the vector is `(1, 1)`, the angle will be `45 degrees`,
     * with the value being `0.7853981633974483`, which is the radians equivalent
     * of `45 degrees`.
     */
    polar(): Vector2D {
        return new Vector2D(this.magnitude(), Math.atan2(this.y, this.x));
    }

    /**
     * Clamp this vector between the minimum's and maximum's.
     *
     * Returns a new {@link Vector2D}
     *
     * - If **this** is greater than the maximum, then the returned
     * vector will be the maximum.
     *
     * - If **this** is less than the minimum, then the returned vector
     * will be the minimum.
     *
     * - If **this** is between the minimum and maximum, then the
     * returned vector will have the same values as **this**.
     */
    clamp(min: Vector2D, max: Vector2D): Vector2D {
        return this.max(min).min(max);
    }

    /**
     * Return the reflection of this Vector along a given Normal
     */
    reflect(normal: Vector2D): Vector2D {
        return this.subtractBy(normal.multiply(2.0 * this.dot(normal)));
    }

    /**
     * Multiply this vector to the passed {@link Vector2D} or `number`.
     * The order of operation is:
     *
     * - Left-hand side: `this`
     * - Right-hand side: `v`
     *
     * Returns a new {@link Vector2D} containing the result.
     */
    multiply(v: Vector2D | number): Vector2D {
        if (typeof v === "number") {
            return new Vector2D(this.x * v, this.y * v);
        } else {
            return new Vector2D(this.x * v.x, this.y * v.y);
        }
    }

    /**
     * Divide this vector by the passed {@link Vector2D} or `number`.
     * Since this is dividing **by**, the order of operation is:
     *
     * - Left-hand side: `this`
     * - Right-hand side: `v`
     *
     * Returns a new {@link Vector2D} containing the result.
     */
    divideBy(v: Vector2D | number): Vector2D {
        if (typeof v === "number") {
            return new Vector2D(this.x / v, this.y / v);
        } else {
            return new Vector2D(this.x / v.x, this.y / v.y);
        }
    }

    /**
     * Divide this vector from the passed {@link Vector2D} or `number`.
     * Since this is dividing **from**, the order of operation is:
     *
     * - Left-hand side: `v`
     * - Right-hand side: `this`
     *
     * Returns a new {@link Vector2D} containing the result.
     */
    divideFrom(v: Vector2D | number): Vector2D {
        if (typeof v === "number") {
            return new Vector2D(v / this.x, v / this.y);
        } else {
            return new Vector2D(v.x / this.x, v.y / this.y);
        }
    }

    /**
     * Add this vector by the passed {@link Vector2D} or `number`.
     * Since this is adding **by**, the order of operation is:
     *
     * - Left-hand side: `this`
     * - Right-hand side: `v`
     *
     * Returns a new {@link Vector2D} containing the result.
     */
    addBy(v: Vector2D | number): Vector2D {
        if (typeof v === "number") {
            return new Vector2D(this.x + v, this.y + v);
        } else {
            return new Vector2D(this.x + v.x, this.y + v.y);
        }
    }

    /**
     * Add this vector from the passed {@link Vector2D} or `number`.
     * Since this is adding **from**, the order of operation is:
     *
     * - Left-hand side: `v`
     * - Right-hand side: `this`
     *
     * Returns a new {@link Vector2D} containing the result.
     */
    addFrom(v: Vector2D | number): Vector2D {
        if (typeof v === "number") {
            return new Vector2D(v + this.x, v + this.y);
        } else {
            return new Vector2D(v.x + this.x, v.y + this.y);
        }
    }

    /**
     * Subtract this vector by the passed {@link Vector2D} or `number`.
     * Since this is adding **by**, the order of operation is:
     *
     * - Left-hand side: `this`
     * - Right-hand side: `v`
     *
     * Returns a new {@link Vector2D} containing the result.
     */
    subtractBy(v: Vector2D | number): Vector2D {
        if (typeof v === "number") {
            return new Vector2D(this.x - v, this.y - v);
        } else {
            return new Vector2D(this.x - v.x, this.y - v.y);
        }
    }

    /**
     * Subtract this vector by the passed {@link Vector2D} or `number`.
     * Since this is adding **from**, the order of operation is:
     *
     * - Left-hand side: `v`
     * - Right-hand side: `this`
     *
     * Returns a new {@link Vector2D} containing the result.
     */
    subtractFrom(v: Vector2D | number): Vector2D {
        if (typeof v === "number") {
            return new Vector2D(v - this.x, v - this.y);
        } else {
            return new Vector2D(v.x - this.x, v.y - this.y);
        }
    }

    eq(v: Vector2D): boolean {
        return this.x === v.x && this.y === v.y;
    }

    neq(v: Vector2D): boolean {
        return this.x === v.x && this.y === v.y;
    }

    lt(v: Vector2D): boolean {
        return this.y < v.y || (this.x < v.x && this.y === v.y);
    }

    gt(v: Vector2D): boolean {
        return this.y > v.y || (this.x > v.x && this.y === v.y);
    }

    toString(): string {
        return `(${this.x}, ${this.y})`;
    }
}

abstract class Shape {
    isRectangle(): this is Rectangle {
        return this instanceof Rectangle;
    }

    isCircle(): this is Circle {
        return this instanceof Circle;
    }

    isRay(): this is Ray {
        return this instanceof Ray;
    }

    isLine(): this is Line {
        return this instanceof Line;
    }

    isPoint(): this is Point {
        return this instanceof Point;
    }

    isTriangle(): this is Triangle {
        return this instanceof Triangle;
    }

    /**
     * Checks if this shape contains the passed shape
     */
    abstract contains(shape: Shape): boolean;
    /**
     * Returns all the points of this shape's and the passed shape's intersection points.
     */
    abstract intersects(shape: Shape): Array<Vector2D>;
    /**
     * Checks if this shape overlaps with the passed shape
     */
    abstract overlaps(shape: Shape): boolean;
    /**
     * Returns the closest Point (Vector) from this shape to the passed shape
     */
    abstract closest(shape: Shape): Vector2D;
}

class Point extends Shape {
    #closestPoint(shape: Point): Vector2D {
        // Since we're returning the closest point from this Point to the passed Point, we
        // just return this point
        return this.position;
    }

    #closestLine(shape: Line): Vector2D {
        return shape.closest(this);
    }

    #closestRectangle(shape: Rectangle): Vector2D {
        return shape.closest(this);
    }

    #closestTriangle(shape: Triangle): Vector2D {
        return shape.closest(this);
    }

    #closestCircle(shape: Circle): Vector2D {
        return shape.closest(this);
    }

    // @ts-ignore
    #closestRay(shape: Ray): Vector2D {
        unimplemented();
    }

    #containsPoint(shape: Point): boolean {
        return (
            this.position.subtractBy(shape.position).magnitudeSquared() <
            Vector2D.epsilon
        );
    }

    #containsLine(_: Line): boolean {
        // A point cannot contain a line.
        return false;
    }

    #containsRectangle(_: Rectangle): boolean {
        // A point cannot contain a rectangle
        return false;
    }

    #containsTriangle(_: Triangle): boolean {
        // A point cannot contain a triangle
        return false;
    }

    #containsCircle(_: Circle): boolean {
        // A point cannot contain a circle
        return false;
    }

    #containsRay(_: Ray): boolean {
        // A point cannot contain a ray
        return false;
    }

    // @ts-ignore
    closest(shape: Shape): Vector2D {
        if (shape.isPoint()) {
            return this.#closestPoint(shape);
        }

        if (shape.isLine()) {
            return this.#closestLine(shape);
        }

        if (shape.isRectangle()) {
            return this.#closestRectangle(shape);
        }

        if (shape.isTriangle()) {
            return this.#closestTriangle(shape);
        }

        if (shape.isCircle()) {
            return this.#closestCircle(shape);
        }

        if (shape.isRay()) {
            return this.#closestRay(shape);
        }

        unreachable();
    }

    contains(shape: Shape): boolean {
        if (shape.isPoint()) {
            return this.#containsPoint(shape);
        }

        if (shape.isLine()) {
            return this.#containsLine(shape);
        }

        if (shape.isRectangle()) {
            return this.#containsRectangle(shape);
        }

        if (shape.isTriangle()) {
            return this.#containsTriangle(shape);
        }

        if (shape.isCircle()) {
            return this.#containsCircle(shape);
        }

        if (shape.isRay()) {
            return this.#containsRay(shape);
        }

        unreachable();

        // Satisfy typescript
        return false;
    }

    intersects(shape: Shape): Array<Vector2D> {
        unimplemented();

        // Satisfy typescript
        return [];
    }

    overlaps(shape: Shape): boolean {
        if (shape.isPoint()) {
            return this.#containsPoint(shape);
        }

        if (shape.isLine()) {
            return shape.contains(this);
        }

        if (shape.isRectangle()) {
            return this.#containsRectangle(shape);
        }

        if (shape.isTriangle()) {
            return this.#containsTriangle(shape);
        }

        if (shape.isCircle()) {
            return this.#containsCircle(shape);
        }

        if (shape.isRay()) {
            return this.#containsRay(shape);
        }

        unreachable();

        // Satisfy typescript
        return false;
    }

    position: Vector2D;

    constructor(position: Vector2D) {
        super();

        this.position = position;
    }
}

class Line extends Shape {
    #closestPoint(shape: Point): Vector2D {
        const len = this.vector();
        const unitDis = clamp(
            len.dot(shape.position.subtractBy(this.start)) /
                len.magnitudeSquared(),
            0.0,
            1.0,
        );

        return this.start.addBy(len.multiply(unitDis));
    }

    // @ts-ignore
    #closestLine(shape: Line): Vector2D {
        unimplemented();
    }

    #closestRectangle(shape: Rectangle): Vector2D {
        return shape.closest(this);
    }

    #closestTriangle(shape: Triangle): Vector2D {
        return shape.closest(this);
    }

    #closestCircle(shape: Circle): Vector2D {
        const p = shape.closest(this);

        return this.closest(new Point(p));
    }

    // @ts-ignore
    #closestRay(shape: Ray): Vector2D {
        unimplemented();
    }

    #overlapsPoint(shape: Point): boolean {
        return this.contains(shape);
    }

    #overlapsLine(shape: Line): boolean {
        const distance =
            (shape.end.y - shape.start.y) * (this.end.x - this.start.x) -
            (shape.end.x - shape.start.x) * (this.end.y - this.start.y);
        const unitA =
            ((shape.end.x - shape.start.x) * (this.start.y - shape.start.y) -
                (shape.end.y - shape.start.y) *
                    (this.start.x - shape.start.x)) /
            distance;
        const unitB =
            ((this.end.x - this.start.x) * (this.start.y - shape.start.y) -
                (this.end.y - this.start.y) * (this.start.x - shape.start.x)) /
            distance;

        return unitA >= 0 && unitA <= 1 && unitB >= 0 && unitB <= 1;
    }

    #overlapsRectangle(shape: Rectangle): boolean {
        return shape.overlaps(this);
    }

    #overlapsTriangle(shape: Triangle): boolean {
        return shape.overlaps(this);
    }

    #overlapsCircle(shape: Circle): boolean {
        return shape.overlaps(this);
    }

    #overlapsRay(_: Ray): boolean {
        // A ray cannot contain a line
        return false;
    }

    #containsPoint(shape: Point): boolean {
        const d =
            (shape.position.x - this.start.x) * (this.end.y - this.start.y) -
            (shape.position.y - this.start.y) * (this.end.x - this.start.x);

        if (Math.abs(d) < Vector2D.epsilon) {
            // Point is along this Line
            const unit =
                this.vector().dot(shape.position.subtractBy(this.start)) /
                this.vector().magnitudeSquared();

            return unit >= 0.0 && unit <= 1.0;
        }

        return false;
    }

    #containsLine(shape: Line): boolean {
        // If this Line overlaps with the other Line's start point AND other Line's end point
        return (
            this.overlaps(new Point(shape.start)) &&
            this.overlaps(new Point(shape.end))
        );
    }

    #containsRectangle(_: Rectangle): boolean {
        // A line cannot contain a rectangle
        return false;
    }

    #containsTriangle(_: Triangle): boolean {
        // A line cannot contain a triangle
        return false;
    }

    #containsCircle(_: Circle): boolean {
        // A line cannot contain a rectangle
        return false;
    }

    #containsRay(_: Ray): boolean {
        // A line cannot contain a ray
        return false;
    }

    #intersectsPoint(shape: Point): Array<Vector2D> {
        if (this.contains(shape)) {
            return [shape.position];
        }

        return [];
    }

    #intersectsLine(shape: Line): Array<Vector2D> {
        const rd = this.vector().cross(shape.vector());

        // Parallel or Colinear, TODO: Return two points
        if (rd === 0) {
            return [];
        }

        const inverseRd = 1.0 / rd;

        const rn =
            ((shape.end.x - shape.start.x) * (this.start.y - shape.start.y) -
                (shape.end.y - shape.start.y) *
                    (this.start.x - shape.start.x)) *
            inverseRd;
        const sn =
            ((this.end.x - this.start.x) * (this.start.y - shape.start.y) -
                (this.end.y - this.start.y) * (this.start.x - shape.start.x)) *
            inverseRd;

        if (rn < 0.0 || rn > 1.0 || sn < 0.0 || sn > 1.0) {
            return [];
        }

        return [this.start.addBy(rn).multiply(this.vector())];
    }

    #intersectsRectangle(shape: Rectangle): Array<Vector2D> {
        return shape.intersects(this);
    }

    #intersectsTriangle(shape: Triangle): Array<Vector2D> {
        return shape.intersects(this);
    }

    #intersectsCircle(shape: Circle): Array<Vector2D> {
        return shape.intersects(this);
    }

    #intersectsRay(shape: Ray): Array<Vector2D> {
        return shape.intersects(this);
    }

    overlaps(shape: Shape): boolean {
        if (shape.isPoint()) {
            return this.#overlapsPoint(shape);
        }

        if (shape.isLine()) {
            return this.#overlapsLine(shape);
        }

        if (shape.isRectangle()) {
            return this.#overlapsRectangle(shape);
        }

        if (shape.isTriangle()) {
            return this.#overlapsTriangle(shape);
        }

        if (shape.isCircle()) {
            return this.#overlapsCircle(shape);
        }

        if (shape.isRay()) {
            return this.#overlapsRay(shape);
        }

        unreachable();
        // Satisfy TypeScript
        return false;
    }

    // @ts-ignore
    closest(shape: Shape): Vector2D {
        if (shape.isPoint()) {
            return this.#closestPoint(shape);
        }

        if (shape.isLine()) {
            return this.#closestLine(shape);
        }

        if (shape.isRectangle()) {
            return this.#closestRectangle(shape);
        }

        if (shape.isTriangle()) {
            return this.#closestTriangle(shape);
        }

        if (shape.isCircle()) {
            return this.#closestCircle(shape);
        }

        if (shape.isRay()) {
            return this.#closestRay(shape);
        }

        unreachable();
    }

    contains(shape: Shape): boolean {
        if (shape.isPoint()) {
            return this.#containsPoint(shape);
        }

        if (shape.isLine()) {
            return this.#containsLine(shape);
        }

        if (shape.isRectangle()) {
            return this.#containsRectangle(shape);
        }

        if (shape.isTriangle()) {
            return this.#containsTriangle(shape);
        }

        if (shape.isCircle()) {
            return this.#containsCircle(shape);
        }

        if (shape.isRay()) {
            return this.#containsRay(shape);
        }

        unreachable();
        // Satisfy TypeScript
        return false;
    }

    intersects(shape: Shape): Array<Vector2D> {
        if (shape.isPoint()) {
            return this.#intersectsPoint(shape);
        }

        if (shape.isLine()) {
            return this.#intersectsLine(shape);
        }

        if (shape.isRectangle()) {
            return this.#intersectsRectangle(shape);
        }

        if (shape.isTriangle()) {
            return this.#intersectsTriangle(shape);
        }

        if (shape.isCircle()) {
            return this.#intersectsCircle(shape);
        }

        if (shape.isRay()) {
            return this.#intersectsRay(shape);
        }

        unreachable();
        // Satisfy TypeScript
        return [];
    }

    start: Vector2D;
    end: Vector2D;

    constructor(start: Vector2D, end: Vector2D) {
        super();

        this.start = start;
        this.end = end;
    }

    /**
     * Returns a new vector containing the distance from `start` to `end`
     */
    vector(): Vector2D {
        return this.end.subtractBy(this.start);
    }

    /**
     * Returns the length or `magnitude` of this Line
     */
    length(): number {
        return this.vector().magnitude();
    }

    /**
     * Returns the squared of the length or `magnitude` of this Line
     */
    lengthSquared(): number {
        return this.vector().magnitudeSquared();
    }

    /**
     * Returns a point along the line based on the passed real `distance`.
     *
     * A real distance means it's acquired after normalizing the line's vector.
     * It's self-explanatory where it's the distance one would take if, for example,
     * going diagonally.
     */
    realPoint(distance: number): Vector2D {
        return this.start.addBy(this.vector().normalized().multiply(distance));
    }

    /**
     * Returns a point along the line based on the passed unit `distance`.
     *
     * The returned point is acquired without normalizing the line's vector.
     */
    unitPoint(distance: number): Vector2D {
        return this.start.addBy(this.vector().multiply(distance));
    }

    /**
     * Determines where a point lies in this Line.
     *
     * - -1 being left
     * - 1 being right
     * - 0 being neither sides
     */
    side(point: Vector2D): -1 | 1 | 0 {
        const d = this.vector().cross(this.start.subtractFrom(point));

        return d < 0 ? -1 : d > 0 ? 1 : 0;
    }

    coefficients(): Vector2D {
        if (Math.abs(this.end.x - this.start.x) < Vector2D.epsilon) {
            return new Vector2D(Infinity, Infinity);
        }

        const m = (this.end.y - this.start.y) / (this.end.x - this.start.x);

        return new Vector2D(m, m * -1 * this.start.x + this.start.y);
    }
}

class Rectangle extends Shape {
    #closestPoint(shape: Point): Vector2D {
        const c1 = this.top().closest(shape);
        const c2 = this.bottom().closest(shape);
        const c3 = this.left().closest(shape);
        const c4 = this.right().closest(shape);

        const d1 = c1.subtractBy(shape.position).magnitudeSquared();
        const d2 = c2.subtractBy(shape.position).magnitudeSquared();
        const d3 = c3.subtractBy(shape.position).magnitudeSquared();
        const d4 = c4.subtractBy(shape.position).magnitudeSquared();

        let dmin = d1;
        let cmin = c1;

        if (d2 < dmin) {
            dmin = d2;
            cmin = c2;
        }

        if (d3 < dmin) {
            dmin = d3;
            cmin = c3;
        }

        if (d4 < dmin) {
            dmin = d4;
            cmin = c4;
        }

        return cmin;
    }

    // @ts-ignore
    #closestLine(shape: Line): Vector2D {
        unimplemented();
    }

    // @ts-ignore
    #closestRectangle(shape: Rectangle): Vector2D {
        unimplemented();
    }

    // @ts-ignore
    #closestTriangle(shape: Triangle): Vector2D {
        unimplemented();
    }

    // @ts-ignore
    #closestCircle(shape: Circle): Vector2D {
        unimplemented();
    }

    // @ts-ignore
    #closestRay(shape: Ray): Vector2D {
        unimplemented();
    }

    #overlapsPoint(shape: Point): boolean {
        return this.contains(shape);
    }

    #overlapsLine(shape: Line): boolean {
        return (
            this.contains(new Point(shape.start)) ||
            this.contains(new Point(shape.end)) ||
            this.top().overlaps(shape) ||
            this.bottom().overlaps(shape) ||
            this.left().overlaps(shape) ||
            this.right().overlaps(shape)
        );
    }

    #overlapsRectangle(shape: Rectangle): boolean {
        return (
            this.position.x <= shape.position.x + shape.dimensions.x &&
            this.position.x + this.dimensions.x >= shape.position.x &&
            this.position.y <= shape.position.y + shape.dimensions.y &&
            this.position.y + this.dimensions.y >= shape.position.y
        );
    }

    #overlapsTriangle(shape: Triangle): boolean {
        return shape.overlaps(this);
    }

    #overlapsCircle(shape: Circle): boolean {
        return shape.overlaps(this);
    }

    #overlapsRay(shape: Ray): boolean {
        // A ray cannot overlap with a rectangle
        return false;
    }

    #containsPoint(shape: Point): boolean {
        return !(
            // If the point's position is < where the left and upper side of the
            // rectangle is, then the point is outside the rectange
            (
                shape.position.x < this.position.x ||
                shape.position.y < this.position.y ||
                // If the point's position is > where the right and bottom side of the
                // rectangle is, then the point is outside the rectangle
                shape.position.x > this.position.x + this.dimensions.x ||
                shape.position.y > this.position.y + this.dimensions.y
            )
        );
    }

    #containsLine(shape: Line): boolean {
        // We just check if the rectangle contains the start and end points of the line.
        return (
            this.contains(new Point(shape.start)) &&
            this.contains(new Point(shape.end))
        );
    }

    #containsRectangle(shape: Rectangle): boolean {
        return (
            // The passed rectangle's left and right sides are < this rectangle's
            shape.position.x >= this.position.x &&
            shape.position.x + shape.dimensions.x <=
                this.position.x + this.dimensions.x &&
            // The passed rectangle's top and bottom sides are < this rectangle's
            shape.position.y >= this.position.y &&
            shape.position.y + shape.dimensions.y <=
                this.position.y + this.dimensions.y
        );
    }

    #containsTriangle(shape: Triangle): boolean {
        // The rectangle contains all the lines/sides of the triangle
        return (
            this.contains(shape.side(0)) &&
            this.contains(shape.side(1)) &&
            this.contains(shape.side(2))
        );
    }

    #containsCircle(shape: Circle): boolean {
        return (
            this.position.x + shape.radius <= shape.position.x &&
            shape.position.x <=
                this.position.x + this.dimensions.x - shape.radius &&
            this.position.y + shape.radius <= shape.position.y &&
            shape.position.y <=
                this.position.y + this.dimensions.y - shape.radius
        );
    }

    #containsRay(_: Ray): boolean {
        // A rectangle cannot contain a ray
        return false;
    }

    #intersectsPoint(shape: Point): Array<Vector2D> {
        for (let i = 0; i < this.sideCount(); ++i) {
            if (this.side(i).contains(shape)) {
                return [shape.position];
            }
        }

        return [];
    }

    #intersectsLine(shape: Line): Array<Vector2D> {
        const intersections = [];

        for (let i = 0; i < this.sideCount(); ++i) {
            const v = this.side(i).intersects(shape);

            intersections.push(...v);
        }

        return Vector2D.filterDuplicateVectors(intersections);
    }

    #intersectsRectangle(shape: Rectangle): Array<Vector2D> {
        const intersections = [];

        for (let i = 0; i < shape.sideCount(); ++i) {
            const v = this.intersects(shape.side(i));

            intersections.push(...v);
        }

        return Vector2D.filterDuplicateVectors(intersections);
    }

    #intersectsTriangle(shape: Triangle): Array<Vector2D> {
        return shape.intersects(this);
    }

    #intersectsCircle(shape: Circle): Array<Vector2D> {
        return shape.intersects(this);
    }

    #intersectsRay(_: Ray): Array<Vector2D> {
        // Rectangle cannot intersect with ray.
        return [];
    }

    // @ts-ignore
    closest(shape: Shape): Vector2D {
        if (shape.isPoint()) {
            return this.#closestPoint(shape);
        }

        if (shape.isLine()) {
            return this.#closestLine(shape);
        }

        if (shape.isRectangle()) {
            return this.#closestRectangle(shape);
        }

        if (shape.isTriangle()) {
            return this.#closestTriangle(shape);
        }

        if (shape.isCircle()) {
            return this.#closestCircle(shape);
        }

        if (shape.isRay()) {
            return this.#closestRay(shape);
        }

        unreachable();
    }

    overlaps(shape: Shape): boolean {
        if (shape.isPoint()) {
            return this.#overlapsPoint(shape);
        }

        if (shape.isLine()) {
            return this.#overlapsLine(shape);
        }

        if (shape.isRectangle()) {
            return this.#overlapsRectangle(shape);
        }

        if (shape.isTriangle()) {
            return this.#overlapsTriangle(shape);
        }

        if (shape.isCircle()) {
            return this.#overlapsCircle(shape);
        }

        if (shape.isRay()) {
            return this.#overlapsRay(shape);
        }

        unreachable();

        // Satisfy TypeScript
        return false;
    }

    contains(shape: Shape): boolean {
        if (shape.isPoint()) {
            return this.#containsPoint(shape);
        }

        if (shape.isLine()) {
            return this.#containsLine(shape);
        }

        if (shape.isRectangle()) {
            return this.#containsRectangle(shape);
        }

        if (shape.isTriangle()) {
            return this.#containsTriangle(shape);
        }

        if (shape.isCircle()) {
            return this.#containsCircle(shape);
        }

        if (shape.isRay()) {
            return this.#containsRay(shape);
        }

        unreachable();

        // Satisfy TypeScript
        return false;
    }

    intersects(shape: Shape): Array<Vector2D> {
        if (shape.isPoint()) {
            return this.#intersectsPoint(shape);
        }

        if (shape.isLine()) {
            return this.#intersectsLine(shape);
        }

        if (shape.isRectangle()) {
            return this.#intersectsRectangle(shape);
        }

        if (shape.isTriangle()) {
            return this.#intersectsTriangle(shape);
        }

        if (shape.isCircle()) {
            return this.#intersectsCircle(shape);
        }

        if (shape.isRay()) {
            return this.#intersectsRay(shape);
        }

        unreachable();

        // Satisfy TypeScript
        return [];
    }

    position: Vector2D;
    dimensions: Vector2D;

    constructor(position: Vector2D, dimensions: Vector2D) {
        super();

        this.position = position;
        this.dimensions = dimensions;
    }

    /**
     * Returns the center point of this {@link Rectangle}
     */
    center(): Vector2D {
        return this.position.addBy(this.dimensions.multiply(0.5));
    }

    /**
     * Returns the top {@link Line} segment of this {@link Rectangle}
     */
    top(): Line {
        return new Line(
            this.position,
            new Vector2D(this.position.x + this.dimensions.x, this.position.y),
        );
    }

    /**
     * Returns the bottom {@link Line} segment of this {@link Rectangle}
     */
    bottom(): Line {
        return new Line(
            new Vector2D(this.position.x, this.position.y + this.dimensions.y),
            this.position.addBy(this.dimensions),
        );
    }

    /**
     * Returns the left {@link Line} segment of this {@link Rectangle}
     */
    left(): Line {
        return new Line(
            this.position,
            new Vector2D(this.position.x, this.position.y + this.dimensions.y),
        );
    }

    /**
     * Returns the right {@link Line} segment of this {@link Rectangle}
     */
    right(): Line {
        return new Line(
            new Vector2D(this.position.x + this.dimensions.x, this.position.y),
            this.position.addBy(this.dimensions),
        );
    }

    /**
     * Returns a line from a side based on index.
     * This starts from the top, going clockwise or to the right.
     */
    side(index: number): Line {
        if ((index & 0b11) === 0) {
            return this.top();
        }

        if ((index & 0b11) === 1) {
            return this.right();
        }

        if ((index & 0b11) === 2) {
            return this.bottom();
        }

        if ((index & 0b11) === 3) {
            return this.left();
        }

        throw new Error("Invalid index parameter");
    }

    area(): number {
        return this.dimensions.x * this.dimensions.y;
    }

    perimeter(): number {
        return (this.dimensions.x + this.dimensions.y) * 2;
    }

    sideCount(): number {
        return 4;
    }
}

class Ray extends Shape {
    #containsPoint(shape: Point): boolean {
        const originToPoint = shape.position.subtractBy(this.origin);
        const dotProduct = originToPoint.dot(this.direction);

        if (dotProduct < 0) {
            // Point is behind ray's origin
            return false;
        }

        const projection = new Vector2D(
            this.direction.x * dotProduct,
            this.direction.y * dotProduct,
        );

        // Check if originToPoint lies along the ray's direction
        const distance = Math.sqrt(
            Math.pow(projection.x - originToPoint.x, 2) +
                Math.pow(projection.y - originToPoint.y, 2),
        );

        return distance < Vector2D.epsilon;
    }

    #intersectsPoint(shape: Point): Array<Vector2D> {
        const line = new Line(this.origin, this.origin.addBy(this.direction));

        if (Math.abs(line.side(shape.position)) < Vector2D.epsilon) {
            return [shape.position];
        }

        return [];
    }

    #intersectsLine(shape: Line): Array<Vector2D> {
        const lineDir = shape.vector();
        const lineToOrigin = shape.start.subtractBy(this.origin);
        const crossProduct1 = this.direction.cross(lineDir);
        const crossProduct2 = lineToOrigin.cross(lineDir);

        if (crossProduct1 === 0) {
            if (crossProduct2 === 0) {
                return [this.origin]; // Co-linear
            } else {
                return []; // Parallel
            }
        }

        const crossProduct3 = lineToOrigin.cross(this.direction);
        // Distance along ray to intersection
        const t1 = crossProduct2 / crossProduct1;
        // Distance along line to intersection
        const t2 = crossProduct3 / crossProduct1;

        if (t1 >= 0 && t2 >= 0 && t2 <= 1) {
            // Intersects
            return [this.origin.addBy(this.direction).multiply(t1)];
        }

        // Intersects but is behind the ray's origin or outside of the line's bounds
        return [];
    }

    #intersectsRectangle(shape: Rectangle): Array<Vector2D> {
        const intersections = [];

        for (let i = 0; i < shape.sideCount(); ++i) {
            const v = this.intersects(shape.side(i));

            intersections.push(...v);
        }

        return Vector2D.filterDuplicateVectors(intersections);
    }

    #intersectsTriangle(shape: Triangle): Array<Vector2D> {
        const intersections = [];

        for (let i = 0; i < shape.sideCount(); ++i) {
            const v = this.intersects(shape.side(i));

            intersections.push(...v);
        }

        return Vector2D.filterDuplicateVectors(intersections);
    }

    #intersectsCircle(shape: Circle): Array<Vector2D> {
        const A = this.direction.magnitudeSquared();
        const B =
            2.0 *
            (this.origin.dot(this.direction) -
                shape.position.dot(this.direction));
        const C =
            shape.position.magnitudeSquared() +
            this.origin.magnitudeSquared() -
            2.0 * shape.position.x * this.origin.x -
            2.0 * shape.position.y * this.origin.y -
            Math.pow(shape.radius, 2);
        const D = Math.pow(B, 2) - 4.0 * A * C;

        if (D < 0.0) {
            return [];
        }

        const sqrtD = Math.sqrt(D);
        const s1 = (B * -1 + sqrtD) / (2.0 * A);
        const s2 = (B * -1 - sqrtD) / (2.0 * A);

        if (s1 < 0 && s2 < 0) {
            return [];
        }

        if (s1 < 0) {
            return [this.origin.addBy(this.direction.multiply(s2))];
        }

        if (s2 < 0) {
            return [this.origin.addBy(this.direction.multiply(s1))];
        }

        const [minS, maxS] = minMax(s1, s2);

        return [
            this.origin.addBy(this.direction.multiply(minS)),
            this.origin.addBy(this.direction.multiply(maxS)),
        ];
    }

    #intersectsRay(shape: Ray): Array<Vector2D> {
        const originToOrigin = shape.origin.subtractBy(this.origin);
        const crossProduct1 = this.direction.cross(shape.direction);
        const crossProduct2 = originToOrigin.cross(shape.direction);

        if (crossProduct1 === 0) {
            if (crossProduct2 === 0) {
                return [this.origin]; // Co-linear
            }

            return []; // Parallel
        }

        const crossProduct3 = originToOrigin.cross(this.direction);
        const t1 = crossProduct2 / crossProduct1; // Distance along this ray to intersection
        const t2 = crossProduct3 / crossProduct1; // Distance along the passed ray to intersection

        if (t1 >= 0 && t2 >= 0) {
            return [this.origin.addBy(this.direction.multiply(t1))];
        }

        return []; // Intersects, but behind this ray's origin.
    }

    #collisionPoint(shape: Point): undefined | [Vector2D, Vector2D] {
        todo();

        return undefined;
    }

    #collisionLine(shape: Line): undefined | [Vector2D, Vector2D] {
        const vIntersection = this.intersects(shape);

        if (vIntersection.length !== 0) {
            return [
                vIntersection[0],
                shape
                    .vector()
                    .perp()
                    .normalized()
                    .multiply(shape.side(this.origin)),
            ];
        }

        return undefined;
    }

    #collisionRectangle(shape: Rectangle): undefined | [Vector2D, Vector2D] {
        let closestIntersection: undefined | Vector2D;
        let vIntersectionNormal: undefined | Vector2D;
        let closestDistance = Infinity;
        let bCollide = false;

        for (let i = 0; i < shape.sideCount(); ++i) {
            const v = this.intersects(shape.side(i));

            if (v.length !== 0) {
                bCollide = true;
                const d = v[0].subtractBy(this.origin).magnitudeSquared();

                if (d < closestDistance) {
                    closestDistance = d;
                    closestIntersection = v[0];
                    vIntersectionNormal = shape
                        .side(i)
                        .vector()
                        .perp()
                        .normalized();
                }
            }
        }

        if (bCollide) {
            if (closestIntersection && vIntersectionNormal) {
                return [closestIntersection, vIntersectionNormal];
            }

            unreachable();
        }

        return undefined;
    }

    #collisionTriangle(shape: Triangle): undefined | [Vector2D, Vector2D] {
        let closestIntersection: undefined | Vector2D;
        let vIntersectionNormal: undefined | Vector2D;
        let closestDistance = Infinity;
        let bCollide = false;

        for (let i = 0; i < shape.sideCount(); ++i) {
            const v = this.intersects(shape.side(i));

            if (v.length !== 0) {
                bCollide = true;
                const d = v[0].subtractBy(this.origin).magnitudeSquared();

                if (d < closestDistance) {
                    closestDistance = d;
                    closestIntersection = v[0];
                    vIntersectionNormal = shape
                        .side(i)
                        .vector()
                        .perp()
                        .normalized();
                }
            }
        }

        if (bCollide) {
            if (closestIntersection && vIntersectionNormal) {
                return [closestIntersection, vIntersectionNormal];
            }

            unreachable();
        }

        return undefined;
    }

    #collisionCircle(shape: Circle): undefined | [Vector2D, Vector2D] {
        const vIntersection = this.intersects(shape);

        if (vIntersection.length !== 0) {
            return [
                vIntersection[0],
                vIntersection[0].subtractBy(shape.position).normalized(),
            ];
        }

        return undefined;
    }

    #collisionRay(shape: Ray): undefined | [Vector2D, Vector2D] {
        unimplemented();
        return undefined;
    }

    #reflectPoint(shape: Point): undefined | Ray {
        todo();

        return undefined;
    }

    #reflectLine(shape: Line): undefined | Ray {
        const vCollision = this.collision(shape);

        if (vCollision) {
            return new Ray(
                vCollision[0],
                this.direction.reflect(vCollision[1]),
            );
        }

        return undefined;
    }

    #reflectRectangle(shape: Rectangle): undefined | Ray {
        const vCollision = this.collision(shape);

        if (vCollision) {
            return new Ray(
                vCollision[0],
                this.direction.reflect(vCollision[1]),
            );
        }

        return undefined;
    }

    #reflectTriangle(shape: Triangle): undefined | Ray {
        const vCollision = this.collision(shape);

        if (vCollision) {
            return new Ray(
                vCollision[0],
                this.direction.reflect(vCollision[1]),
            );
        }

        return undefined;
    }

    #reflectCircle(shape: Circle): undefined | Ray {
        const vCollision = this.collision(shape);

        if (vCollision) {
            return new Ray(
                vCollision[0],
                this.direction.reflect(vCollision[1]),
            );
        }

        return undefined;
    }

    #reflectRay(shape: Ray): undefined | Ray {
        // Can't reflect a ray to a ray
        return undefined;
    }

    // @ts-ignore
    closest(shape: Shape): Vector2D {
        unimplemented();
    }

    overlaps(shape: Shape): boolean {
        // A ray cannot overlap with any shape, only collides (to its destination), intersects, projects, and reflects
        return false;
    }

    contains(shape: Shape): boolean {
        if (shape.isPoint()) {
            return this.#containsPoint(shape);
        }

        // A ray cannot contain any shape except a Point.
        return false;
    }

    intersects(shape: Shape): Array<Vector2D> {
        if (shape.isPoint()) {
            return this.#intersectsPoint(shape);
        }

        if (shape.isLine()) {
            return this.#intersectsLine(shape);
        }

        if (shape.isRectangle()) {
            return this.#intersectsRectangle(shape);
        }

        if (shape.isTriangle()) {
            return this.#intersectsTriangle(shape);
        }

        if (shape.isCircle()) {
            return this.#intersectsCircle(shape);
        }

        if (shape.isRay()) {
            return this.#intersectsRay(shape);
        }

        unreachable();

        // Satisfy TypeScript
        return [];
    }

    /**
     * Returns collision point and collision normal of ray and shape if they collide
     */
    collision(shape: Shape): undefined | [Vector2D, Vector2D] {
        if (shape.isPoint()) {
            return this.#collisionPoint(shape);
        }

        if (shape.isLine()) {
            return this.#collisionLine(shape);
        }

        if (shape.isRectangle()) {
            return this.#collisionRectangle(shape);
        }

        if (shape.isTriangle()) {
            return this.#collisionTriangle(shape);
        }

        if (shape.isCircle()) {
            return this.#collisionCircle(shape);
        }

        if (shape.isRay()) {
            return this.#collisionRay(shape);
        }

        unreachable();

        return undefined;
    }

    reflect(shape: Shape): undefined | Ray {
        if (shape.isPoint()) {
            return this.#reflectPoint(shape);
        }

        if (shape.isLine()) {
            return this.#reflectLine(shape);
        }

        if (shape.isRectangle()) {
            return this.#reflectRectangle(shape);
        }

        if (shape.isTriangle()) {
            return this.#reflectTriangle(shape);
        }

        if (shape.isCircle()) {
            return this.#reflectCircle(shape);
        }

        if (shape.isRay()) {
            return this.#reflectRay(shape);
        }

        unreachable();

        return undefined;
    }

    origin: Vector2D;
    direction: Vector2D;

    constructor(
        origin: Vector2D = new Vector2D(0, 0),
        direction: Vector2D = new Vector2D(0, 0),
    ) {
        super();

        this.origin = origin;
        this.direction = direction;
    }
}

class Circle extends Shape {
    #closestPoint(shape: Point): Vector2D {
        return this.position.addBy(
            shape.position
                .subtractBy(this.position)
                .normalized()
                .multiply(this.radius),
        );
    }

    #closestLine(shape: Line): Vector2D {
        const p1 = shape.closest(new Point(this.position));

        return this.position.addBy(
            p1.subtractBy(this.position).normalized().multiply(this.radius),
        );
    }

    #closestRectangle(shape: Rectangle): Vector2D {
        return shape.closest(this);
    }

    #closestTriangle(shape: Triangle): Vector2D {
        return shape.closest(this);
    }

    #closestCircle(shape: Circle): Vector2D {
        return this.closest(new Point(shape.position));
    }

    // @ts-ignore
    #closestRay(shape: Ray): Vector2D {
        unimplemented();
    }

    #overlapsPoint(shape: Point): boolean {
        return this.contains(shape);
    }

    #overlapsLine(shape: Line): boolean {
        const closest = shape.closest(new Point(this.position));

        return (
            this.position.subtractBy(closest).magnitudeSquared() <=
            this.radius * this.radius
        );
    }

    #overlapsRectangle(shape: Rectangle): boolean {
        const overlap = new Vector2D(
            clamp(
                this.position.x,
                shape.position.x,
                shape.position.x + shape.dimensions.x,
            ),
            clamp(
                this.position.y,
                shape.position.y,
                shape.position.y + shape.dimensions.y,
            ),
        )
            .subtractBy(this.position)
            .magnitudeSquared();

        return overlap - Math.pow(this.radius, 2) < 0;
    }

    #overlapsTriangle(shape: Triangle): boolean {
        return shape.overlaps(this);
    }

    #overlapsCircle(shape: Circle): boolean {
        return (
            this.position.subtractBy(shape.position).magnitudeSquared() <=
            Math.pow(this.radius + shape.radius, 2)
        );
    }

    #overlapsRay(shape: Ray): boolean {
        // A circle cannot overlap a ray
        return false;
    }

    #containsPoint(shape: Point): boolean {
        return (
            this.position.subtractBy(shape.position).magnitudeSquared() <=
            Math.pow(this.radius, 2)
        );
    }

    #containsLine(shape: Line): boolean {
        return (
            this.contains(new Point(shape.start)) &&
            this.contains(new Point(shape.end))
        );
    }

    #containsRectangle(shape: Rectangle): boolean {
        return (
            this.contains(new Point(shape.position)) &&
            this.contains(
                new Point(
                    new Vector2D(
                        shape.position.x + shape.position.y,
                        shape.position.y,
                    ),
                ),
            ) &&
            this.contains(
                new Point(
                    new Vector2D(
                        shape.position.x,
                        shape.position.y + shape.dimensions.y,
                    ),
                ),
            ) &&
            this.contains(new Point(shape.position.addBy(shape.dimensions)))
        );
    }

    #containsTriangle(shape: Triangle): boolean {
        return (
            this.contains(new Point(shape.position[0])) &&
            this.contains(new Point(shape.position[1])) &&
            this.contains(new Point(shape.position[2]))
        );
    }

    #containsCircle(shape: Circle): boolean {
        return (
            Math.sqrt(
                Math.pow(shape.position.x - this.position.x, 2) +
                    Math.pow(shape.position.y - this.position.y, 2),
            ) +
                shape.radius <=
            this.radius
        );
    }

    #containsRay(shape: Ray): boolean {
        // A circle cannot contain a ray
        return false;
    }

    #intersectsPoint(shape: Point): Array<Vector2D> {
        if (
            Math.abs(
                shape.position.subtractBy(this.position).magnitudeSquared() -
                    Math.pow(this.radius, 2),
            ) <= Vector2D.epsilon
        ) {
            return [shape.position];
        }

        return [];
    }

    #intersectsLine(shape: Line): Array<Vector2D> {
        const closestPoint = shape.closest(new Point(this.position));

        if (!this.overlaps(new Point(closestPoint))) {
            // Circle is too far away
            return [];
        }

        const d = shape.vector();
        const unitLine =
            d.dot(this.position.subtractBy(shape.start)) / d.magnitudeSquared();
        const closestPointToLine = shape.start.addBy(unitLine).multiply(d);
        const distToLine = this.position
            .subtractBy(closestPointToLine)
            .magnitudeSquared();

        if (
            Math.abs(distToLine - Math.pow(this.radius, 2)) < Vector2D.epsilon
        ) {
            // Circle "kisses" (barely touches) the line
            return [closestPointToLine];
        }

        // Circle intersects the line
        const length = Math.sqrt(Math.pow(this.radius, 2) - distToLine);
        const p1 = closestPointToLine
            .addBy(shape.vector().normalized())
            .multiply(length);
        const p2 = closestPointToLine
            .subtractBy(shape.vector().normalized())
            .multiply(length);

        const intersections = [];

        if (
            p1.subtractBy(shape.closest(new Point(p1))).magnitudeSquared() <
            Math.pow(Vector2D.epsilon, 2)
        ) {
            intersections.push(p1);
        }

        if (
            p2.subtractBy(shape.closest(new Point(p2))).magnitudeSquared() <
            Math.pow(Vector2D.epsilon, 2)
        ) {
            intersections.push(p2);
        }

        return Vector2D.filterDuplicateVectors(intersections);
    }

    #intersectsRectangle(shape: Rectangle): Array<Vector2D> {
        const intersections = [];

        for (let i = 0; i < shape.sideCount(); ++i) {
            const v = this.intersects(shape.side(i));

            intersections.push(...v);
        }

        return intersections;
    }

    #intersectsTriangle(shape: Triangle): Array<Vector2D> {
        return shape.intersects(this);
    }

    #intersectsCircle(shape: Circle): Array<Vector2D> {
        if (this.position.eq(shape.position)) {
            // Either circles contains either the other or vice versa, or are
            // identical. If so, they'd be sharing all points and there's no good way to represent them in return values;
            return [];
        }

        const between = shape.position.subtractBy(this.position);
        const dist2 = between.magnitudeSquared();
        const radiusSum = this.radius + shape.radius;

        if (dist2 > Math.pow(radiusSum, 2)) {
            // Circles are too far apart from each other.
            return [];
        }

        if (this.contains(shape) || shape.contains(this)) {
            // If either circles contain the other or vice versa, then no points would be intersecting.
            return [];
        }

        if (dist2 === radiusSum) {
            return [
                this.position.addBy(between.normalized()).multiply(this.radius),
            ]; // Circles are intersecting at one point // Circles are intersecting at one point
        }

        const dist = Math.sqrt(dist2);
        const ccDist =
            (dist2 + Math.pow(this.radius, 2) - Math.pow(shape.radius, 2)) /
            (2 * dist);
        const chordCenter = this.position
            .addBy(between.normalized())
            .multiply(ccDist);
        const halfChord = between
            .normalized()
            .perp()
            .multiply(
                Math.sqrt(Math.pow(this.radius, 2) - Math.pow(ccDist, 2)),
            );

        return [
            chordCenter.addBy(halfChord),
            chordCenter.subtractBy(halfChord),
        ];
    }

    #intersectsRay(shape: Ray): Array<Vector2D> {
        return shape.intersects(this);
    }

    // @ts-ignore
    closest(shape: Shape): Vector2D {
        if (shape.isPoint()) {
            return this.#closestPoint(shape);
        }

        if (shape.isLine()) {
            return this.#closestLine(shape);
        }

        if (shape.isRectangle()) {
            return this.#closestRectangle(shape);
        }

        if (shape.isTriangle()) {
            return this.#closestTriangle(shape);
        }

        if (shape.isCircle()) {
            return this.#closestCircle(shape);
        }

        if (shape.isRay()) {
            return this.#closestRay(shape);
        }

        unreachable();
    }

    overlaps(shape: Shape): boolean {
        if (shape.isPoint()) {
            return this.#overlapsPoint(shape);
        }

        if (shape.isLine()) {
            return this.#overlapsLine(shape);
        }

        if (shape.isRectangle()) {
            return this.#overlapsRectangle(shape);
        }

        if (shape.isTriangle()) {
            return this.#overlapsTriangle(shape);
        }

        if (shape.isCircle()) {
            return this.#overlapsCircle(shape);
        }

        if (shape.isRay()) {
            return this.#overlapsRay(shape);
        }

        unreachable();

        // Satisfy TypeScript
        return false;
    }

    contains(shape: Shape): boolean {
        if (shape.isPoint()) {
            return this.#containsPoint(shape);
        }

        if (shape.isLine()) {
            return this.#containsLine(shape);
        }

        if (shape.isRectangle()) {
            return this.#containsRectangle(shape);
        }

        if (shape.isTriangle()) {
            return this.#containsTriangle(shape);
        }

        if (shape.isCircle()) {
            return this.#containsCircle(shape);
        }

        if (shape.isRay()) {
            return this.#containsRay(shape);
        }

        unreachable();

        // Satisfy TypeScript
        return false;
    }

    intersects(shape: Shape): Array<Vector2D> {
        if (shape.isPoint()) {
            return this.#intersectsPoint(shape);
        }

        if (shape.isLine()) {
            return this.#intersectsLine(shape);
        }

        if (shape.isRectangle()) {
            return this.#intersectsRectangle(shape);
        }

        if (shape.isTriangle()) {
            return this.#intersectsTriangle(shape);
        }

        if (shape.isCircle()) {
            return this.#intersectsCircle(shape);
        }

        if (shape.isRay()) {
            return this.#intersectsRay(shape);
        }

        unreachable();

        // Satisfy TypeScript
        return [];
    }

    position: Vector2D;
    radius: number;

    constructor(position: Vector2D, radius: number) {
        super();

        this.position = position;
        this.radius = radius;
    }

    area(): number {
        return Math.PI * Math.pow(this.radius, 2);
    }

    perimeter(): number {
        return 2 * Math.PI * this.radius;
    }

    circumference(): number {
        return this.perimeter();
    }
}

class Triangle extends Shape {
    #closestPoint(shape: Point): Vector2D {
        const line = new Line(this.position[0], this.position[1]);
        const p0 = line.closest(shape);
        const d0 = p0.subtractBy(shape.position).magnitudeSquared();

        line.end = this.position[2];
        const p1 = line.closest(shape);
        const d1 = p1.subtractBy(shape.position).magnitudeSquared();

        line.start = this.position[1];
        const p2 = line.closest(shape);
        const d2 = p2.subtractBy(shape.position).magnitudeSquared();

        if (d0 <= d1 && d0 <= d2) {
            return p0;
        }

        if (d1 <= d0 && d1 <= d2) {
            return p1;
        }

        return p2;
    }

    // @ts-ignore
    #closestLine(shape: Line): Vector2D {
        unimplemented();
    }

    #closestRectangle(shape: Rectangle): Vector2D {
        return shape.closest(this);
    }

    // @ts-ignore
    #closestTriangle(shape: Triangle): Vector2D {
        unimplemented();
    }

    // @ts-ignore
    #closestCircle(shape: Circle): Vector2D {
        unimplemented();
    }

    // @ts-ignore
    #closestRay(shape: Ray): Vector2D {
        unimplemented();
    }

    #overlapsPoint(shape: Point): boolean {
        return this.contains(shape);
    }

    #overlapsLine(shape: Line): boolean {
        return (
            this.overlaps(new Point(shape.start)) ||
            this.side(0).overlaps(shape) ||
            this.side(1).overlaps(shape) ||
            this.side(2).overlaps(shape)
        );
    }

    #overlapsRectangle(shape: Rectangle): boolean {
        return (
            this.overlaps(shape.top()) ||
            this.overlaps(shape.bottom()) ||
            this.overlaps(shape.left()) ||
            this.overlaps(shape.right()) ||
            shape.contains(new Point(this.position[0]))
        );
    }

    #overlapsTriangle(shape: Triangle): boolean {
        return (
            this.overlaps(shape.side(0)) ||
            this.overlaps(shape.side(1)) ||
            this.overlaps(shape.side(2)) ||
            shape.overlaps(new Point(this.position[0]))
        );
    }

    #overlapsCircle(shape: Circle): boolean {
        return (
            this.contains(new Point(shape.position)) ||
            shape.position
                .subtractBy(this.closest(new Point(shape.position)))
                .magnitudeSquared() <= Math.pow(shape.radius, 2)
        );
    }

    #overlapsRay(shape: Ray): boolean {
        // A ray cannot overlap with a triangle and vice versa
        return false;
    }

    #containsPoint(shape: Point): boolean {
        /**  @see http://jsfiddle.net/PerroAZUL/zdaY8/1/ */

        const A =
            0.5 *
            (this.position[1].y * -1 * this.position[2].x +
                this.position[0].y *
                    (this.position[1].x * -1 + this.position[2].x) +
                this.position[0].x * (this.position[1].y - this.position[2].y) +
                this.position[1].x * this.position[2].y);
        const sign = A < 0 ? -1 : 1;
        const s =
            (this.position[0].y * this.position[2].x -
                this.position[0].x * this.position[2].y +
                (this.position[2].y - this.position[0].y) * shape.position.x +
                (this.position[0].x - this.position[2].x) * shape.position.y) *
            sign;
        const v =
            (this.position[0].x * this.position[1].y -
                this.position[0].y * this.position[1].x +
                (this.position[0].y - this.position[1].y) * shape.position.x +
                (this.position[1].x - this.position[0].x) * shape.position.y) *
            sign;

        return s >= 0 && v >= 0 && s + v <= 2 * A * sign;
    }

    #containsLine(shape: Line): boolean {
        return (
            this.contains(new Point(shape.start)) &&
            this.contains(new Point(shape.end))
        );
    }

    #containsRectangle(shape: Rectangle): boolean {
        return (
            this.contains(new Point(shape.position)) &&
            this.contains(new Point(shape.position.addBy(shape.dimensions))) &&
            this.contains(
                new Point(
                    new Vector2D(
                        shape.position.x + shape.dimensions.x,
                        shape.position.y,
                    ),
                ),
            ) &&
            this.contains(
                new Point(
                    new Vector2D(
                        shape.position.x,
                        shape.position.y + shape.dimensions.y,
                    ),
                ),
            )
        );
    }

    #containsTriangle(shape: Triangle): boolean {
        return (
            this.contains(new Point(shape.position[0])) &&
            this.contains(new Point(shape.position[1])) &&
            this.contains(new Point(shape.position[2]))
        );
    }

    #containsCircle(shape: Circle): boolean {
        return (
            this.contains(new Point(shape.position)) &&
            shape.position
                .subtractBy(this.closest(new Point(shape.position)))
                .magnitudeSquared() >= Math.pow(shape.radius, 2)
        );
    }

    #containsRay(shape: Ray): boolean {
        // A triangle cannot contain a ray
        return false;
    }

    #intersectsPoint(shape: Point): Array<Vector2D> {
        for (let i = 0; i < this.sideCount(); ++i) {
            if (this.side(i).contains(shape)) {
                return [shape.position];
            }
        }

        return [];
    }

    #intersectsLine(shape: Line): Array<Vector2D> {
        const intersections = [];

        for (let i = 0; i < this.sideCount(); ++i) {
            const v = this.side(i).intersects(shape);
            intersections.push(...v);
        }

        return Vector2D.filterDuplicateVectors(intersections);
    }

    #intersectsRectangle(shape: Rectangle): Array<Vector2D> {
        const intersections = [];

        for (let i = 0; i < shape.sideCount(); ++i) {
            const v = this.intersects(shape.side(i));

            intersections.push(...v);
        }

        return Vector2D.filterDuplicateVectors(intersections);
    }

    #intersectsTriangle(shape: Triangle): Array<Vector2D> {
        const intersections = [];

        for (let i = 0; i < shape.sideCount(); ++i) {
            const v = this.intersects(shape.side(i));

            intersections.push(...v);
        }

        return Vector2D.filterDuplicateVectors(intersections);
    }

    #intersectsCircle(shape: Circle): Array<Vector2D> {
        const intersections = [];

        for (let i = 0; i < this.sideCount(); ++i) {
            const v = shape.intersects(this.side(i));

            intersections.push(...v);
        }

        return Vector2D.filterDuplicateVectors(intersections);
    }

    #intersectsRay(shape: Ray): Array<Vector2D> {
        const intersections = [];

        for (let i = 0; i < this.sideCount(); ++i) {
            const v = shape.intersects(this.side(i));

            intersections.push(...v);
        }

        return Vector2D.filterDuplicateVectors(intersections);
    }

    // @ts-ignore
    closest(shape: Shape): Vector2D {
        if (shape.isPoint()) {
            return this.#closestPoint(shape);
        }

        if (shape.isLine()) {
            return this.#closestLine(shape);
        }

        if (shape.isRectangle()) {
            return this.#closestRectangle(shape);
        }

        if (shape.isTriangle()) {
            return this.#closestTriangle(shape);
        }

        if (shape.isCircle()) {
            return this.#closestCircle(shape);
        }

        if (shape.isRay()) {
            return this.#closestRay(shape);
        }

        unreachable();
    }

    overlaps(shape: Shape): boolean {
        if (shape.isPoint()) {
            return this.#overlapsPoint(shape);
        }

        if (shape.isLine()) {
            return this.#overlapsLine(shape);
        }

        if (shape.isRectangle()) {
            return this.#overlapsRectangle(shape);
        }

        if (shape.isTriangle()) {
            return this.#overlapsTriangle(shape);
        }

        if (shape.isCircle()) {
            return this.#overlapsCircle(shape);
        }

        if (shape.isRay()) {
            return this.#overlapsRay(shape);
        }

        unreachable();

        // Satisfy TypeScript
        return false;
    }

    contains(shape: Shape): boolean {
        if (shape.isPoint()) {
            return this.#containsPoint(shape);
        }

        if (shape.isLine()) {
            return this.#containsLine(shape);
        }

        if (shape.isRectangle()) {
            return this.#containsRectangle(shape);
        }

        if (shape.isTriangle()) {
            return this.#containsTriangle(shape);
        }

        if (shape.isCircle()) {
            return this.#containsCircle(shape);
        }

        if (shape.isRay()) {
            return this.#containsRay(shape);
        }

        unreachable();

        // Satisfy TypeScript
        return false;
    }

    intersects(shape: Shape): Array<Vector2D> {
        if (shape.isPoint()) {
            return this.#intersectsPoint(shape);
        }

        if (shape.isLine()) {
            return this.#intersectsLine(shape);
        }

        if (shape.isRectangle()) {
            return this.#intersectsRectangle(shape);
        }

        if (shape.isTriangle()) {
            return this.#intersectsTriangle(shape);
        }

        if (shape.isCircle()) {
            return this.#intersectsCircle(shape);
        }

        if (shape.isRay()) {
            return this.#intersectsRay(shape);
        }

        unreachable();

        // Satisfy TypeScript
        return [];
    }

    /**
     * Position of all the triangle's edges
     */
    position: [Vector2D, Vector2D, Vector2D];

    constructor(top: Vector2D, right: Vector2D, left: Vector2D) {
        super();

        this.position = [top, right, left];
    }

    /**
     * Returns a line segment from a side based on an index.
     * This starts from the top, going clockwise/to the right.
     */
    side(index: number): Line {
        /**
         * Say we are getting 0 (top),
         * start of the line segment will be the top edge.
         * Then, the end of that line segment will be the right edge.
         * Thus, getting the right side of the triangle.
         */
        return new Line(
            this.position[index % 3],
            this.position[(index + 1) % 3],
        );
    }

    /**
     * To get the area of the triangle, we add all the sides and divide them by two.
     *
     * @see https://www.cuemath.com/geometry/area-of-triangle-in-determinant-form/
     */
    area(): number {
        return (
            0.5 *
            Math.abs(
                this.position[0].x * (this.position[1].y - this.position[2].y) +
                    this.position[1].x *
                        (this.position[2].y - this.position[0].y) +
                    this.position[2].x *
                        (this.position[0].y - this.position[1].y),
            )
        );
    }

    /**
     * To get the perimeter of a triangle, just add all the length of its sides.
     */
    perimeter(): number {
        return (
            new Line(this.position[0], this.position[1]).length() +
            new Line(this.position[1], this.position[2]).length() +
            new Line(this.position[2], this.position[0]).length()
        );
    }

    sideCount(): number {
        return 3;
    }
}

export { Circle, Line, Ray, Rectangle, Shape, Triangle, Vector2D };
