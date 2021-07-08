import {BaseProvider} from "../base-provider.js";
import {rawToGeometry} from "../../../gfx-helpers/raw-to-geometry.js";
import {updateTransform} from "../../helpers/update-transforms.js";

export default class IconGeometry extends BaseProvider {
    get key() {
        return "icon";
    }

    async processItem(item, program) {
        const shapeName = `${item.shape}Data`;
        const data = (await import(`./../../../geometry-data/icons/${shapeName}.js`))[shapeName];
        const geometry = await rawToGeometry(data);
        const material = await this.getMaterial(item.material, program);
        const mesh = await crs.createThreeObject("Mesh", geometry, material);

        await updateTransform(mesh, item?.args?.transform);

        return mesh;
    }
}