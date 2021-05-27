export async function setMouse(variable, event, rect) {
    variable.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    variable.y = - ((event.clientY - rect.top) / rect.height) * 2 + 1;
}
