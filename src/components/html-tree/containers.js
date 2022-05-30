import {createAssociateElement} from "./utilities.js";

export class Containers {
    static async ul(element) {
        let title = element.dataset.title || await crsbinding.translations.get("list");

        let result = await crs.intent.dom.create_element({
            args: {
                tagName: "ul",
                attributes: {
                    "data-title": title
                }
            }}, element);


        result._sourceElement = element;

        for (let child of element.children) {
            await createAssociateElement(child, result);
        }

        return result;
    }
}