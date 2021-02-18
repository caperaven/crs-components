export function createData(rowCount) {
    const result = [];

    for (let i = 0; i < rowCount; i++) {
        result.push({
            id: i,
            code: `code ${i}`,
            description: `description of row item ${i}`,
            isActive: true,
            field1: "field 1",
            field2: "field 2",
            field3: "field 3",
            field4: "field 4",
            field5: "field 5",
            field6: "field 6",
            field7: "field 7",
            field8: "field 8",
            field9: "field 9",
            field10: "field 10"
        });
    }

    return result;
}