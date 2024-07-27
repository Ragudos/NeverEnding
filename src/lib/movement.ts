/**
 * Use for acceleration or decceleration.
 *
 * For example, if `from` is 10 and `to` is 0.
 *
 * With a delta or speed of 1, we will moveToward()
 *
 * to `Math.max(10 - 1, 0)` 9. So, if we run this
 * per frame, it will deccelerate by 1 real distance per frame.
 */
function moveToward(from: number, to: number, delta: number): number {
    if (from < to) {
        return Math.min(from + delta, to);
    } else {
        return Math.max(from - delta, to);
    }
}

export { moveToward };
