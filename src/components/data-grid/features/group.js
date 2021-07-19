export default class Group {
    static async enable(grid) {
        grid._groupBar = await createGroupBar(grid);
    }

    static async disable(grid) {
        delete grid._groupBar;
        delete grid._group;
    }
}

async function createGroupBar(grid) {
    const element = document.createElement("div");
    element.classList.add("grouping-header");
    element.textContent = grid.settings?.translations?.groupText || "drop here to group";
    grid.headerElement.appendChild(element);
}