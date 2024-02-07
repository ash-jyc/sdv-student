import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm"

let viz = d3.select("#viz-container") // similar to get element by id or query selector
    .append("svg") // selection change append svg
        .attr("id", "viz") // modification current selection
        .attr("width", 800) 
        .attr("height", 800)
;

function gotData(rawData) {
    console.log(rawData);
    viz.selectAll("circle").data(rawData).enter().append("circle")
                                                    .attr("cx", (d) => {
                                                        return 100 + d["Population_%Change"] * 400
                                                    })
                                                    .attr("cy", 400)
                                                    .attr("r", 10)
                                                    .attr("fill", "red")
    
    ;
}

d3.json("Wikipedia-World-Statistics-2023.json").then(gotData);
