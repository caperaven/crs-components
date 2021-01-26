export async function setNewFocusIndex(newValue) {
    await reverseFocus.call(this, this._focusIndex);
    this._focusIndex = await ensureSelectionBounds.call(this, newValue);
    await setFocus.call(this, this._focusIndex);
}

export async function setNewSelectedIndex(newValue) {
    await reverseSelection.call(this);
    this._selectedIndex = newValue;

    if (newValue != null) {
        await setSelection.call(this, newValue);
    }
}

export async function ensureSelectionBounds(index) {
    let result = index;
    const length = this.children.length;
    if (index < 0) {
        result = length - 1;
    }
    else if (index > length - 1) {
        result = 0;
    }
    return result;
}

/**
 * Remove the current focus mark on the current focused element
 * @param index
 * @returns {Promise<void>}
 */
export async function reverseFocus(index) {
    if (index == null || index > this.children.length - 1) return;
    this.children[index].setAttribute("tabindex", "-1");
}

/**
 * Set the current focus mark on the new focused element
 * @param index
 * @returns {Promise<void>}
 */
export async function setFocus(index) {
    if (this.children[index].dataset.tabstop == "false") {
        return this._direction == 1 ? await this.gotoNext() : await this.gotoPrevious();
    }
    this.children[index].setAttribute("tabindex", "0");
    this.children[index].focus();
}

export async function reverseSelection() {
    const element = this.querySelector('[aria-selected]');
    if (element == null) return;

    if (this.reverseSelection != null) {
        await this.reverseSelection(element);
    }
    else {
        element.setAttribute("tabindex", "-1");
        element.removeAttribute("aria-selected");
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