export async function enableVerticalKeys(target) {
    target.registerEvent(target,"keyup", handleVerticalKeys.bind(target));
}

async function handleVerticalKeys(event) {
    event.preventDefault();
    switch(event.code) {
        case "ArrowDown": return this.gotoNext && await this.gotoNext();
        case "ArrowUp": return this.gotoPrevious && await this.gotoPrevious();
        case "ArrowRight": return this.expand && await this.expand();
        case "ArrowLeft": return this.collapse && await this.collapse();
        case "Enter": return this.activate && await this.activate();
        case "Space": return this.activate && await this.activate();
        case "Home": return this.gotoFirst && await this.gotoFirst();
        case "End": return this.gotoLast && await this.gotoLast();
    }
}