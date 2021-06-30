export class PercentBar extends HTMLElement {
    static get observedAttributes() { return ["value", "max"]; }

    async connectedCallback() {
        this.innerHTML = await fetch(import.meta.url.replace(".js", ".html")).then(result => result.text());
        requestAnimationFrame(() => {
            this.getBarColor();
            this.update();
            this._loaded = true;
        });
    }

    getBarColor() {
        this._barColor = this.dataset.barcolor || getComputedStyle(document.documentElement).getPropertyValue('--cl-bar');
    }

    update(width) {
        this.width = width || this.getBoundingClientRect().width;
        const max = Number(this.getAttribute("max"));
        const value = Number(this.getAttribute("value"));
        const offset = this.width / max;
        const barWidth = offset * value;
        const color = this.width > 0 ? this._barColor : "transparent";
        this.style.setProperty("--barwidth", `${barWidth}px`);
        this.style.setProperty("--cl-bar", color);
        this.style.setProperty("--value", `(${value})`);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (this._loaded !== true) return;
        this.update(this.width);
    }
}

customElements.define("percent-bar", PercentBar);