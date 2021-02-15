/**
 * This function creates a utility function to render rows based on the column definitions.
 * @param columnsDef
 * @returns function
 */
export function generateRowRenderer(args) {
    // JHR: todo, see if you can optimize this with cloneNode instead of canvas.create
    const code = [
        `const ctx = crs.canvas.create(${args.rowWidth}, ${args.rowHeight}, "#ffffff");`,
        `ctx.fill = "#000000";`,
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