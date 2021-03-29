globalThis.crs = globalThis.crs || {};
globalThis.crs.iconsPath = globalThis.crs.iconsPath || "/images/material-design-icons";

globalThis.crs.getFilePath = name => {
    const parts = name.split("/");
    return `${globalThis.crs.iconsPath}/${parts[0]}/ic_${parts[1]}_24px.svg`;
}
