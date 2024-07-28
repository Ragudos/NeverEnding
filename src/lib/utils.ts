function genRandomId(): string {
    return Math.random().toString(16).substring(2, 16);
}

function random(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}

function randomItem<T>(array: Array<T>): T {
    return array[random(0, array.length - 1)];
}

/**
 * @returns [min, max] respectively
 */
function minMax(first: number, second: number): [number, number] {
    return [Math.min(first, second), Math.max(first, second)];
}

export { genRandomId, minMax, random, randomItem };
