export default class Group {
    static async enable(grid) {
        grid._groupBar = await createGroupBar(grid);
    }

    static async disable(grid) {
        delete grid._groupBar;
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
        const element = document.createElement("div");
        element.classList.add("group-item");
        const field = grid.moveArgs.element.dataset.field;
        element.textContent = await grid.getCaption(field);

        grid._groupBar.replaceChild(element, grid.moveArgs.groupPlaceholder);
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