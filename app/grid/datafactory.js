export function createData(rowCount) {
    const result = [];

    for (let i = 0; i < rowCount; i++) {
        result.push({
            id: i,
            code: `code ${i}`,
            description: `description of row item ${i}`,
            isActive: true
        });
    }

    return result;
}