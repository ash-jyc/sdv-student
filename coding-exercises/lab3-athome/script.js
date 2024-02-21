import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

let viz = d3.select("#viz-container")
    .append("svg")
        .attr("width", 500)
        .attr("height", 500)
        .attr("id", "viz")
;

function getLocation(d, i) {
    let x = 50+Math.random()*400;
    // let y = 50+Math.random()*400;
    let y = d.Score/10 * 500;
    return "translate("+x+","+y+")";
}

function getName(d, i) {
    return d.Title;
}

function gotData(incomingData) {
    // console.log(incomingData);
    let subset = incomingData.slice(0, 100);
    // console.log(subset);

    let datagroups = viz.selectAll(".mangaGroup").data(subset).enter().append("g")
                .attr("class", "mangaGroup")
                .attr("transform", getLocation);
    ;

    datagroups.append("circle")
                .attr("class", "mangaItem")
                // .attr("cx", getX)
                // .attr("cy", getY)
                .attr("r", 5)
    ;
    datagroups.append("text")
                .attr("class", "mangaTitle")
                .attr("x", 7)
                .attr("y", 6)
                .text(getName)
    ;

    
}

d3.json("manga.json").then(gotData);