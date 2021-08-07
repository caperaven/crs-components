import {getRandomInt} from "./../../src/components/lib/random-number.js";

export const months = Object.freeze({
    1: "January",
    2: "February",
    3: "March",
    4: "April",
    5: "May",
    6: "June",
    7: "July",
    8: "August",
    9: "September",
    10: "October",
    11: "November",
    12: "December"
})

export function createData(rowCount) {
    const result = [];

    for (let i = 0; i < rowCount; i++) {
        result.push({
            id: i,
            code: `code ${i}`,
            description: `description of row item ${i}`,
            isActive: getRandomInt(0, 10) < 5 ? false : true,
            value: getRandomInt(0, 100),
            month: months[getRandomInt(1, 12)],
            field3: "field 3",
            field4: "field 4",
            field5: "field 5",
            field6: "field 6",
            field7: "field 7",
            field8: "field 8",
            field9: "field 9",
            field10: "field 10",
            field11: "field 11",
            field12: "field 12",
            field13: "field 13",
            field14: "field 14",
            field15: "field 15",
            field16: "field 16",
            field17: "field 17",
            field18: "field 18",
            field19: "field 19",
            field20: "field 20"
        });
    }

    return result;
}