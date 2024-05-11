import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const width = 1000, height = 500;
const outerRadius = Math.min(450, 450) / 2 - 20; // Adjusted for visibility
const innerRadius = 30; // Inner circle where visualization starts
const colorMap = { "Unwritten": "cyan", "Murder On The Dancefloor": "magenta" };
let countries = {
    "AE": "UAE",
    "AR": "Argentina",
    "AT": "Austria",
    "AU": "Australia",
    "BE": "Belgium",
    "BG": "Bulgaria",
    "BO": "Bolivia",
    "BR": "Brazil",
    "BY": "Belarus",
    "CA": "Canada",
    "CH": "Switzerland",
    "CL": "Chile",
    "CO": "Colombia",
    "CR": "Costa Rica",
    "CZ": "Czechia",
    "DE": "Germany",
    "DK": "Denmark",
    "DO": "Dominican Republic",
    "EC": "Ecuador",
    "EE": "Estonia",
    "EG": "Egypt",
    "ES": "Spain",
    "FI": "Finland",
    "FR": "France",
    "GB": "UK",
    "GR": "Greece",
    "GT": "Guatemala",
    "HK": "Hong Kong",
    "HN": "Honduras",
    "HU": "Hungary",
    "ID": "Indonesia",
    "IE": "Ireland",
    "IL": "Israel",
    "IN": "India",
    "IS": "Iceland",
    "IT": "Italy",
    "JP": "Japan",
    "KR": "South Korea",
    "KZ": "Kazakhstan",
    "LT": "Lithuania",
    "LU": "Luxembourg",
    "LV": "Latvia",
    "MA": "Morocco",
    "MX": "Mexico",
    "MY": "Malaysia",
    "NG": "Nigeria",
    "NI": "Nicaragua",
    "NL": "Netherlands",
    "NO": "Norway",
    "NZ": "New Zealand",
    "PA": "Panama",
    "PE": "Peru",
    "PH": "Philippines",
    "PK": "Pakistan",
    "PL": "Poland",
    "PT": "Portugal",
    "PY": "Paraguay",
    "RO": "Romania",
    "SA": "Saudi Arabia",
    "SE": "Sweden",
    "SG": "Singapore",
    "SK": "Slovakia",
    "SV": "El Salvador",
    "TH": "Thailand",
    "TR": "Turkey",
    "TW": "Taiwan",
    "UA": "Ukraine",
    "US": "USA",
    "UY": "Uruguay",
    "VE": "Venezuela",
    "VN": "Vietnam",
    "ZA": "South Africa"
  }

// Create SVG container
let vizContainer = d3.select("#viz2")
let svg = vizContainer.append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .style("background-color", "black")
    // .append("g")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", `0 0 ${width} ${height}`)
let viz = svg.append("g").attr("transform", `translate(${width / 2}, ${height / 2})`)
;
let backgroundLayer = viz.append("g").attr("class", "background");
let dateFormat = d3.timeFormat("%B %-d, %Y")
let dateText = backgroundLayer.append("text")
    .attr("x", 0)
    .attr("y", -outerRadius - 35)
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


let graphLayer = viz.append("g").attr("class", "graph");

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
    // let r = width;
    // let a = countryScale(d.country);
    let x = 0//Math.cos(a)*r;
    let y = 0//-height/2-10;//Math.sin(a)*r;
    return "translate("+x+", "+y+")"
}
function getPosition(d){
    let r = radialScale(d.daily_rank);
    let a = countryScale(d.country);
    let x = Math.cos(a)*r;
    let y = Math.sin(a)*r;
    console.log("x", x, "y", y)
    return "translate("+x+", "+y+")"
}

function getLinePositionX(d) {
    let r = radialScale(d.daily_rank);
    let a = countryScale(d.country);
    let x = Math.cos(a)*r;
    return x;
}

function getLinePositionY(d) {
    let r = radialScale(d.daily_rank);
    let a = countryScale(d.country);
    let y = Math.sin(a)*r;
    return y;
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
    countryScale.domain(countryList).range([0, 2*Math.PI - ((2*Math.PI)/countryList.length)])

    let countryLabelGroups = backgroundLayer.selectAll(".countryCode").data(countryList, d=>d)
    
    // entering
    countryLabelGroups.enter()
        .append("g")
            .attr("class", "countryCode")
            .attr("transform", d=>{

                let a = countryScale(d) * 180/Math.PI;
                return "rotate("+(a)+")"
            })
        .append("g")
            .attr("transform", d => {
                // let a = countryScale(d);
                let x = (outerRadius+10)
                let y = 0
                return "translate("+x+", "+y+")"
                // let a = country?Scale(d) * 180/Math.PI;
                // return "rotate("+(a+90)+")"
            })
        .append("text")
            .text(d => d)
            .attr("fill", "white")
            .attr("text-anchor", "middle")
            .attr("x", 0)
            .attr("y", 6)
            .attr("transform", d=>{
                // let a = countryScale(d) * 180/Math.PI;
                return "rotate("+(90)+")"
            })
    ;

    // update
    countryLabelGroups.transition().attr("transform", d=>{
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

    // draw a line between the songs if both show up in the country
    let dataByCountry = d3.groups(songData, d => d.country);
    console.log("data by country", dataByCountry)

    // draw a line between the songs if both show up in the country
    let dataByCountryFiltered = dataByCountry.filter(d => d[1].length > 1);
    console.log("data by country filtered", dataByCountryFiltered)


    let linegroups = graphLayer.selectAll(".connection-line").data(dataByCountryFiltered);

    linegroups.enter()
        .append("line")
            .attr("class", "connection-line")
            .attr("x1", d => {
                return getLinePositionX(d[1][0])
            })
            .attr("y1", d => {
                return getLinePositionY(d[1][0])
            })
            .attr("x2", d => {
                return getLinePositionX(d[1][1])
            })
            .attr("y2", d => {
                return getLinePositionY(d[1][1])
            })
            .attr("stroke", "rgb(156, 136, 235)")
            .attr("stroke-width", 1)
            .lower()
    ;

    // update
    linegroups.transition()
        .attr("class", "connection-line")
        .attr("x1", d => {
            return getLinePositionX(d[1][0])
        })
        .attr("y1", d => {
            return getLinePositionY(d[1][0])
        })
        .attr("x2", d => {
            return getLinePositionX(d[1][1])
        })
        .attr("y2", d => {
            return getLinePositionY(d[1][1])
        })

    // exit
    linegroups.exit().transition()
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", 0)
        .attr("y2", 0)
    .remove();

    // graphLayer.selectAll(".connection-line").data(dataByCountry)
    //     .join("line")
    //     .attr("class", "connection-line")
    //     // draw a line from the first point for each country to the last point
    //     .attr("x1", d => {
    //         let first = d[1][0];
    //         return Math.cos(countryScale(first.country)) * radialScale(first.daily_rank);
    //     })
    //     .attr("y1", d => {
    //         let first = d[1][0];
    //         return Math.sin(countryScale(first.country)) * radialScale(first.daily_rank);
    //     })
    //     .attr("x2", d => {
    //         let last = d[1][d[1].length - 1];
    //         return Math.cos(countryScale(last.country)) * radialScale(last.daily_rank);
    //     })
    //     .attr("y2", d => {
    //         let last = d[1][d[1].length - 1];
    //         return Math.sin(countryScale(last.country)) * radialScale(last.daily_rank);
    //     })
    //     .attr("stroke", "rgb(156, 136, 235)")
    //     .attr("stroke-width", 1)

    const tooltip = d3.select("#tooltip");

    enteringGroup.append("circle")
        .attr("r", 5)
        .attr("fill", d => colorMap[d.name])
        .on("mouseover", (event, d) => {
            tooltip
                .style("display", "block")
                .html(`Song: ${d.name}<br>Country: ${countries[d.country]}<br>Rank: ${d.daily_rank}`)
                .style("left", `${event.pageX + 10}px`)
                .style("top", `${event.pageY + 10}px`);
        })
        .on("mousemove", (event) => {
            tooltip
                .style("left", `${event.pageX + 10}px`)
                .style("top", `${event.pageY + 10}px`);
        })
        .on("mouseout", () => {
            tooltip.style("display", "none");
        });

    // update
    datagroups.transition().attr("transform", getPosition);
    // exit
    datagroups.exit().transition().attr("transform", getPositionEnterExit).remove();

    countryScale.domain(countryList).range([0, 2*Math.PI - ((2*Math.PI)/countryList.length)]);

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
    countryScale.domain(countryList).range([0, 2*Math.PI - ((2*Math.PI)/countryList.length)])

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

    // Set up slider in HTML
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

d3.csv("../datasets/murderUnwrittenOnly.csv").then(data => {
    gotData(data); // Assuming this function processes data and then calls visualizeData
});
