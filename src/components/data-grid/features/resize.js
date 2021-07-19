export default class Resize {
    static async enable(grid) {

    }

    static async disable(grid) {
        delete grid._resize;
    }
}