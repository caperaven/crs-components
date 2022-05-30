export class FileSystem extends HTMLElement {
    async connectedCallback() {
        this.innerHTML = await fetch(import.meta.url.replace(".js", ".html")).then(result => result.text());

        requestAnimationFrame(() => {
            this._folderTemplate = this.querySelector("#folder-template");
            this._fileTemplate = this.querySelector("#file-template");
            this._container = this.querySelector(".container");

            this.add("my folder", "folder");
            this.add("my file", "file");
        })
    }

    async disconnectedCallback() {
        this._folderTemplate = null;
        this._fileTemplate = null;
        this._container = null;
    }

    add(title, type) {
        const instance = this[`_${type}Template`].content.cloneNode(true);
        instance.querySelector("div").setAttribute("aria-label", title);
        instance.children[0].querySelector("div").innerText = title;
        this._container.appendChild(instance);
    }
}

customElements.define("file-system", FileSystem);