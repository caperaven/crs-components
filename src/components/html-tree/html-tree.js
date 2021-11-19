class HtmlTree extends HTMLElement {
    async connectedCallback() {
        this.target = document.querySelector(`#${this.getAttribute("for")}`);

        const config = {childList: true, subtree: true};
        this.observer = new MutationObserver(this.domChanged.bind(this));
        this.observer.observe(this.target, config);

        this.dblClickHandler = this.dblClick.bind(this);
        this.addEventListener("dblclick", this.dblClickHandler);
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
                await this.addToTree(parent, element);
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
        let treeTarget = parent == this.target ? this.firstChild : findElement(this, element.parentElement);

        if (treeTarget.nodeName == "LI") {
            const ul = await crs.intent.dom.create_element({args: {tagName: "ul"}});
            treeTarget.appendChild(ul);
            treeTarget = ul;
        }

        await createAssociateElement(element, treeTarget);
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

/**
 * Remove the children and clear them from the UI
 * @param target
 */
function clear(target) {
    for (let child of target.children) {
        clear(child);
        target.removeChild(child);
    }

    target._sourceElement = null;
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

async function createAssociateElement(element, parent) {
    let result = await crs.intent.dom.create_element({
        args: {
            tagName: "li",
            textContent: "$context.dataset.title",
            parent: parent
        }}, element);

    result._sourceElement = element;
    return result;
}

customElements.define("html-tree", HtmlTree);