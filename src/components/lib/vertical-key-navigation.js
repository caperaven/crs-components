export async function enableVerticalKeys(target) {
    target.registerEvent(target,"keyup", handleVerticalKeys.bind(target), {capture: true});
}

async function handleVerticalKeys(event) {
    event.preventDefault();
    switch(event.code) {
        case "ArrowDown": return this.gotoNext && await this.gotoNext(event);
        case "ArrowUp": return this.gotoPrevious && await this.gotoPrevious(event);
        case "ArrowRight": return this.expand && await this.expand(event);
        case "ArrowLeft": return this.collapse && await this.collapse(event);
        case "Enter": return this.activate && await this.activate(event);
        case "Space": return this.activate && await this.activate(event);
        case "Home": return this.gotoFirst && await this.gotoFirst(event);
        case "End": return this.gotoLast && await this.gotoLast(event);
        case "Escape": return this.cancel && await this.cancel(event);
    }
}