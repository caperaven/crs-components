export class PercentBar extends HTMLElement {
    static get observedAttributes() { return ["data-value", "data-max"]; }

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
        const max = Number(this.dataset.max);
        const value = Number(this.dataset.value);
        const offset = this.width / max;
        const barWidth = offset * value;
        const color = this.width > 0 ? this._barColor : "transparent";
        this.style.setProperty("--barwidth", `${barWidth}px`);
        this.style.setProperty("--cl-bar", color);
        this.style.setProperty("--value", `(${value})`);
        this.setAttribute("aria-label", `${this.dataset.title} ${value}`);
        this.setAttribute("tabindex", 0);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (this._loaded !== true) return;
        this.update(this.width);
    }
}

customElements.define("percent-bar", PercentBar);