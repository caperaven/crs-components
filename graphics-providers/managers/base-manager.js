export class BaseManager {
    constructor(parser) {
        this.parser = parser;
        this.isManager = true;
    }

    async dispose() {
        delete this.parser;
    }
}