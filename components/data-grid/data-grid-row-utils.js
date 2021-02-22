/**
 * This function creates a utility function to render rows based on the column definitions.
 * @param columnsDef
 * @returns function
 */
export function generateRowRenderer(args) {
    const code = [
        `const ctx = crs.canvas.create(${args.rowWidth}, ${args.rowHeight}, "#ffffff");`,
        `ctx.fillStyle = "transparent";`,
        `ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);`,
        `ctx.fillStyle = "#000000";`,
        `ctx.font = "16px serif";`
    ];
    let offsetX = 0;
    for (let column of args.columnsDef) {
        const field = column["field"];
        const width = Number(column["width"] || args.defaultWidth);

        code.push(`context["${field}"] && ctx.fillText(context["${field}"],${offsetX + args.padding}, ${args.textHeight + args.padding});`)

        offsetX += width;
    }
    code.push("return ctx");
    return new AsyncFunction("context", code.join("\n"));
}

export function calculateRowWidth(columns) {
    let rowWidth = 0;
    for (let column of columns) {
        rowWidth += Number(column.width);
    }
    return rowWidth;
}