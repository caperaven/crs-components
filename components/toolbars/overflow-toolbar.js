import {enableContainerFeatures} from "./../base-components/container-mixin.js";
import {enableHorizontalKeys} from "./../lib/horizontal-key-navigation.js";
import {createSvgButton, createVerticalList, createListItem, createSpacer} from "./../lib/element-utils.js";

class OverflowToolbar extends HTMLElement {
    async connectedCallback() {
        await enableContainerFeatures(this);
        await this.init("toolbar")
        await enableHorizontalKeys(this);
        this.registerEvent(window, "resize", this.checkOverflow.bind(this));

        requestAnimationFrame(async () => await this.checkOverflow());
    }

    async disconnectedCallback() {
        crsbinding.dom.disableEvents(this);
        this.overflowItems = null;
        this.svgButton = null;
        this.dropdown = null;
    }

    async measure(element) {
        return element.getBoundingClientRect();
    }

    async checkOverflow() {
        if (this.overflowItems == null) {
            this.overflowItems = [];
        }

        await this.resetOverflow();

        const rect = await this.measure(this);
        const rightBound = rect.left + rect.width;
        const bounds = [];

        for (let i = this.children.length -1; i >= 0; i--) {
            const child = this.children[i];
            const bound = await this.measure(child);

            const cr = bound.left + bound.width;
            if (cr > rightBound) {
                bounds.push(bound);

                this.removeChild(child);
                this.overflowItems.push(child);
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
        if (this.overflowItems != null) {
            for (let element of this.overflowItems) {
                element.parentElement.removeChild(element);
                this.appendChild(element);
            }
        }
    }

    async addOverflowElements() {
        if (this.svgButton != null) return;

        this.svgButton = await createSvgButton("ellipse");
        this.appendChild(await createSpacer());
        this.appendChild(this.svgButton);

        this.dropdown = await createVerticalList();

        for (let overflowItem of this.overflowItems) {
            const element = await createListItem(overflowItem);
            this.dropdown.appendChild(element);
        }

        this.appendChild(this.dropdown);
    }

    async removeOverflowElements() {
        if (this.svgButton == null) return;
    }
}

customElements.define("overflow-toolbar", OverflowToolbar);