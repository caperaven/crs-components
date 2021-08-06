import {position} from "./position.js";

export default class Group {
    static async enable(grid) {
        grid._groupBar = await createGroupBar(grid);
        grid._grouping = new Set();
    }

    static async disable(grid) {
        delete grid._groupBar;
        delete grid._grouping;
        delete grid.group;
    }

    static async mouseMove(grid, event, input) {
        if (grid.moveArgs?.groupPlaceholder == null) {
            if (grid._groupBar.textContent.length > 0 && grid._groupBar.children.length == 0) {
                grid._groupBar.textContent = "";
            }

            const placeholder = document.createElement("div");
            placeholder.style.width = "100px";
            placeholder.style.height = "2rem";
            placeholder.classList.add("placeholder");
            grid._groupBar.appendChild(placeholder);
            grid.moveArgs.groupPlaceholder = placeholder;
        }
    }

    static async mouseUp(grid, event, input) {
        const field = grid.moveArgs.element.dataset.field;

        const classes = grid.moveArgs.element.classList;
        if (grid._grouping.has(field) == false || classes.contains("group-item")) {
            const element = document.createElement("div");
            element.classList.add("group-item");
            element.dataset.feature = "move";
            element.dataset.field = field;
            element.dataset.group = -1;
            element.textContent = await grid.getCaption(field);

            if (event.target == grid._groupBar) {
                grid._groupBar.appendChild(element);
            }
            else if (grid.moveArgs.marker.dataset.position == position.BEFORE)
            {
                grid._groupBar.insertBefore(element, event.target);
            }
            else {
                if (event.target == grid._groupBar.lastChild) {
                    grid._groupBar.appendChild(element);
                }
                else {
                    grid._groupBar.insertBefore(element, event.target.nextSibling);
                }
            }

            grid._grouping.add(field);
        }

        grid.moveArgs.groupPlaceholder.parentElement.removeChild(grid.moveArgs.groupPlaceholder);
        delete grid.moveArgs.groupPlaceholder;
    }
}

async function createGroupBar(grid) {
    const element = document.createElement("div");
    element.classList.add("grouping-header");
    element.textContent = grid.settings?.translations?.groupText || "drop here to group";
    grid.headerElement.appendChild(element);
    return element;
}