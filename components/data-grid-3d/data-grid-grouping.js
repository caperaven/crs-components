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
            const node = document.createElement("div");
            node.classList.add("column-header-group");
            node.dataset.field = element.dataset.field;

            const span = document.createElement("span");
            span.textContent = element.children[0].textContent;
            node.appendChild(span);
            node.appendChild(await createSvgImage("close", "close-icon"));

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
