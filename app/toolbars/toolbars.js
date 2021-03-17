import "../../src/components/toolbars/overflow-toolbar.js";
import "../../src/components/toolbars/standard-toolbar.js";

export default class Toolbars extends crsbinding.classes.ViewBase {
    log(event) {
        console.log(event.target.innerText);
    }
}