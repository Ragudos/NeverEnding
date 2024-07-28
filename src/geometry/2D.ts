import { unimplemented, unreachable } from "../debug/Assert";

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

    abstract contains(shape: Shape): boolean;
    abstract intersects(shape: Shape): Array<Vector2D>;
    abstract overlaps(shape: Shape): boolean;
}

class Point extends Shape {
    #containsPoint(shape: Point): boolean {
        return (this.position.subtractBy(shape.position).magnitudeSquared() < Vector2D.epsilon)
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
    #overlapsPoint(shape: Point): boolean {
        return this.contains(shape);
    }

    #overlapsLine(shape: Line): boolean {
        const distance = (
            (shape.end.y - shape.start.y) *
            (this.end.x - this.start.x) -
            (shape.end.x - shape.start.x) *
            (this.end.y - this.start.y)
        );
        const unitA = (
            (shape.end.x - shape.start.x) *
            (this.start.y - shape.start.y) -
            (shape.end.y - shape.start.y) *
            (this.start.x - shape.start.x)
        ) / distance;
        const unitB = (
            (this.end.x - this.start.x) *
            (this.start.y - shape.start.y) -
            (this.end.y - this.start.y) *
            (this.start.x - shape.start.x)
        ) / distance;

        return  unitA >= 0 && unitA <= 1 && unitB >= 0 && unitB <= 1;
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
        const d = (
            (shape.position.x - this.start.x) *
            (this.end.y - this.start.y) -
            (shape.position.y - this.start.y) *
            (this.end.x - this.start.x)
        );

        if (Math.abs(d) < Vector2D.epsilon) {
            // Point is along this Line
            const unit = this.vector().dot(shape.position.subtractBy(this.start)) / this.vector().magnitudeSquared();

            return unit >= 0.0 && unit <= 1.0;
        }

        return false;
    }

    #containsLine(shape: Line): boolean {
        // If this Line overlaps with the other Line's start point AND other Line's end point
        return this.overlaps(new Point(shape.start)) && this.overlaps(new Point(shape.end));
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
            return []
        }

        const inverseRd = 1.0 / rd;

        const rn = (
            (shape.end.x - shape.start.x) *
            (this.start.y - shape.start.y) -
            (shape.end.y - shape.start.y) *
            (this.start.x - shape.start.x)
        ) * inverseRd;
        const sn = (
            (this.end.x - this.start.x) *
            (this.start.y - shape.start.y) -
            (this.end.y - this.start.y) *
            (this.start.x - shape.start.x)
        ) * inverseRd;

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
    overlaps(shape: Shape): boolean {
        throw new Error("Method not implemented.");
    }

    contains(shape: Shape): boolean {
        throw new Error("Method not implemented.");
    }

    intersects(shape: Shape): Array<Vector2D> {
        throw new Error("Method not implemented.");
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
    overlaps(shape: Shape): boolean {
        throw new Error("Method not implemented.");
    }

    contains(shape: Shape): boolean {
        throw new Error("Method not implemented.");
    }

    intersects(shape: Shape): Array<Vector2D> {
        throw new Error("Method not implemented.");
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
    overlaps(shape: Shape): boolean {
        throw new Error("Method not implemented.");
    }

    contains(shape: Shape): boolean {
        throw new Error("Method not implemented.");
    }

    intersects(shape: Shape): Array<Vector2D> {
        throw new Error("Method not implemented.");
    }

    position: Vector2D;
    radius: number;

    constructor(position: Vector2D, radius: number) {
        super();

        this.position = position;
        this.radius = radius;
    }

    area(): number {
        return Math.PI * this.radius ** 2;
    }

    perimeter(): number {
        return 2 * Math.PI * this.radius;
    }

    circumference(): number {
        return this.perimeter();
    }
}

class Triangle extends Shape {
    overlaps(shape: Shape): boolean {
        throw new Error("Method not implemented.");
    }

    contains(shape: Shape): boolean {
        throw new Error("Method not implemented.");
    }

    intersects(shape: Shape): Array<Vector2D> {
        throw new Error("Method not implemented.");
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
