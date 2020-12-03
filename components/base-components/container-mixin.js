import {setNewFocusIndex, setNewSelectedIndex} from "../lib/selection.js";
import {disableChildTabbing} from "../lib/element-utils.js";

export async function enableContainerFeatures(target) {
    Object.defineProperty(target, "focusedIndex",{
        get () {
            return this._focusIndex;
        },
        set (newValue) {
            setNewFocusIndex.call(this, newValue);
        }
    });

    Object.defineProperty(target, "selectedIndex", {
        get() {
            return this._selectedIndex;
        },
        set(newValue) {
            setNewSelectedIndex.call(this, newValue);
        }
    });

    target.init = init;
    target.dispose = dispose;
    target.gotoNext = gotoNext;
    target.gotoPrevious = gotoPrevious;
    target.gotoFirst = gotoFirst;
    target.gotoLast = gotoLast;
    target.activate = activate;
    target.expand = expand;
    target.collapse = collapse;
    target._focus = _focus;
}

async function init(role, childRole) {
    this._childLength = this.children.length;

    crsbinding.dom.enableEvents(this);
    this.registerEvent(this,"focus", this._focus.bind(this));

    if (role != null) {
        this.setAttribute("role", role);
    }
    this.setAttribute("tabindex", "0");
    await disableChildTabbing(this, childRole);
}

async function dispose() {
    crsbinding.dom.disableEvents(this);
}

async function gotoNext() {
    this._direction = 1;
    this.focusedIndex++;
}

async function gotoPrevious() {
    this._direction = -1;
    this.focusedIndex--;
}

async function gotoFirst() {
    this.focusedIndex = 0;
}

async function gotoLast() {
    this.focusedIndex = this._childLength - 1;
}

async function activate() {
    this.selectedIndex = this.focusedIndex;
    const selectedElement = this.children[this.selectedIndex];
    this.dispatchEvent(new CustomEvent("changed", {detail: selectedElement}));
}

async function expand() {
    console.log("expand");
}

async function collapse() {
    console.log("collapse");
}

async function _focus(event) {
    if (event != null && Array.from(this.children).indexOf(event.relatedTarget) != -1) {
        return;
    }

    const selectedIndex = Number(this.dataset.selected || 0);
    this.focusedIndex = selectedIndex;
    await setNewSelectedIndex.call(this, selectedIndex);

    this.children[this.selectedIndex].focus();
}