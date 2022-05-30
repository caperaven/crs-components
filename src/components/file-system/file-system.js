export class FileSystem extends HTMLElement {
    async connectedCallback() {
        this.innerHTML = await fetch(import.meta.url.replace(".js", ".html")).then(result => result.text());

        requestAnimationFrame(() => {
            this._folderTemplate = this.querySelector("#folder-template");
            this._fileTemplate = this.querySelector("#file-template");
            this._container = this.querySelector(".container");

            this._clickHandler = this._dblClick.bind(this);
            this.addEventListener("dblclick", this._clickHandler);

            this.add("my folder", "folder");
            this.add("my file", "file");
        })
    }

    async disconnectedCallback() {
        this.removeEventListener("dblclick", this._clickHandler);
        this._clickHandler = null;

        this._folderTemplate = null;
        this._fileTemplate = null;
        this._container = null;
        this._content = null;
    }

    _dblClick(event) {
        console.log(event);
    }

    add(title, type, index) {
        const instance = this[`_${type}Template`].content.cloneNode(true);
        instance.querySelector("div").setAttribute("aria-label", title);
        instance.children[0].querySelector("div").innerText = title;
        instance.children[0].dataset.index = index;
        this._container.appendChild(instance);
    }

    async selectFolder() {
        const content = await crs.call("fs", "open_folder");
        content.sort((a, b) => {
            if (a.kind == b.kind) {
                if (a.name < b.name) {
                    return -1;
                }
            }

            if (a.kind < b.kind) {
                return -1;
            }

            return 1;
        });
        await this.render(content);
    }

    async render(content) {
        this._container.innerHTML = "";
        this._content = content;

        let index = 0
        for (const item of content) {
            this.add(item.name, item.kind == "file" ? "file" : "folder", index);
            index++;
        }
    }
}

customElements.define("file-system", FileSystem);