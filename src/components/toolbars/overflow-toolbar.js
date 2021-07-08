import {enableContainerFeatures} from "../base-components/container-mixin.js";
import {enableHorizontalKeys} from "../lib/horizontal-key-navigation.js";
import {createSvgButton, createVerticalList, createListItem, createSpacer} from "../lib/element-utils.js";
import {showElementRelativeTo} from "../lib/element-utils.js";
import "../lists/unordered-list.js";
import {addResizeEvent, removeResize} from "../lib/resize.js";

class OverflowToolbar extends HTMLElement {
    async connectedCallback() {
        await enableContainerFeatures(this);
        await this.init("toolbar")
        await enableHorizontalKeys(this);

        crsbinding.dom.enableEvents(this);
        this.registerEvent(this, "click", this._click.bind(this));

        crsbinding.events.emitter.on("resize", this.checkOverflow.bind(this));
        requestAnimationFrame(async () => await this.checkOverflow());

        this._dropdownClickHandler = this._dropdownClick.bind(this);
        this._dropdownKeyHandler = this._dropdownKey.bind(this);

        this.resizeHandler = this.resize.bind(this);
        addResizeEvent(this).catch(e => console.error(e));
    }

    async disconnectedCallback() {
        removeResize(this).catch(e => console.error(e));
        this.resizeHandler = null;
        crsbinding.dom.disableEvents(this);

        await this._disposeOverflow();

        this._dropdownClickHandler = null;
        this._dropdownKeyHandler = null;
    }

    async measure(element) {
        return element.getBoundingClientRect();
    }

    async checkOverflow() {
        await this._disposeOverflow();
        await this._makeAllVisible();
        if (this.overflowItems == null) {
            this.overflowItems = [];
        }

        const rect = await this.measure(this);
        const rightBound = rect.left + rect.width - 36;
        const bounds = [];

        for (let i = this.children.length -1; i >= 0; i--) {
            const child = this.children[i];
            const bound = await this.measure(child);
            const cr = bound.left + bound.width;

            if (cr > rightBound) {
                bounds.push(bound);

                child.setAttribute("hidden", "hidden");
                child.dataset.hidden = "true";
                this.overflowItems.splice(0, 0, child);
            }
            else {
                break;
            }
        }

        if (this.overflowItems.length > 0) {
            await this.addOverflowElements();
        }
    }

    async resetOverflow() {
        await this._disposeOverflowItems();
        for (let child of this.children) {

        }

        if (this.overflowItems != null) {
            for (let element of this.overflowItems) {
                element.parentElement.removeChild(element);
                this.appendChild(element);
            }
        }
    }

    async addOverflowElements() {
        // if (this.svgButton != null) return;

        this.svgButton = await createSvgButton("ellipse", "btnOverflow");
        this.spacer = await createSpacer();
        this.appendChild(this.spacer);
        this.appendChild(this.svgButton);

        this.dropdown = await createVerticalList();
        this.dropdown.style.position = "fixed";
        this.dropdown.classList.add("back");
        this.dropdown.classList.add("overflow-toolbar-ul");

        for (let overflowItem of this.overflowItems) {
            const element = await createListItem(overflowItem);
            this.dropdown.appendChild(element);
        }

        document.body.appendChild(this.dropdown);
    }

    async removeOverflowElements() {
        if (this.svgButton == null) return;
    }

    async activateOverload() {
        if (this.focusedIndex > this.children.length - 1) {
            this.focusedIndex = this.children.length -1;
        }

        const selectedElement = this.children[this.focusedIndex];

        if (selectedElement == this.svgButton) {
            await this.showOverflow();
        }
    }

    async showOverflow() {
        this.dropdown.removeAttribute("hidden");
        this.registerEvent(this.dropdown, "click", this._dropdownClickHandler);
        this.registerEvent(this.dropdown, "keyup", this._dropdownKeyHandler);

        this.svgButton.setAttribute("aria-expanded", "true");
        this.dropdown.removeAttribute("hidden");
        this.dropdown.setAttribute("tabindex", "0");
        await showElementRelativeTo(this.svgButton, this.dropdown, "bottom", -32);

        this.dropdown.focus();
    }

    async _click(event) {
        if (event.target.id === "btnOverflow") {
            await this.showOverflow();
        }
    }

    async _closeDropDown() {
        this.dropdown.setAttribute("hidden", "hidden");
        this.unregisterEvent(this.dropdown, "click", this._dropdownClickHandler);
        this.unregisterEvent(this.dropdown, "keyup", this._dropdownKeyHandler);
        this.focus();
    }

    async _dropdownClick(event) {
        event.target.__target && event.target.__target.click();
        await this._closeDropDown();
    }

    async _dropdownKey(event) {
        const close = event.code == "Escape" || event.code == "Enter";

        if (event.code == "Enter") {
            event.target.__target && event.target.__target.click();
        }

        if (close) {
            await this._closeDropDown();
        }
    }

    async _makeAllVisible() {
        for (let i = 0; i < this.children.length; i++) {
            const child = this.children[i];
            child.removeAttribute("hidden");
            delete child.dataset.hidden;
        }
    }

    async _disposeOverflow() {
        if (this.spacer != null) {
            this.spacer.parentElement.removeChild(this.spacer);
            this.spacer = null;
        }

        if (this.svgButton != null) {
            this.svgButton.parentElement.removeChild(this.svgButton);
            this.svgButton = null;
        }

        await this._disposeOverflowItems();
        if (this.dropdown != null) {
            this.dropdown.parentElement.removeChild(this.dropdown);
            this.dropdown = null;
        }
    }

    async _disposeOverflowItems() {
        if (this.dropdown == null) return;

        for (let child of this.dropdown.children) {
            child.__target = null;
            this.dropdown.removeChild(child);
        }

        this.overflowItems = null;
        this.svgButton = null;
        this.dropdown = null;
    }

    async resize() {
        if (this.dropdown && this.dropdown.getAttribute("hidden") == undefined) {
            await this._closeDropDown();
        };

        requestAnimationFrame(async () => await this.checkOverflow());
    }

    async _expand(event) {
         if (event.target.id == "btnOverflow") {
            await this.showOverflow();
         }
    }
}

customElements.define("overflow-toolbar", OverflowToolbar);