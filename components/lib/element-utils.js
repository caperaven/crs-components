export async function disableChildTabbing(element, childRole) {
    for (let child of element.children) {
        child.setAttribute("tabindex", "-1");

        if (childRole != null) {
            child.setAttribute("role", childRole);
        }
    }
}