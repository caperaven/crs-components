export class BaseProvider {
    constructor(parser) {
        this.parser = parser;
    }

    async dispose() {
        delete this.parser;
    }
}