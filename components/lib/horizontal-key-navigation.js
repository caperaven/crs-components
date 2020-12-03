export async function enableHorizontalKeys(target) {
    target.registerEvent(target,"keyup", handleHorizontalKeys.bind(target));
}

async function handleHorizontalKeys(event) {
    event.preventDefault();
    switch(event.code) {
        case "ArrowLeft": return this.gotoPrevious && await this.gotoPrevious();
        case "ArrowRight": return this.gotoNext && await this.gotoNext();
        case "ArrowDown": return this.expand && await this.expand();
        case "ArrowUp": return this.collapse && await this.collapse();
        case "Enter": return this.activate && await this.activate();
        case "Space": return this.activate && await this.activate();
        case "Home": return this.gotoFirst && await this.gotoFirst();
        case "End": return this.gotoLast && await this.gotoLast();
    }
}