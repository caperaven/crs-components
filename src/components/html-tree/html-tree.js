import {Containers} from "./containers.js"
import {createAssociateElement} from "./utilities.js";

class HtmlTree extends HTMLElement {
    async connectedCallback() {
        this.target = document.querySelector(`#${this.getAttribute("for")}`);

        const config = {childList: true, subtree: true};
        this.observer = new MutationObserver(this.domChanged.bind(this));
        this.observer.observe(this.target, config);

        this.dblClickHandler = this.dblClick.bind(this);
        this.addEventListener("dblclick", this.dblClickHandler);

        crs.intent.system.get_uuid = crs.intent.system.get_uuid || getUUID;
    }

    async disconnectedCallback() {
        this.observer.disconnect();
        this.removeEventListener("dblclick", this.dblClickHandler);

        delete this.dblClickHandler;
        delete this.observer;
        delete this.target;
    }

    async domChanged(mutationsList, observer) {
        for (let mutation of mutationsList) {
            const parent = mutation.target;
            for (let element of mutation.addedNodes) {
                // 1. if the element is a container, let the container specialization deal with it.
                const nodeName = element.nodeName.toLowerCase();
                let child;

                if (Containers[nodeName] != null) {
                    child = await Containers[nodeName](element);
                    child._parentElement = element.parentElement;
                }

                // 2. add the element to the tree
                await this.addToTree(parent, child || element);
            }

            for (let element of mutation.removedNodes) {
                await this.removeFromTree(element);
            }
        }
    }

    async createTree() {
        clear(this);

        let root = await crs.intent.dom.create_element({args: {tagName: "ul"}});
        await create(this.target, root);
        await this.appendChild(root);
    }

    /**
     * add thew new element to the treeview
     * @param parent: the element that the parent was added too
     * @param element: the element that was added
     * @returns {Promise<void>}
     */
    async addToTree(parent, element) {
        const targetParent = element.parentElement || element._parentElement;
        let treeTarget = parent == this.target ? this.firstChild : findElement(this, targetParent);

        if (treeTarget.nodeName == "LI" && element.nodeName != "UL") {
            const ul = await crs.intent.dom.create_element({args: {tagName: "ul"}});
            treeTarget.appendChild(ul);
            treeTarget = ul;
        }

        await createAssociateElement(element, treeTarget);
    }

    async removeFromTree(element) {
        let treeTarget = findElement(this, element);
        removeElement(treeTarget);
    }

    async dblClick(event) {
        console.log(event.target._sourceElement);
    }
}

function findElement(parent, element) {
    if (parent._sourceElement == element) {
        return parent;
    }

    for (let child of parent.children) {
        let result = findElement(child, element);
        if (result != null) {
            return result;
        }
    }

    return null;
}

function removeElement(element) {
    if (element == null) return;

    element.parentElement.removeChild(element);
    delete element._sourceElement;
}

/**
 * Remove the children and clear them from the UI
 * @param target
 */
function clear(target) {
    for (let child of target.children) {
        clear(child);
        target.removeChild(child);
    }

    delete target._sourceElement;
}

async function create(target, parent) {
    for (let child of target.children) {
        const childElement = await createAssociateElement(child, parent);

        if (child.children.length > 0) {
            const ul = await crs.intent.dom.create_element({args: {tagName: "ul"}});
            await create(child, ul);
            childElement.appendChild(ul);
        }
    }
}

async function getUUID() {

}

customElements.define("html-tree", HtmlTree);