export class TextRenderer {
    async createWord(font, text, color, size) {
        const group = await crs.createThreeObject("Group");

        for (let char of text) {
            console.log(char);
        }

        return group;
    }
}