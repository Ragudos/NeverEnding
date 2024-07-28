class AssertionError extends Error {
    override name = "AssertionError";

    constructor(message: string) {
        super(message);
    }
}

function assert(expr: unknown, message?: string): asserts expr {
    if (!expr) {
        debugger;

        console.error(
            new AssertionError(message || "Assert expression is false."),
        );
    }
}

function unimplemented(message?: string): void {
    debugger;

    console.error(new AssertionError(message || "unimplemented"));
}

function unreachable(): void {
    debugger;

    console.error(new AssertionError("unreachable"));
}

function todo(): void {
    debugger;

    console.error(new AssertionError("to be implemented"));
}

export { AssertionError, assert, todo, unimplemented, unreachable };
