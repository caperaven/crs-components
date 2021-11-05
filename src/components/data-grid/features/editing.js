export default class Editing {
    static async enable(grid) {
        grid.dblClickEvents = grid.dblClickEvents || [];
        grid.dblClickEvents.push({
            query: ".cell",
            feature: "editing",
            fn: "edit"
        })
    }

    static async disable(grid) {
        delete grid.resize;
    }

    /**
     * edit grid for defined target cell
     * @param grid
     * @param target
     * @returns {Promise<void>}
     */
    static async edit(grid, target) {
        // do stuff
    }
}

