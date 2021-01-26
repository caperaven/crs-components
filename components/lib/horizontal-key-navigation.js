export async function enableHorizontalKeys(target) {
    target.registerEvent(target,"keyup", handleHorizontalKeys.bind(target), {capture: true});
}

async function handleHorizontalKeys(event) {
    event.preventDefault();
    event.stopPropagation();
    switch(event.code) {
        case "ArrowLeft": return this.gotoPrevious && await this.gotoPrevious(event);
        case "ArrowRight": return this.gotoNext && await this.gotoNext(event);
        case "ArrowDown": return this.expand && await this.expand(event);
        case "ArrowUp": return this.collapse && await this.collapse(event);
        case "Enter": return this.activate && await this.activate(event);
        case "Space": return this.activate && await this.activate(event);
        case "Home": return this.gotoFirst && await this.gotoFirst(event);
        case "End": return this.gotoLast && await this.gotoLast(event);
    }
}