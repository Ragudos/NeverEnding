function genRandomId(): string {
    return Math.random().toString(16).substring(2, 16);
}

function random(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}

function randomItem<T>(array: Array<T>): T {
    return array[random(0, array.length - 1)];
}

export { genRandomId, random, randomItem };
