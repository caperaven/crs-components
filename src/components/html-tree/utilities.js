export async function createAssociateElement(element, parent) {
    let result = await crs.intent.dom.create_element({
        args: {
            tagName: "li",
            textContent: "$context.dataset.title",
            parent: parent
        }}, element);

    result._sourceElement = element;
    return result;
}