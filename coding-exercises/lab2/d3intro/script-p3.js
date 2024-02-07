import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm"

let myData = [4, 6, 8, 2, 9];

let viz = d3.select("#viz-container") // similar to get element by id or query selector
    .append("svg") // selection change append svg
        .attr("id", "viz") // modification current selection
        .attr("width", 800) 
        .attr("height", 800)
;

function xLocation(d) {
    console.log(d);
    return d * 50;

}

viz.selectAll("circle").data(myData).enter().append("circle")
                                                .attr("cx", xLocation)
                                                .attr("cy", 400)
                                                .attr("r", 10)
                                                .attr("fill", "white")

;