import {enableVerticalKeys} from "./../lib/vertical-key-navigation.js";
import {disableChildTabbing} from "./../lib/element-utils.js";
import {setNewFocusIndex, setNewSelectedIndex} from "../lib/selection.js";

export class UnorderedList extends HTMLUListElement {
    get focusedIndex() {
        return this._focusIndex;
    }

    set focusedIndex(newValue) {
        setNewFocusIndex.call(this, newValue);
    }

    get selectedIndex() {
        return this._selectedIndex;
    }

    set selectedIndex(newValue) {
        setNewSelectedIndex.call(this, newValue);
    }

    async connectedCallback(role, childRole) {
        this._childLength = this.children.length;

        crsbinding.dom.enableEvents(this);
        this.registerEvent(this,"focus", this._focus.bind(this));

        this.setAttribute("role", role);
        this.setAttribute("tabindex", "0");
        await disableChildTabbing(this, childRole);

        await enableVerticalKeys(this);
    }

    async disconnectedCallback() {
        crsbinding.dom.disableEvents(this);
    }

    async moveDown() {
        this.focusedIndex++;
    }

    async moveUp() {
        this.focusedIndex--;
    }

    async gotoFirst() {
        this.focusedIndex = 0;
    }

    async gotoLast() {
        this.focusedIndex = this._childLength - 1;
    }

    async activate() {
        this.selectedIndex = this.focusedIndex;
        const selectedElement = this.children[this.selectedIndex];
        this.dispatchEvent(new CustomEvent("changed", {detail: selectedElement}));
    }

    async expand() {
        console.log("expand");
    }

    async collapse() {
        console.log("collapse");
    }

    async _focus() {
        const selectedIndex = Number(this.dataset.selected || 0);
        this.focusedIndex = selectedIndex;
        await setNewSelectedIndex.call(this, selectedIndex);

        this.children[this.selectedIndex].focus();
    }
}