const xmlns = "http://www.w3.org/2000/svg";

export async function disableChildTabbing(element, childRole) {
    for (let child of element.children) {
        child.setAttribute("tabindex", "-1");

        if (childRole != null) {
            child.setAttribute("role", childRole);
        }
    }
}

export async function createSvgButton(name, hasPopup = true) {
    const svg = document.createElementNS(xmlns, "svg");
    const use = document.createElementNS(xmlns, "use");
    use.setAttribute("href", `#${name}`);
    svg.appendChild(use);
    svg.setAttribute("viewBox","0 0 24 24");
    svg.setAttribute("role", "button");
    svg.setAttribute("width", "32px");
    svg.setAttribute("height", "32px");
    svg.setAttribute("tabindex", "-1");
    svg.setAttribute("aria-label", "additional items");
    svg.style.display = "block";

    if (hasPopup == true) {
        svg.setAttribute("aria-haspopup","true");
        svg.setAttribute("aria-expanded", "false");
    }

    return svg;
}

/**
 *
 * @param hidden
 * @returns {Promise<HTMLUListElement>}
 */
export async function createVerticalList(hidden = true) {
    const list = document.createElement("ul");
    list.setAttribute("is", "ul-list");

    if (hidden == true) {
        list.setAttribute("hidden", "hidden");
    }
    return list;
}

/**
 * Create a list item with the appropriate attributes for aria
 * @param element
 * @returns {Promise<HTMLLIElement>}
 */
export async function createListItem(element) {
    const listItem = document.createElement("li");
    listItem.setAttribute("role", "listitem");
    listItem.setAttribute("tabindex", "-1");
    listItem.appendChild(element);
    return listItem;
}

/**
 * This is a spacer element that is not tab stopable that takes up the remainder space to help with spacing items on flexbox.
 * @returns {Promise<HTMLDivElement>}
 */
export async function createSpacer() {
    const element = document.createElement("div");
    element.style.flex = "1";
    element.dataset.tabstop = "false";
    return element;
}

/**
 * Show a element as fixed relative to the parent element.
 * If the element falls off screen ensure that it stays on screen
 * @param parentElement <HTMLElement> the element determining the position
 * @param element <HTMLElement> the element to fix the position
 * @param location <string> "top", "bottom", "left", "right"
 * @param screenPadding <number> How many pixels from the edge of the screen must the element be.
 * @returns {Promise<void>}
 */
export async function showElementRelativeTo(parentElement, element, location, padding = 0, screenPadding = 16) {
    switch(location) {
        case "left": await placeLeft(parentElement, element, padding); break;
        case "right": await placeRight(parentElement, element, padding); break;
        case "top": await placeTop(parentElement, element, padding); break;
        case "bottom": await placeBottom(parentElement, element, padding); break;
    }

    await ensureOnScreen(element, screenPadding);
}

/**
 * Set an element to be fixed position and where the left and top positions are
 * @param element
 * @param left
 * @param top
 * @returns {Promise<void>}
 */
async function setFixedPosition(element, left, top) {
    element.style.position = "fixed";
    element.style.left = `${left}px`;
    element.style.top = `${top}px`;
}

/**
 * Get the element's bounding rect
 * @param element <HTMLElement>
 * @returns {Promise<DOMRect>}
 */
export async function getElementBounds(element) {
    return element.getBoundingClientRect();
}

/**
 * Place the element left of the parent element
 * @param parentElement
 * @param element
 * @returns {Promise<void>}
 */
export async function placeLeft(parentElement, element, padding) {
    const parentRect = await getElementBounds(parentElement);
    const rect = await getElementBounds(element);

    const left = parentRect.left - rect.width - padding;
    const top = parentRect.top;
    await setFixedPosition(element, left, top);

    return rect;
}

/**
 * Place the element right of the parent element
 * @param parentElement
 * @param element
 * @returns {Promise<void>}
 */
export async function placeRight(parentElement, element, padding) {
    const parentRect = await getElementBounds(parentElement);
    const rect = await getElementBounds(element);

    const left = parentRect.left + parentRect.width + padding;
    const top = parentRect.top;
    await setFixedPosition(element, left, top);

    return rect;
}

/**
 * Place the element at the top of the parent element
 * @param parentElement
 * @param element
 * @returns {Promise<void>}
 */
export async function placeTop(parentElement, element, padding) {
    const parentRect = await getElementBounds(parentElement);
    const rect = await getElementBounds(element);

    const left = parentRect.left;
    const top = parentRect.top - rect.height - padding;
    await setFixedPosition(element, left, top);

    return rect;
}

/**
 * Place a element at the bottom of the parent element
 * @param parentElement
 * @param element
 * @returns {Promise<void>}
 */
export async function placeBottom(parentElement, element, padding) {
    const parentRect = await getElementBounds(parentElement);
    const rect = await getElementBounds(element);

    const left = parentRect.left;
    const top = parentRect.top + parentRect.height + padding;
    await setFixedPosition(element, left, top);

    return rect;
}

/**
 * Ensure that the element does not fall off the edge of the screen
 * @param element <HTMLElement> element to check screen location on
 * @param screenPadding <number> space in pixels required between the element and the screen edges
 * @param elementBounds <rect> optional - if available the element's current bounding rect.
 * @returns {Promise<void>}
 */
export async function ensureOnScreen(element, screenPadding) {
    const rect = await getElementBounds(element);
    const elementBounds = {left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom, width: rect.width, height: rect.height};

    const bodyBounds = await getElementBounds(document.body);

    // check left side
    if (elementBounds.left < 0) {
        elementBounds.left = screenPadding;
    }

    // check right side
    if (elementBounds.left + elementBounds.width >  bodyBounds.left + bodyBounds.width) {
        elementBounds.left = bodyBounds.left + bodyBounds.width - elementBounds.width - screenPadding;
    }

    // check top side
    if (elementBounds.top < 0) {
        elementBounds.top = screenPadding;
    }

    // check bottom side
    if (elementBounds.top + elementBounds.height > bodyBounds.top + bodyBounds.height) {
        elementBounds.top = bodyBounds.top + bodyBounds.height - elementBounds.height - screenPadding;
    }

    await setFixedPosition(element, elementBounds.left, elementBounds.top);
}