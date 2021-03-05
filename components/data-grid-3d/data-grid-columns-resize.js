export async function enableColumnResize(parent, minWidth) {
    parent._columnResizeContext = {
        container: parent.querySelector(".grid-columns"),
        minWidth: minWidth
    };

    parent._columnResizeContext.mouseDownHandler = mouseDown.bind(parent._columnResizeContext);
    parent._columnResizeContext.mouseMoveHandler = mouseMove.bind(parent._columnResizeContext);
    parent._columnResizeContext.mouseUpHandler = mouseUp.bind(parent._columnResizeContext);

    parent._columnResizeContext.container.addEventListener("mousedown", parent._columnResizeContext.mouseDownHandler);
}

export async function disableColumnResize(parent) {
    parent._columnResizeContext.container.removeEventListener("mousedown", parent._columnResizeContext.mouseDownHandler);
    delete parent._columnResizeContext.mouseDownHandler;
    delete parent._columnResizeContext.mouseMoveHandler;
    delete parent._columnResizeContext.mouseUpHandler;
    delete parent._columnResizeContext.container;
    delete parent._columnResizeContext.resizeTarget;
    delete parent._columnResizeContext.resizeRect;
    delete parent._columnResizeContext;
}

async function mouseDown(event) {
    if (event.target.classList.contains("resize-icon")) {
        this.resizeTarget = event.target.parentElement;
        this.resizeRect = event.target.parentElement.getBoundingClientRect();
        this.container.parentElement.addEventListener("mousemove", this.mouseMoveHandler);
        this.container.parentElement.addEventListener("mouseup", this.mouseUpHandler);
        this.startX = event.clientX;
    }
}

async function mouseMove(event) {
    this.x = event.clientX;
    const offsetX = this.x - this.startX;
    let width = this.resizeRect.width + offsetX;
    if (width < this.minWidth) {
        width = this.minWidth;
    }

    this.resizeTarget.style.width = `${width}px`;
    this.newWidth = width;
}

async function mouseUp(event) {
    this.container.parentElement.removeEventListener("mousemove", this.mouseMoveHandler);
    this.container.parentElement.removeEventListener("mouseup", this.mouseUpHandler);

    const field = this.resizeTarget.dataset.field;
    const def = this.columnsDef.find(item => item.field == field);
    def.width = this.newWidth;

    delete this.columnsDef;
    delete this.resizeRect;
    delete this.resizeTarget;
    delete this.startX;
    delete this.x;
    delete this.newWidth;
}