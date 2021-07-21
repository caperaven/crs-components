export default class Sort {
    static async enable(grid) {

    }

    static async disable(grid) {
        delete grid.sort;
    }

    static async perform(target) {
        console.log(target);
    }
}