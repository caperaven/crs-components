export async function setStyleProperties(element, args) {
    const keys = Object.keys(args);
    for (let key of keys) {
        element.style[key] = args[key];
    }
}