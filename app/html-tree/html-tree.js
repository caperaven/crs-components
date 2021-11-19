import "./../../src/components/html-tree/html-tree.js";

export default class HtmlTreeView extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();
    }

    async disconnectedCallback() {
    }

    async buildTree() {
        await this._element.querySelector("html-tree").createTree();
    }

    async add() {
        await crs.intent.dom.create_element({ args: {
            id          : "element1",
            parentQuery : "#target",
            tagName     : "div",
            textContent : "Element 1",
            attributes  : {
                "data-title": "Element 1"
            }
        }})
    }

    async addChild() {
        await crs.intent.dom.create_element({ args: {
            id          : "element2",
            parentQuery : "#element1",
            tagName     : "div",
            textContent : "Element 2",
            attributes  : {
                "data-title": "Element 2"
            }
        }})

        // const element = document.createElement("div");
        // element.id = "element2";
        // element.textContent = "Element 2";
        // element.setAttribute("data-title", "Element 1"
        // const parent = document.querySelector("#element1");
        // parent.appendChild(element);
    }

    async moveElement() {

    }

}