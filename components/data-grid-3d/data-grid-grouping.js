import {createSvgImage} from "../lib/element-utils.js";

export async function enableGrouping(parent) {
    parent._groupingContext = {
        grouping: [],
        groupClickHandler: groupClick.bind(parent),
    }

    parent.querySelector(".grid-grouping").addEventListener("click", parent._groupingContext.groupClickHandler);
    parent.orderGrouping = orderGrouping;
}

export async function disableGrouping(parent) {
    parent.querySelector(".grid-grouping").removeEventListener("click", parent._groupingContext.groupClickHandler);
    delete parent.orderGrouping;
    delete parent._groupingContext.groupClickHandler;
    delete parent._groupingContext.grouping;
    delete parent._groupingContext;
}

async function orderGrouping(element, placeholder,dropTarget) {
    this.querySelector(".grid-grouping").setAttribute("title", "");
    if (dropTarget.classList.contains("grid-grouping")) {
        const hasField = this.querySelector(`.grid-grouping [data-field="${element.dataset.field}"]`);

        if (hasField == null) {
            const node = element.cloneNode(true);
            node.style.width = null;
            node.removeChild(node.children[1]);
            node.removeChild(node.children[1]);
            node.appendChild(await createSvgImage("close", "close-icon"))

            dropTarget.appendChild(node);
            this._groupingContext.grouping.push(element.dataset.field);
        }

        placeholder.parentElement.replaceChild(element, placeholder);
    }
}

async function groupClick(event) {
    if (event.target.classList.contains("close-icon")) {
        const element = event.target.parentElement;
        element.parentElement.removeChild(element);
        await removeGrouping(this._groupingContext.grouping, element.dataset.field);
    }
}

async function removeGrouping(array, value) {
    const index = array.indexOf(value);
    if (index != -1) {
        array.splice(index, 1);
    }
}
