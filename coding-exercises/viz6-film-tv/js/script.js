import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const width = 600, height = 600;
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
    const countries = Array.from(new Set(songData.map(d => d.country).filter(country => country != "")));
    console.log(countries)
    const angleScale = d3.scalePoint()
        .domain(countries)
        .range([0, 2 * Math.PI - (2 * Math.PI / countries.length)]);

    const maxRank = 50; // d3.max(songData, d => parseInt(d.daily_rank));
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

        if (countryData.length < 2) {
            const points = countryData.map(d => ({
                x: Math.cos(angleScale(d.country) - Math.PI / 2) * radialScale(d.daily_rank),
                y: Math.sin(angleScale(d.country) - Math.PI / 2) * radialScale(d.daily_rank),
                color: colorMap[d.name]
            }));
            points.forEach(point => {
                svg.append("circle")
                    .attr("cx", point.x)
                    .attr("cy", point.y)
                    .attr("r", 5)
                    .attr("fill", point.color);
            });
        }
        else { //(countryData.length === 2) { // Ensuring data for both songs is present
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

    // add date label
    let dateFormat = d3.timeFormat("%B %-d, %Y")

    svg.append("text")
        .attr("x", 0)
        .attr("y", -outerRadius - 60)
        .text(dateFormat(songData[0].snapshot_date))
        .style("text-anchor", "middle")
        .attr("alignment-baseline", "middle");

    // add song labels
    svg.append("text")
        .attr("x", -250)
        .attr("y", outerRadius + 40)
        .text("Unwritten")
        .attr("fill", "blue")

    svg.append("text")
        .attr("x", -250)
        .attr("y", outerRadius + 25)
        .text("Murder On The Dancefloor")
        .attr("fill", "red")

}

// Sample invocation with your processedData
// visualizeData(processedData);



function gotData(incomingData) {
    let filteredData = incomingData.filter(d =>
        d.name === "Unwritten" || d.name === "Murder On The Dancefloor");

    let dateParser = d3.timeParse("%Y-%m-%d");
    function mapFunction(d) {
        d.snapshot_date = dateParser(d.snapshot_date);
        return d;
    }
    let songDataDate = filteredData.map(mapFunction);

    // Group data by date, then by country within each date
    let groupedByDate = d3.groups(songDataDate, d => d.snapshot_date).reverse();

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
                console.log("Selected data for index " + index + ":", selectedData);
                updateVisualization(selectedData);
            } else {
                console.error("Slider index out of bounds or invalid data:", index);
            }
        });

    // Initial visualization
    if (groupedByDate.length > 0) {
        updateVisualization(groupedByDate[0][1]); // visualize the first date initially
    }
}

function updateVisualization(songData) {
    console.log("Data for visualization:", songData);
    if (!Array.isArray(songData)) {
        console.error("Expected an array for visualization, received:", typeof songData);
        return; // Prevents further execution
    }
    svg.selectAll("*").remove(); // Clear existing SVG contents
    visualizeData(songData); // Draw the visualization with the new data
}


// Assuming songData is your dataset enriched with a 'dateIndex' property
// which could be an integer representing each unique date in your dataset
// (e.g., 0 for the earliest date, 1 for the next, and so on)
d3.csv("data.csv").then(data => {
    // Process and enrich data with 'dateIndex' here
    // Then call visualizeData with the initial subset of the data
    gotData(data); // Assuming this function processes data and then calls visualizeData
});
