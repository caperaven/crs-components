import {BaseManager} from "./base-manager.js";

export default class ExtensionsManager extends BaseManager {
    get key() {
        return "extensions";
    }

    async processItem(extensions, program) {
        if (program._extensions == null) {
            program._extensions = [];
            program._disposables.push(disposeExtensions.bind(program));
        }

        for (let extension of extensions) {
            await this.loadExtension(extension, program);
        }
    }

    async loadExtension(extension, program) {
        let file = await this.parser.managers.get("locations").process(extension.file, this.parser.locations);
        if (file.indexOf(".js") == -1) {
            file = `${file}.js`;
        }
        const module = await import(file);
        await this.enableExtension(extension.enable, module, program);
        await this.disableExtension(extension.disable, module, program);
    }

    async enableExtension(enable, module, program) {
        const parameters = await this.processParameters(enable.parameters, program);
        const fn = module[enable.call];
        await fn(...parameters);
    }

    async disableExtension(disable, module, program) {
        const fn = module[disable.call];
        program._extensions.push(fn);
    }

    async processParameters(parameters, program) {
        for (let i = 0; i < parameters.length; i++) {
            const parameter = parameters[i];
            if (typeof parameter == "string", parameter.indexOf("@context") != -1) {
                parameters[i] = await this.getContextValue(parameter, program);
            }
        }

        return parameters;
    }

    async getContextValue(parameter, program) {
        parameter = parameter.replace("@context.", "return context.");
        const fn = new Function("context", parameter);
        return fn(program);
    }

}

async function disposeExtensions() {
    for (let extension of this._extensions) {
        await extension(this.canvas);
    }
    this._extensions = null;
}