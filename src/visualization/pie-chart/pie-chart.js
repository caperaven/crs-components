import {select} from "./../../../third-party/d3js/d3-selection.js";
import {pie, arc} from "./../../../third-party/d3js/d3-shape.js";

class PieChart extends HTMLElement {
    get data() {
        return this._data;
    }

    set data(newValue) {
        this._data = newValue;
        if (this.isReady === true) {
            this._update(newValue);
        }
    }

    async connectedCallback() {
        this.innerHTML = await fetch(import.meta.url.replace(".js", ".html")).then(result => result.text());

        requestAnimationFrame(() => {
            if (this._data != null) {
                this._update(this._data);
            }

            this.isReady = true;
            this.dispatchEvent(new CustomEvent("isReady"));
        })
    }

    async disconnectedCallback() {
        delete this._data;
    }

    async _clearItems() {
        const ul = this.querySelector("ul");
        while(ul.children.length > 0) {
            ul.removeChild(ul.firstChild);
        }
        return ul;
    }

    async _update(data) {
        await this._updateList(data);
        await this._updateChart(data);
    }

    async _updateChart(data) {
        const width = 400;
        const height = 400;
        const margin = this.dataset.margin || 16;
        const radius = Math.min(width, height) / 2 - margin;

        const svgElement = this.querySelector("svg");
        const svg = select(svgElement)
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${width / 2}, ${height / 2})`);

        const pieShape = pie().value(d => d[1].value);
        const shapeData = pieShape(Object.entries(data));

        svg
            .selectAll("path")
            .data(shapeData)
            .enter()
            .append("path")
            .attr("d", arc().innerRadius(0).outerRadius(radius))
            .attr("fill", d => d.data[1].color || this.dataset.color || "blue")
            .attr("stroke", "black")
            .style("stroke-width", "2px")
            .style("opacity", 0.7)
    }

    async _updateList(data) {
        const ul = await this._clearItems();
        const template = this.querySelector("#legened-item");
        const colorField = this.dataset.colorfield || "color";
        const titleField = this.dataset.titlefield || "title";
        const valueField = this.dataset.valuefield || "value";

        const fragment = document.createDocumentFragment();
        for (let record of data) {
            const color = record[colorField] || "cornflowerblue";
            const title = record[titleField];
            const value = record[valueField];
            const instance = template.content.cloneNode(true);
            instance.querySelector(".item-color").dataset.color = color;
            instance.querySelector(".item-text").textContent = title;
            instance.querySelector(".item-value").textContent = value;
            fragment.appendChild(instance);
        }
        ul.appendChild(fragment);
    }
}

customElements.define("pie-chart", PieChart);