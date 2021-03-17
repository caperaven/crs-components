import {getRandomInt} from "../../src/components/lib/random-number.js";

export function getData(count) {
    const result = [];

    for (let i = 0; i < count; i++) {
        const number = getRandomInt(10, 100);
        result.push({
            label: String(number),
            value: number
        })
    }

    return result;
}