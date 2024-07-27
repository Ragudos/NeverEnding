import { Rectangle, Shape, Vector2D } from "../geometry/2D";

interface QuadTreeChildren {
    northeast: QuadTree;
    northwest: QuadTree;
    southwest: QuadTree;
    southeast: QuadTree;
}

interface QuadTreeChildrenBoundaries {
    northeast: Rectangle;
    northwest: Rectangle;
    southwest: Rectangle;
    southeast: Rectangle;
}

class QuadTreeNode {
    shape: Shape;

    constructor(shape: Shape) {
        this.shape = shape;
    }
}

class QuadTree {
    static MAX_DEPTH: number = 8;

    #boundary: Rectangle;
    #depthLayer: number;
    #children: undefined | QuadTreeChildren;
    #childrenBoundaries: QuadTreeChildrenBoundaries;
    #nodes: Array<QuadTreeNode>;

    constructor(boundary: Rectangle, depthLayer: number = 0) {
        this.#boundary = boundary;
        this.#depthLayer = depthLayer;

        this.#children = undefined;
        this.#nodes = new Array();

        this.#childrenBoundaries = this.#calulateChildBoundaries(
            this.#boundary.position.x,
            this.#boundary.position.y,
            this.#boundary.dimensions.x,
            this.#boundary.dimensions.y,
        );
    }

    #calulateChildBoundaries(
        x: number,
        y: number,
        width: number,
        height: number,
    ): {
        northeast: Rectangle;
        northwest: Rectangle;
        southwest: Rectangle;
        southeast: Rectangle;
    } {
        const halfWidth = width / 2;
        const halfHeight = height / 2;

        const neBoundary = new Rectangle(
            new Vector2D(x + halfWidth, y),
            new Vector2D(halfWidth, halfHeight),
        );
        const nwBoundary = new Rectangle(
            new Vector2D(x, y),
            new Vector2D(halfWidth, halfHeight),
        );
        const swBoundary = new Rectangle(
            new Vector2D(x, y + halfHeight),
            new Vector2D(halfWidth, halfHeight),
        );
        const seBoundary = new Rectangle(
            new Vector2D(x + halfWidth, y + halfHeight),
            new Vector2D(halfWidth, halfHeight),
        );

        return {
            northeast: neBoundary,
            northwest: nwBoundary,
            southwest: swBoundary,
            southeast: seBoundary,
        };
    }

    subdivide(): void {
        if (this.#children !== undefined) {
            return;
        }

        if (this.#depthLayer + 1 >= QuadTree.MAX_DEPTH) {
            return;
        }

        const depthLayer = this.#depthLayer;

        this.#children = {
            northeast: new QuadTree(
                this.#childrenBoundaries.northeast,
                depthLayer + 1,
            ),
            northwest: new QuadTree(
                this.#childrenBoundaries.northwest,
                depthLayer + 1,
            ),
            southwest: new QuadTree(
                this.#childrenBoundaries.southwest,
                depthLayer + 1,
            ),
            southeast: new QuadTree(
                this.#childrenBoundaries.southeast,
                depthLayer + 1,
            ),
        };
    }

    insert(node: QuadTreeNode): boolean {
        if (this.#childrenBoundaries.northeast.contains(node.shape)) {
            if (this.#children === undefined) {
                this.subdivide();
            }

            if (this.#children !== undefined) {
                return this.#children.northeast.insert(node);
            }
        }

        if (this.#childrenBoundaries.northwest.contains(node.shape)) {
            if (this.#children === undefined) {
                this.subdivide();
            }

            if (this.#children !== undefined) {
                return this.#children.northwest.insert(node);
            }
        }

        if (this.#childrenBoundaries.southwest.contains(node.shape)) {
            if (this.#children === undefined) {
                this.subdivide();
            }

            if (this.#children !== undefined) {
                return this.#children.southwest.insert(node);
            }
        }

        if (this.#childrenBoundaries.southeast.contains(node.shape)) {
            if (this.#children === undefined) {
                this.subdivide();
            }

            if (this.#children !== undefined) {
                return this.#children.southeast.insert(node);
            }
        }

        if (!this.#boundary.contains(node.shape)) {
            return false;
        }

        this.#nodes.push(node);

        return true;
    }

    query(range: Shape, found: Array<QuadTreeNode> = []): Array<QuadTreeNode> {
        if (!this.#boundary.intersects(range)) {
            return found;
        }

        for (let i = 0; i < this.#nodes.length; ++i) {
            if (range.intersects(this.#nodes[i].shape)) {
                found.push(this.#nodes[i]);
            }
        }

        if (this.#children !== undefined) {
            /**
             * If a range encapsulates/contains a boundary, then
             * that means everything inside that boundary is within
             * the range. If not, we still check if certain
             * nodes of a boundary is within the range. This
             * is the case if the range and the boundary overlaps/intersects
             * but not entirely.
             */

            if (range.contains(this.#children.northeast.#boundary)) {
                this.#children.northeast.getAllNodes(found);
            } else {
                this.#children.northeast.query(range, found);
            }

            if (range.contains(this.#children.northwest.#boundary)) {
                this.#children.northwest.getAllNodes(found);
            } else {
                this.#children.northwest.query(range, found);
            }

            if (range.contains(this.#children.southwest.#boundary)) {
                this.#children.southwest.getAllNodes(found);
            } else {
                this.#children.southwest.query(range, found);
            }

            if (range.contains(this.#children.southeast.#boundary)) {
                this.#children.southeast.getAllNodes(found);
            } else {
                this.#children.southeast.query(range, found);
            }
        }

        return found;
    }

    /**
     * Returns all nodes within this region including all its
     * children's
     */
    getAllNodes(nodes: Array<QuadTreeNode> = []): Array<QuadTreeNode> {
        for (const node of this.#nodes) {
            nodes.push(node);
        }

        if (this.#children) {
            this.#children.northeast.getAllNodes(nodes);
            this.#children.northwest.getAllNodes(nodes);
            this.#children.southwest.getAllNodes(nodes);
            this.#children.southeast.getAllNodes(nodes);
        }

        return nodes;
    }

    /**
     * Gets the total size of all the nodes in this Quad Tree and its children's
     */
    size(): number {
        let count = this.#nodes.length;

        if (this.#children !== undefined) {
            count += this.#children.northeast.size();
            count += this.#children.northwest.size();
            count += this.#children.southwest.size();
            count += this.#children.southeast.size();
        }

        return count;
    }

    /**
     * Resize the boundary of this Quad Tree,
     * clearing everything. Its children will be affected and invalidated.
     */
    resize(boundary: Rectangle): void {
        this.clear();

        this.#boundary = boundary;
        this.#childrenBoundaries = this.#calulateChildBoundaries(
            boundary.position.x,
            boundary.position.y,
            boundary.dimensions.x,
            boundary.dimensions.y,
        );
    }

    /**
     * Removes everything in this Quad Tree and its children's
     */
    clear(): void {
        this.#nodes.length = 0;

        if (this.#children) {
            this.#children.northeast.clear();
            this.#children.northwest.clear();
            this.#children.southwest.clear();
            this.#children.southeast.clear();
        }

        this.#children = undefined;
    }
}

export default QuadTree;
