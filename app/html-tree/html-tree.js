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
            parentQuery : "#parent-element",
            tagName     : "li",
            textContent : "Element 1",
            attributes  : {
                "data-title": "Element 1"
            }
        }})
    }

    async addChild() {
        const ul = await crs.intent.dom.create_element({args: {tagName: "ul"}});

        await crs.intent.dom.create_element({ args: {
            id          : "element2",
            parent      : ul,
            tagName     : "li",
            textContent : "Element 2",
            attributes  : {
                "data-title": "Element 2"
            }
        }})

        document.querySelector("#element1").appendChild(ul);
    }

    async moveElement() {
        await crs.intent.dom.move_element({ args: {
            query       : "#element2",
            target      : "#parent-element",
        }})
    }

}