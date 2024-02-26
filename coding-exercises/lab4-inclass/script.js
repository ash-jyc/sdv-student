import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

let viz = d3.select("#viz-container")
    .append("svg")
        .attr("width", 4000)
        .attr("height", 4000)
        .attr("id", "viz")
;

function getLocation(d, i) {
    console.log(parseInt(d.snapshot_date.slice(5,7)) * 200)
    let x = 20+(parseInt(d.album_release_date.slice(0, 4))-2000)*400;
    let y = (parseInt(d.snapshot_date.slice(5, 7)))+400;
    return "translate("+x+","+y+")";

}

function getName(d, i) {
    return d.name;
}

function getCountry(d, i) {
    return d.country;
}

function gotData(incomingData) {

    let filteredData = incomingData.filter((d) => {
        return parseInt(d.album_release_date.slice(0, 4)) <= 2014 && parseInt(d.album_release_date.slice(0, 4)) >= 2000 && d.daily_rank == "1";
    });

    // console.log(filteredData)

    let groupelements = viz.selectAll(".datagroup").data(filteredData).enter()
        .append("g")
        .attr("class", "datagroup")
        .attr("transform", getLocation)
    ;

    groupelements.append("circle")
        .attr("r", 5)
        .attr("x", 10)
        .attr("y", 10)
    ;

    groupelements.append("text")
        .text(getName)
    ;
    groupelements.append("text")
        .text(getCountry)
        .attr("y", 15)
    ;
}

d3.csv("universal_top_spotify_songs.csv").then(gotData);