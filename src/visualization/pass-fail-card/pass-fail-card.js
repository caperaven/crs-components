class PassFailCard extends HTMLElement {
    async connectedCallback() {
        this.innerHTML = await fetch(import.meta.url.replace(".js", ".html")).then(result => result.text());

        requestAnimationFrame(() => {
            this.update();
            this.isReady = true;
            this.dispatchEvent(new CustomEvent("isReady"));
        })
    }

    async update() {
        const headElement   = this.querySelector('h2');
        const totalElement  = this.querySelector('span');
        const passElement   = this.querySelector('[data-id="pass"]');
        const failElement   = this.querySelector('[data-id="fail"]');

        const passValue = Number(this.dataset.pass || 0);
        const failValue = Number(this.dataset.fail || 0);
        const total     = passValue + failValue;

        headElement.textContent   = this.dataset.title || "";
        totalElement.textContent  = total;
        passElement.dataset.title = this.dataset.passtext || "Similar";
        passElement.dataset.value = passValue;
        passElement.dataset.max   = total;
        failElement.dataset.title = this.dataset.failtext || "Different";
        failElement.dataset.value = failValue;
        failElement.dataset.max   = total;
    }
}

customElements.define("pass-fail-card", PassFailCard);

/**
 * data-title="Item Checked" data-pass="5" data-fail="3" data-passtext="Pass Text" data-failtext="Fail Text"
 */