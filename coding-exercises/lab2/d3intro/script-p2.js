import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm"

let viz = d3.select("#viz-container") // similar to get element by id or query selector
    .append("svg") // selection change append svg
        .attr("id", "viz") // modification current selection
        .attr("width", 800) 
        .attr("height", 800)
;

let myData = [4, 6, 8, 2, 9];

viz.selectAll("circle").data(myData).enter().append("circle")
                                        .attr("cx", 100)
                                        .attr("cy", 400)
                                        .attr("r", 50)

;