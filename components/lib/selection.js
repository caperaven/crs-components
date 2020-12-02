export async function setNewFocusIndex(newValue) {
    await reverseFocus.call(this, this._focusIndex);
    this._focusIndex = await ensureSelectionBounds.call(this, newValue);
    await setFocus.call(this, this._focusIndex);
}

export async function setNewSelectedIndex(newValue) {
    await reverseSelection.call(this, this._selectedIndex);
    this._selectedIndex = newValue;
    await setSelection.call(this, newValue);
}

export async function ensureSelectionBounds(index) {
    let result = index;
    if (index < 0) {
        result = this._childLength - 1;
    }
    else if (index > this._childLength - 1) {
        result = 0;
    }
    return result;
}

export async function reverseFocus(index) {
    if (index == null) return;
    this.children[index].setAttribute("tabindex", "-1");
}

export async function setFocus(index) {
    this.children[index].setAttribute("tabindex", "0");
    this.children[index].focus();
}

export async function reverseSelection(index) {
    if (index == null) return;
    if (this.reverseSelection != null) {
        await this.reverseSelection(this.children[index]);
    }
    else {
        this.children[index].removeAttribute("aria-selected");
    }
}

export async function setSelection(index) {
    if (this.setSelection != null) {
        await this.setSelection(this.children[index]);
    }
    else {
        this.children[index].setAttribute("aria-selected", "true");
    }
}