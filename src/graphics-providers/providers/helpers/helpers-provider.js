import {BaseProvider} from "../base-provider.js";

export default class HelpersProvider extends BaseProvider {
    get key() {
        return "Helpers";
    }

    async processItem(items, program) {
        for (let item of items) {
            await this.parser.providers.get(item.type).processItem(item, program);
        }
    }
}