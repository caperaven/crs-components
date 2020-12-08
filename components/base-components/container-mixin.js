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

    target.init = init.bind(target);
    target.dispose = dispose.bind(target);
    target.gotoNext = gotoNext.bind(target);
    target.gotoPrevious = gotoPrevious.bind(target);
    target.gotoFirst = gotoFirst.bind(target);
    target.gotoLast = gotoLast.bind(target);
    target.activate = activate.bind(target);
    target.expand = expand.bind(target);
    target.collapse = collapse.bind(target);
    target._focusIn = _focusIn.bind(target);
    target._focusOut = _focusOut.bind(target);
}

async function init(role, childRole) {
    this._childLength = this.children.length;

    crsbinding.dom.enableEvents(this);
    this.registerEvent(this,"focusin", this._focusIn);
    this.registerEvent(this, "focusout", this._focusOut);

    if (role != null) {
        this.setAttribute("role", role);
    }
    this.setAttribute("tabindex", "0");
    await disableChildTabbing(this, childRole);
}

async function dispose() {
    crsbinding.dom.disableEvents(this);
}

async function gotoNext(event) {
    this._direction = 1;
    this.focusedIndex++;
}

async function gotoPrevious(event) {
    this._direction = -1;
    this.focusedIndex--;
}

async function gotoFirst(event) {
    this.focusedIndex = 0;
}

async function gotoLast(event) {
    this.focusedIndex = this._childLength - 1;
}

async function activate(event, ignoreOverload = false) {
    if (this.activateOverload != null && ignoreOverload == false) {
        return await this.activateOverload(event);
    }

    this.selectedIndex = this.focusedIndex;
    const selectedElement = this.children[this.selectedIndex];
    this.dispatchEvent(new CustomEvent("changed", {detail: selectedElement}));
}

async function expand(event) {
    console.log("expand");
}

async function collapse(event) {
    console.log("collapse");
}

async function _focusIn(event) {
    if (event == null || event.relatedTarget == null || event.relatedTarget.parentElement == this) {
        return;
    }

    const selectedIndex = Number(this.dataset.selected || 0);
    this.focusedIndex = selectedIndex;
    await setNewSelectedIndex.call(this, selectedIndex);

    this.setAttribute("tabindex", "-1");
    this.children[selectedIndex].focus();
}

async function _focusOut(event) {
    if (event == null || event.relatedTarget == null || event.relatedTarget.parentElement == this) {
        return;
    }

    if (this.dataset.persist === "true") {
        this.dataset.selected = this._focusIndex;
    }

    await setNewSelectedIndex.call(this, null);
    this.setAttribute("tabindex", "0");
}