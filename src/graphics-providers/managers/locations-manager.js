import {BaseManager} from "./base-manager.js";

export default class LocationsManager extends BaseManager {
    get key() {
        return "locations";
    }

    async processItem(locations, program) {
        if (locations != null) {
            this.parser.locations = locations;
        }

        // JHR: todo: this must move out of the class so that you dispose it and still keep the program working
        this.parser.processors.set(this.key, this.process.bind(this));
    }

    async process(value, locations) {
        const parts = value.split("/");
        const path = parts[0].replace("@locations.", "");
        parts[0] = locations[path];
        return parts.join("/");
    }
}