const xmlns = "http://www.w3.org/2000/svg";

export async function disableChildTabbing(element, childRole) {
    for (let child of element.children) {
        child.setAttribute("tabindex", "-1");

        if (childRole != null) {
            child.setAttribute("role", childRole);
        }
    }
}

export async function createSvgButton(name) {
    const svg = document.createElementNS(xmlns, "svg");
    const use = document.createElementNS(xmlns, "use");
    use.setAttribute("href", `#${name}`);
    svg.appendChild(use);
    svg.setAttribute("role", "button");
    svg.setAttribute("aria-haspopup","true");
    svg.setAttribute("aria-expanded", "false");
    svg.setAttribute("viewBox","0 0 24 24");
    svg.setAttribute("width", "32px");
    svg.setAttribute("height", "32px");
    svg.style.display = "block";
    return svg;
}

export async function createVerticalList(hidden = true) {
    const list = document.createElement("ul");
    list.setAttribute("is", "ul-list");

    if (hidden == true) {
        list.setAttribute("hidden", "hidden");
    }
    return list;
}

export async function createListItem(element) {
    const listItem = document.createElement("li");
    listItem.setAttribute("role", "listitem");
    listItem.setAttribute("tabindex", "-1");
    listItem.appendChild(element);
    return listItem;
}

export async function createSpacer() {
    const element = document.createElement("div");
    element.style.flex = "1";
    element.dataset.tabstop = "false";
    return element;
}