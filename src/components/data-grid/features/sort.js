export default class Sort {
    static async enable(grid) {

    }

    static async disable(grid) {
        delete grid._sort;
    }
}