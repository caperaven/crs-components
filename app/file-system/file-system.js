import "./../../src/components/file-system/file-system.js"
import "/node_modules/crs-process-api/action-systems/fs-actions.js"

export default class FileSystem extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();
    }

    open() {
        document.querySelector("file-system").selectFolder();
    }
}