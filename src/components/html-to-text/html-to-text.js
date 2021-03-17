export class HtmlToText extends HTMLElement {
    async connectedCallback() {
        await this.initElement();
    }

    async initElement() {
        const link = this.getAttribute("src");
        const response = await fetch(link).then((response) => response.text());
        await this.createContent(response)
    }

    async createContent(text) {
        const pre = document.createElement("pre");
        const code = document.createElement("code");
        code.textContent = text;
        pre.appendChild(code);
        this.appendChild(pre);
    }

}
customElements.define('html-to-text', HtmlToText);