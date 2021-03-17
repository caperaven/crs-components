import "../../src/components/image-card/image-card.js";

export default class ImageCard extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();
    }

    async newSrc() {
        this.element.querySelector("image-card").setAttribute("src", "https://i.pinimg.com/originals/62/f5/99/62f5997d012d5decc9dbc8ba0844293a.jpg");
    }
}