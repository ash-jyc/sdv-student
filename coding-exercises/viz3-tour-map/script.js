import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

// keys: "spotify_id","name","artists","daily_rank","daily_movement","weekly_movement","country","snapshot_date","popularity","is_explicit","duration_ms","album_name","album_release_date","danceability","energy","key","loudness","mode","speechiness","acousticness","instrumentalness","liveness","valence","tempo","time_signature"

let w = 900;
let h = 500;
let xPadding = 50;
let yPadding = 50;

let vizContainer = d3.select("#viz3")

let viz = vizContainer.append("svg")
    .attr("preserveAspectRatio", "xMinYmin meet")
    .attr("viewBox", "0 0 " + w + " " + h)
    ;


// load data

// 1 - draw the map
// 2 - group by song
// 3 - pick one of the songs and color it

// let spotifyCountries = [
//     "AE", "AR", "AT", "AU", "BE", "BG", "BO", "BR", "BY", "CA", "CH", "CL", "CO", "CR", "CZ", "DE", "DK", "DO", "EC", "EE", "EG", "ES", "FI", "FR", "GB", "GR", "GT", "HK", "HN", "HU", "ID", "IE", "IL", "IN", "IS", "IT", "JP", "KR", "KZ", "LT", "LU", "LV", "MA", "MX", "MY", "NG", "NI", "NL", "NO", "NZ", "PA", "PE", "PH", "PK", "PL", "PT", "PY", "RO", "SA", "SE", "SG", "SK", "SV", "TH", "TR", "TW", "UA", "US", "UY", "VE", "VN", "ZA"
// ];

let tourDetails = [
    { "date": "2023-11-06", "country": "JP", "city": "Tokyo", "lat": 35.6895, "lng": 139.6917 },
    { "date": "2023-11-07", "country": "JP", "city": "Tokyo", "lat": 35.6895, "lng": 139.6917 },
    { "date": "2023-11-11", "country": "TW", "city": "Kaohsiung", "lat": 22.6273, "lng": 120.3014 },
    { "date": "2023-11-12", "country": "TW", "city": "Kaohsiung", "lat": 22.6273, "lng": 120.3014 },
    { "date": "2023-11-15", "country": "ID", "city": "Jakarta", "lat": -6.2088, "lng": 106.8456 },
    { "date": "2023-11-18", "country": "AU", "city": "Perth", "lat": -31.9505, "lng": 115.8605 },
    { "date": "2023-11-19", "country": "AU", "city": "Perth", "lat": -31.9505, "lng": 115.8605 },
    { "date": "2023-11-22", "country": "MY", "city": "Kuala Lumpur", "lat": 3.1390, "lng": 101.6869 },
    { "date": "2024-01-19", "country": "PH", "city": "Manila", "lat": 14.5995, "lng": 120.9842 },
    { "date": "2024-01-20", "country": "PH", "city": "Manila", "lat": 14.5995, "lng": 120.9842 },
    { "date": "2024-01-23", "country": "SG", "city": "Kallang", "lat": 1.3114, "lng": 103.8822 },
    { "date": "2024-01-24", "country": "SG", "city": "Kallang", "lat": 1.3114, "lng": 103.8822 },
    { "date": "2024-01-25", "country": "SG", "city": "Kallang", "lat": 1.3114, "lng": 103.8822 },
    { "date": "2024-01-26", "country": "SG", "city": "Kallang", "lat": 1.3114, "lng": 103.8822 },
    { "date": "2024-01-27", "country": "SG", "city": "Kallang", "lat": 1.3114, "lng": 103.8822 },
    { "date": "2024-02-03", "country": "TH", "city": "Bangkok", "lat": 13.7563, "lng": 100.5018 },
    { "date": "2024-02-04", "country": "TH", "city": "Bangkok", "lat": 13.7563, "lng": 100.5018 },
]

d3.json("../viz3-tour-map/custom.geo.json").then(function (geoData) {
    d3.csv("../datasets/coldplayOnly.csv").then(function (incomingData) {
        // console.log("geoData", geoData);

        // filter Coldplay data
        let tourData = incomingData.filter(d => {
            let songArtists = d.artists.split(",")
            if (songArtists.includes("Coldplay")) {
                d.artists = "Coldplay";
                return true;
            }
        })

        console.log("coldplay data")
        console.log(tourData)

        // fix time
        let timeParser = d3.timeParse("%Y-%m-%d")
        let timeFormatter = d3.timeFormat("%Y-%m-%d")

        function mapFunction(d) {
            d.snapshot_date = timeParser(d.snapshot_date);
            d.album_release_date = timeParser(d.album_release_date);
            return d;
        }

        // filter dates in dataset
        let dataTourDates = tourData.filter(d => d.album_release_date !== "N/A");
        tourDetails = tourDetails.map(d => {
            d.date = timeParser(d.date);
            return d;
        });

        console.log("tours with dates")
        console.log(tourDetails)
        console.log(dataTourDates)

        let startTourDate = timeParser("2023-11-06");
        let endTourDate = timeParser("2024-02-05");
        console.log(startTourDate, endTourDate)

        let filteredDataWithTime = dataTourDates.map(mapFunction);

        let groupedData = d3.group(filteredDataWithTime, d => d.snapshot_date);
        // check that date is in tour
        console.log("groupedData")
        console.log(groupedData)

        // draw map
        let projection = d3.geoMercator()
            .center([100, 0])
            .scale(250)
            .translate([w / 2, h / 2]);

        let pathMaker = d3.geoPath(projection);
        viz.selectAll(".country").data(geoData.features).enter()
            .append("path")
            .attr("class", "country")
            .attr("d", pathMaker)
            .attr("opacity", 0.2)
            .attr("stroke", "white")

        let coldplaySymbol = viz.append("image")
            .attr("xlink:href", "../images/coldplay-symbol.png")
            .attr("width", 50)
            .attr("height", 50);        
            
        let christmasTree = viz.append("image")
            .attr("xlink:href", "../images/christmas-tree.png")
            .attr("x", 10)  // Top left corner
            .attr("y", 10)
            .attr("width", 100)
            .attr("height", 100)

        function updateMapForDate(tourDate, tourDetails) {
            let month = tourDate.getMonth();
            let formattedDate = d3.timeFormat("%B %d, %Y")(tourDate);

            // Display Christmas tree in December
            christmasTree.attr("visibility", month === 11 ? "visible" : "hidden");

            // Update Coldplay symbol location
            let tour = tourDetails.find(d => +d.date === +tourDate);
            if (tour) {
                let [x, y] = projection([tour.lng, tour.lat]);
                coldplaySymbol
                    .attr("x", x - 25) // Center the symbol over the point
                    .attr("y", y - 25)
                    .attr("visibility", "visible");
            }

            // Update country colors based on current tour location
            svg.selectAll(".country")
                .attr("fill", d => d.properties.postal === tour.country ? "cyan" : "gray")
                .attr("opacity", d => d.properties.postal === tour.country ? 1 : 0.2);
        }

        function updateMapForDate(tourDate) {
            let currentData = groupedData.get(tourDate);
            console.log("currentData", currentData)
            // make current tour country a different color
            let activeCountryCodes = currentData.map(d => d.country);
            console.log("activeCountryCodes", activeCountryCodes)

            viz.selectAll(".country")
                .attr("fill", function (d, i) {
                    if (activeCountryCodes.includes(d.properties.postal) && (tourDetails.find(tour => timeFormatter(tour.date) === timeFormatter(tourDate) && tour.country === d.properties.postal))) {
                        return "rgb(156, 136, 235)"
                    } else if (activeCountryCodes.includes(d.properties.postal)) {
                        return "cyan"
                    } else if (tourDetails.find(tour => timeFormatter(tour.date) === timeFormatter(tourDate) && tour.country === d.properties.postal)) {
                        return "magenta"
                    } else {
                        return "gray"
                    }
                })
                .attr("opacity", function (d, i) {
                    if (activeCountryCodes.includes(d.properties.postal) || (tourDetails.find(tour => timeFormatter(tour.date) === timeFormatter(tourDate) && tour.country === d.properties.postal))) {
                        console.log("colored")
                        return 1
                    } else {
                        return 0.2
                    }
                })

            // drop a pin for the city of the tour date
            let tourCity = tourDetails.find(d => timeFormatter(d.date) === timeFormatter(tourDate));
            viz.selectAll(".tour-city").remove();
            viz.selectAll(".tour-date").remove();

            console.log("tourCity", tourCity)
            if (tourCity) {
                console.log("tourCity", tourCity)
                viz.append("circle")
                    .attr("class", "tour-city")
                    .attr("cx", projection([tourCity.lng, tourCity.lat])[0])
                    .attr("cy", projection([tourCity.lng, tourCity.lat])[1])
                    .attr("r", 10)
                    .attr("fill", "red")
                // .attr("opacity", 0.5)

                viz.append("text")
                    .attr("class", "tour-city")
                    .attr("x", projection([tourCity.lng, tourCity.lat])[0])
                    .attr("y", projection([tourCity.lng, tourCity.lat])[1])
                    .text(tourCity.city)
                    .attr("font-size", 10)
                    .attr("font-family", "sans-serif")
                    .attr("text-anchor", "middle")
                    .attr("alignment-baseline", "middle")
                    .attr("fill", "white")
                // .attr("opacity", 0.2)
            }
            // append date
            viz.append("text")
                .attr("class", "tour-date")
                .attr("x", w - xPadding)
                .attr("y", 50)
                .text(timeFormatter(currentData[0].snapshot_date))
                .attr("font-size", 20)
                .attr("font-family", "sans-serif")
                .attr("text-anchor", "end")
                .attr("alignment-baseline", "middle")
                .attr("fill", "white")
                
        }

        // let sortedTourDates = Array.from(new Set(tourDetails.map(d => d.date))).sort((a, b) => a - b);
        console.log(groupedData)
        let sortedTourDates = Array.from(new Set(groupedData.keys())).sort((a, b) => a - b);
        console.log("sortedTourDates", sortedTourDates)
        // start from start tour date
        let i = sortedTourDates.findIndex(d => timeFormatter(d) === timeFormatter(startTourDate))
        console.log(i, sortedTourDates[i])
        // end at end tour date
        let j = sortedTourDates.findIndex(d => timeFormatter(d) === timeFormatter(endTourDate));
        console.log(j, sortedTourDates[j])
        sortedTourDates = sortedTourDates.slice(i, j);
        // console.log("sortedTourDates", sortedTourDates)
        function animateTours() {
            let i = 0;
            let interval = d3.interval(function () {
                if (i >= sortedTourDates.length) interval.stop();
                // check if in groupedData
                // if (groupedData.has(timeFormatter(sortedTourDates[i]))) {
                updateMapForDate(sortedTourDates[i]);
                // }
                i++;
            }, 1000); // Update every second
        }

        animateTours();

    })
});
