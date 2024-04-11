import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const width = 900, height = 900;
const outerRadius = Math.min(450, 450) / 2 - 20; // Adjusted for visibility
const innerRadius = 10; // Inner circle where visualization starts

// Create SVG container
const svg = d3.select("#container").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background-color", "lavender")
    .append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`);

function visualizeData(songData) {
    // Derive countries to create a scale for angles
    const countries = Array.from(new Set(songData.map(d => d.country)));
    const angleScale = d3.scalePoint()
        .domain(countries)
        .range([0, 2 * Math.PI]);

    const maxRank = d3.max(songData, d => parseInt(d.daily_rank));
    const radialScale = d3.scaleLinear()
        .domain([0, maxRank]) // Starts from 0 to include a line for the top rank
        .range([innerRadius, outerRadius]);

    // Draw rank guide circles
    const rankLevels = 5; // Adjustable based on your needs
    const ranksPerLevel = maxRank / rankLevels;

    for (let i = 0; i <= rankLevels; i++) {
        svg.append("circle")
            .attr("cx", 0)
            .attr("cy", 0)
            .attr("r", radialScale(i * ranksPerLevel))
            .style("fill", "none")
            .style("stroke", "lightgray")
            .style("stroke-dasharray", "2,2");
    }

    const colorMap = { "Unwritten": "blue", "Murder On The Dancefloor": "red" };

    // Draw dumbbells
    countries.forEach(country => {
        const countryData = songData.filter(d => d.country === country);

        if (countryData.length === 2) { // Ensuring data for both songs is present
            const points = countryData.map(d => ({
                x: Math.cos(angleScale(d.country) - Math.PI / 2) * radialScale(d.daily_rank),
                y: Math.sin(angleScale(d.country) - Math.PI / 2) * radialScale(d.daily_rank),
                color: colorMap[d.name]
            }));

            // Draw line (dumbbell connector)
            svg.append("line")
                .attr("x1", points[0].x)
                .attr("y1", points[0].y)
                .attr("x2", points[1].x)
                .attr("y2", points[1].y)
                .attr("stroke", "grey")
                .attr("stroke-width", 1);

            // Draw points
            points.forEach(point => {
                svg.append("circle")
                    .attr("cx", point.x)
                    .attr("cy", point.y)
                    .attr("r", 5)
                    .attr("fill", point.color);
            });
        }
    });


    // Add country labels
    countries.forEach(country => {
        const angle = angleScale(country) - Math.PI / 2; // Adjusting by 90 degrees
        const labelRadius = outerRadius + 20; // Positioning labels outside the outermost circle
        const x = Math.cos(angle) * labelRadius;
        const y = Math.sin(angle) * labelRadius;

        // Determine the rotation direction for readability
        let rotation;
        if (angle > Math.PI / 2 && angle < 3 * Math.PI / 2) {
        // Left side
        rotation = (angle + Math.PI) * (180 / Math.PI);
        } else {
        // Right side
        rotation = angle * (180 / Math.PI);
        }

        svg.append("text")
            .attr("x", x)
            .attr("y", y)
            .attr("transform", `rotate(${rotation}, ${x}, ${y})`)
            .text(country)
            .style("text-anchor", "middle")
            .attr("alignment-baseline", "middle");
    });
}

// Sample invocation with your processedData
// visualizeData(processedData);



function gotData(incomingData) {
    let filteredData = incomingData.filter(d =>
        d.name === "Unwritten" || d.name === "Murder On The Dancefloor");

    // Aggregate or process your data here, for example, to find the most recent rank for each country
    let dateParser = d3.timeParse("%Y-%m-%d");
    function mapFunction(d) {
        d.snapshot_date = dateParser(d.snapshot_date);
        return d;
    }
    let songDataDate = filteredData.map(mapFunction);

    let dateData = d3.groups(songDataDate, d => d.snapshot_date)[0][1];
    console.log(dateData);
    // Assuming 'processedData' is your prepared dataset after processing

    visualizeData(dateData);
}

// Load your data then call drawVisualization(data);
d3.csv("data.csv").then(gotData);