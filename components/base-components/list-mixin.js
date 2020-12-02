import {setNewFocusIndex, setNewSelectedIndex} from "../lib/selection.js";
import {disableChildTabbing} from "../lib/element-utils.js";
import {enableVerticalKeys} from "../lib/vertical-key-navigation.js";

export async function enableListFeatures(target) {
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
    target.moveDown = moveDown;
    target.moveUp = moveUp;
    target.gotoFirst = gotoFirst;
    target.gotoLast = gotoLast;
    target.activate = activate;
    target.expand = expand;
    target.collapse = collapse;
    target.focus = focus;
}

async function init(role, childRole) {
    this._childLength = this.children.length;

    crsbinding.dom.enableEvents(this);
    this.registerEvent(this,"focus", this.focus.bind(this));

    if (role != null) {
        this.setAttribute("role", role);
    }
    this.setAttribute("tabindex", "0");
    await disableChildTabbing(this, childRole);

    await enableVerticalKeys(this);
}

async function dispose() {
    crsbinding.dom.disableEvents(this);
}

async function moveDown() {
    this.focusedIndex++;
}

async function moveUp() {
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

async function focus() {
    const selectedIndex = Number(this.dataset.selected || 0);
    this.focusedIndex = selectedIndex;
    await setNewSelectedIndex.call(this, selectedIndex);

    this.children[this.selectedIndex].focus();
}