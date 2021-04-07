export function processProperty(value, program) {
    if (typeof value != "string") return value;

    if (value.indexOf("@context.") == 0) {
        const property = value.replace("@context.", "");
        return crsbinding.utils.getValueOnPath(program, property);
    }

    return value;
}