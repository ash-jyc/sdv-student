import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const width = 600, height = 600;
const outerRadius = Math.min(450, 450) / 2 - 20; // Adjusted for visibility
const innerRadius = 30; // Inner circle where visualization starts
const colorMap = { "Unwritten": "cyan", "Murder On The Dancefloor": "magenta" };


// Create SVG container
const svg = d3.select("#container").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background-color", "black")
    .append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`)
;
let backgroundLayer = svg.append("g").attr("class", "background");
let dateFormat = d3.timeFormat("%B %-d, %Y")
let dateText = backgroundLayer.append("text")
    .attr("x", 0)
    .attr("y", -outerRadius - 60)
    .style("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .attr("fill", "white")
;
backgroundLayer.append("text")
    .attr("x", -250)
    .attr("y", outerRadius + 40)
    .text("Unwritten")
    .attr("fill", colorMap["Unwritten"])
;

backgroundLayer.append("text")
    .attr("x", -250)
    .attr("y", outerRadius + 25)
    .text("Murder On The Dancefloor")
    .attr("fill", colorMap["Murder On The Dancefloor"])
;


let graphLayer = svg.append("g").attr("class", "graph");

// global scales
const radialScale = d3.scaleLinear().domain([0, 50]).range([innerRadius, outerRadius]);
let countryScale = d3.scalePoint();

// background:
backgroundLayer.selectAll(".blgCircle").data(new Array(26)).enter()
    .append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", (d, i)=>radialScale((i) * 2))
        .style("fill", "none")
        .style("stroke", "gray")
        .style("stroke-dasharray", "2,2")
;

backgroundLayer.selectAll(".bullsEye").data(new Array(3)).enter()
    .append("circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", (d, i, all)=>(5+innerRadius/all.length*i))
    .attr("fill", "none")
    .attr("stroke", "white")
    .attr("stroke-width", 5)
;



function getPositionEnterExit(d){
    let r = width;
    let a = countryScale(d.country);
    let x = 0//Math.cos(a)*r;
    let y = 0//-height/2-10;//Math.sin(a)*r;
    return "translate("+x+", "+y+")"
}
function getPosition(d){
    let r = radialScale(d.daily_rank);
    let a = countryScale(d.country);
    let x = Math.cos(a)*r;
    let y = Math.sin(a)*r;
    return "translate("+x+", "+y+")"
}


function visualizeData(songData) {
    console.log("data of the day", songData)
    // Derive countries to create a scale for angles
    // const countries = Array.from(new Set(songData.map(d => d.country).filter(country => country != "")));
    // console.log(countries)
    
    // const mxaxRank = 50; // d3.max(songData, d => parseInt(d.daily_rank));

    dateText.text(dateFormat(songData[0].snapshot_date))


    let countryList = Array.from(new Set(songData.map(d => d.country).filter(country => country != "")));
    console.log(countryList)
    countryScale.domain(countryList).range([0, 2*Math.PI - (  (2*Math.PI)/countryList.length  )])
    
    let countryLabelGroups = backgroundLayer.selectAll(".countryCode").data(countryList, d=>d)
    

    // // entering:
    countryLabelGroups.enter()
        .append("g")
            .attr("class", "countryCode")
            .attr("transform", d=>{

                let a = countryScale(d) * 180/Math.PI;
                return "rotate("+(a)+")"
            })
        .append("g")
            .attr("transform", d=>{
                // let a = countryScale(d);
                let x = (outerRadius+10)
                let y = 0
                return "translate("+x+", "+y+")"
                // let a = country?Scale(d) * 180/Math.PI;
                // return "rotate("+(a+90)+")"
            })
        .append("text")
            .text(d=>d)
            .attr("fill", "white")
            .attr("text-anchor", "middle")
            .attr("x", 0)
            .attr("y", 6)
            .attr("transform", d=>{
                // let a = countryScale(d) * 180/Math.PI;
                return "rotate("+(90)+")"
            })
    ;

    //update
    countryLabelGroups.transition().attr("transform", d=>{
        // let a = countryScale(d);
        // let x = Math.cos(a)* (outerRadius+10)
        // let y = Math.sin(a)* (outerRadius+10)
        // return "translate("+x+", "+y+")"
        let a = countryScale(d) * 180/Math.PI;
        return "rotate("+(a)+")"
    })
    // exit
    countryLabelGroups.exit().remove()



    let datagroups = graphLayer.selectAll(".datagroup").data(songData, d=>{
        return d.name + d.country
    });

    // enter
    let enteringGroup = datagroups.enter()
        .append("g")
            .attr("class", "datagroup")
            .attr("transform", getPositionEnterExit)
    ;
    enteringGroup.transition()
            .attr("transform", getPosition)
    ;
    enteringGroup.append("circle")
            .attr("r", 5)
            .attr("fill", d=>{
                return colorMap[d.name]
            })
    ;
    // update
    datagroups.transition().attr("transform", getPosition);
    // exit
    datagroups.exit().transition().attr("transform", getPositionEnterExit).remove();



}

// Sample invocation with your processedData
// visualizeData(processedData);



function gotData(incomingData) {
    // console.log(incomingData)
    let filteredData = incomingData.filter(d =>
        (d.name === "Unwritten" || d.name === "Murder On The Dancefloor") && d.country!="")
    
    let dateParser = d3.timeParse("%Y-%m-%d");
    console.log(filteredData)

    let countryList = d3.groups(filteredData, d=>d.country).map(d=>d[0])
    // console.log(countryList)
    countryScale.domain(countryList).range([0, 2*Math.PI - (  (2*Math.PI)/countryList.length  )])
    
    // backgroundLayer.selectAll(".countryCode").data(countryList).enter()
    //     .append("g")
    //         .attr("class", "countryCode")
    //         .attr("transform", d=>{
    //             // let a = countryScale(d);
    //             // let x = Math.cos(a)* (outerRadius+10)
    //             // let y = Math.sin(a)* (outerRadius+10)
    //             // return "translate("+x+", "+y+")"
    //             let a = countryScale(d) * 180/Math.PI;
    //             return "rotate("+(a+90)+")"
    //         })
    //     .append("g")
    //         .attr("transform", d=>{
    //             // let a = countryScale(d);
    //             let x = (outerRadius+10)
    //             let y = 0
    //             return "translate("+x+", "+y+")"
    //             // let a = country?Scale(d) * 180/Math.PI;
    //             // return "rotate("+(a+90)+")"
    //         })
    //     .append("text")
    //         .text(d=>d)
    //         .attr("fill", "white")
    //         .attr("text-anchor", "middle")
    //         .attr("x", 0)
    //         .attr("y", 6)
    //         .attr("transform", d=>{
    //             // let a = countryScale(d) * 180/Math.PI;
    //             return "rotate("+(90)+")"
    //         })
    // ;




    function mapFunction(d) {
        d.snapshot_date = dateParser(d.snapshot_date);
        return d;
    }
    let songDataDate = filteredData.map(mapFunction);

    // Group data by date, then by country within each date
    let groupedByDate = d3.groups(songDataDate, d => d.snapshot_date).reverse();

    console.log(groupedByDate)
    // Create slider with date indices
    const dateIndices = groupedByDate.map((d, idx) => ({
        date: d[0],
        index: idx
    }));


    

    // // Set up slider in HTML
    const slider = d3.select("#date-slider")
        .attr("min", 0)
        .attr("max", dateIndices.length - 1)
        .attr("value", 0)
        .on("input", function () {
            const index = +this.value;
            if (index >= 0 && index < groupedByDate.length) {
                const selectedData = groupedByDate[index][1];
                console.log("Selected data for index    " + index + ":", selectedData);
                visualizeData(selectedData);
            } else {
                console.error("Slider index out of bounds or invalid data:", index);
            }
        });

    // Initial visualization
    if (groupedByDate.length > 0) {
        visualizeData(groupedByDate[0][1])
        // updateVisualization(groupedByDate[0][1]); // visualize the first date initially
    }
}

// function updateVisualization(songData) {
//     console.log("Data for visualization:", songData);
//     if (!Array.isArray(songData)) {
//         console.error("Expected an array for visualization, received:", typeof songData);
//         return; // Prevents further execution
//     }
//     svg.selectAll("*").remove(); // Clear existing SVG contents
//     visualizeData(songData); // Draw the visualization with the new data
// }


// Assuming songData is your dataset enriched with a 'dateIndex' property
// which could be an integer representing each unique date in your dataset
// (e.g., 0 for the earliest date, 1 for the next, and so on)
d3.csv("./data.csv").then(data => {
    // Process and enrich data with 'dateIndex' here
    // Then call visualizeData with the initial subset of the data
    gotData(data); // Assuming this function processes data and then calls visualizeData
});
