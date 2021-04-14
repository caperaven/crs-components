import {BaseManager} from "./base-manager.js";
import {TemplateParser} from "./../template-parser.js";

export default class TemplateManager extends BaseManager {
    get key() {
        return "templates";
    }

    async processItem(templates, program) {
        program._templates = templates;
        program._disposables.push(dispose.bind(program));
        program._templateParser = new TemplateParser();
        await program._templateParser.initialize();
        program.addFromTemplate = addFromTemplate.bind(program);
    }
}

async function dispose() {
    this._templates = null;
    this.addFromTemplate = null;
    this._templateParser = null;
}

async function addFromTemplate(id, data) {
    const template = this._templates.find(item => item.id == id);
    if (template == null) {
        return console.error(`no template found for id: ${id}`);
    }

    const mesh = await this._templateParser.parse(template, this, data);
    this.canvas.scene.add(mesh);
}