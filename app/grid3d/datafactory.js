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

export function createGroupedData(groupCount, rowCount) {
    const result = [];

    let id = 0;
    for (let i = 0; i < groupCount; i++) {
        result.push({
            id: `g${i}`,
            title: `group ${i}`,
            descriptor: `count: ${rowCount}`,
            count: rowCount,
            isGroup: true,
            isExpanded: false
        })

        const rows =  createData(5);
        rows.forEach(row => row.id = id++);

        result.push(...rows);
    }

    return result;
}