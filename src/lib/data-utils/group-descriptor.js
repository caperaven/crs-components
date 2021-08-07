export function getGroupDescriptor(grouping, data) {
    const descriptor = { _count: 0 };

    for (let i = 0; i < data.length; i++) {
        placeOnHierarchy(descriptor, i, grouping, data[i]);
    }

    return descriptor;
}

function placeOnHierarchy(descriptor, index, grouping, item) {
    let obj = descriptor;
    for (let group of grouping) {
        const value = item[group];

        if (obj[value] == null) {
            obj._count += 1;
            obj[value] = { _count: 0 };
        }

        obj = obj[value];
    }
    obj.ind = obj.ind || [];
    obj.ind.push(index);
    delete obj._count;
}