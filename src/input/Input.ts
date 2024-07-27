import { assert } from "../debug/Assert";
import { Vector2D } from "../geometry/2D";

type InputActions = "move_right" | "move_left" | "move_up" | "move_down";
type InputMap = { [Property in InputActions]: string[] };

const inputMap: InputMap = {
    move_up: ["KeyW"],
    move_right: ["KeyD"],
    move_down: ["KeyS"],
    move_left: ["KeyA"],
};

class Input {
    static #keysPressed: { [key: string]: { timeStamp: number } };
    static lastKeyPressed: undefined | string;
    static #abortController: undefined | AbortController;

    static #onKeyDown(kbEvt: KeyboardEvent): void {
        Input.lastKeyPressed = kbEvt.code;
        Input.#keysPressed[kbEvt.code] = { timeStamp: performance.now() };
    }

    static #onKeyUp(kbEvt: KeyboardEvent): void {
        if (kbEvt.code === Input.lastKeyPressed) {
            Input.lastKeyPressed = undefined;
        }

        delete Input.#keysPressed[kbEvt.code];
    }

    static listen(): void {
        if (Input.listening) {
            return;
        }

        Input.#abortController = new AbortController();

        window.addEventListener("keydown", Input.#onKeyDown, {
            signal: Input.#abortController.signal,
        });
        window.addEventListener("keyup", Input.#onKeyUp, {
            signal: Input.#abortController.signal,
        });
    }

    static disconnect(): void {
        if (!Input.listening) {
            return;
        }

        Input.#abortController?.abort();
        Input.#abortController = undefined;
    }

    static isActionPressed(action: InputActions): boolean {
        if (inputMap[action]) {
            for (let i = 0; i < inputMap[action].length; ++i) {
                if (Input.#keysPressed[inputMap[action][i]]) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Useful if we have both actions pressed together.
     *
     * For example, if actions "move_left" and "move_right"'s
     * keybindings (i.e. A and D keys) were to be pressed down together,
     * this will calculate the key that was pressed later than the other
     * by getting their respective timestamps.
     */
    static isActionPressedAfterAction(
        action: InputActions,
        action2: InputActions,
    ): boolean {
        assert(
            action !== action2,
            "Cannot check the trigger precedence of the same actions.",
        );

        if (Input.isActionPressed(action) && Input.isActionPressed(action2)) {
            function accumulator(prev: number[], curr: string): number[] {
                if (Input.#keysPressed[curr]) {
                    prev.push(Input.#keysPressed[curr].timeStamp);
                }

                return prev;
            }

            const firstActionTimestamps = inputMap[action].reduce(
                accumulator,
                [] as number[],
            );
            const secondActionTimestamps = inputMap[action2].reduce(
                accumulator,
                [] as number[],
            );

            return (
                Math.max(...firstActionTimestamps) >
                Math.max(...secondActionTimestamps)
            );
        }

        return false;
    }

    /**
     * In a list of actions along the 2D axis,
     * returns the vector of the supposed direction.
     *
     * If we're moving down, vector will be (0, 1).
     * If we're moving up, vector will be (0, -1).
     * If we're moving up and right, vector will be (1, -1).
     *
     * And so on...
     */
    static getVector(
        up: InputActions,
        right: InputActions,
        down: InputActions,
        left: InputActions,
    ): Vector2D {
        assert(
            left !== right && up !== down,
            "Actions along the same axis must not be the same",
        );

        const vector = new Vector2D(0, 0);

        if (Input.isActionPressedAfterAction(left, right)) {
            vector.x -= 1;
        } else if (Input.isActionPressedAfterAction(right, left)) {
            vector.x += 1;
        } else if (Input.isActionPressed(left)) {
            vector.x -= 1;
        } else if (Input.isActionPressed(right)) {
            vector.x += 1;
        }

        if (Input.isActionPressedAfterAction(up, down)) {
            vector.y -= 1;
        } else if (Input.isActionPressedAfterAction(down, up)) {
            vector.y += 1;
        } else if (Input.isActionPressed(up)) {
            vector.y -= 1;
        } else if (Input.isActionPressed(down)) {
            vector.y += 1;
        }

        return vector;
    }

    static get listening(): boolean {
        return Input.#abortController !== undefined;
    }
}

export { Input };
