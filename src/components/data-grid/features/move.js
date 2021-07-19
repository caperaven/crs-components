export default class Move {
    static async enable(grid) {

    }

    static async disable(grid) {
        delete grid._move;
    }
}