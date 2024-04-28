import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

// keys: "spotify_id","name","artists","daily_rank","daily_movement","weekly_movement","country","snapshot_date","popularity","is_explicit","duration_ms","album_name","album_release_date","danceability","energy","key","loudness","mode","speechiness","acousticness","instrumentalness","liveness","valence","tempo","time_signature"

//data from https://towardsdatascience.com/how-to-build-animated-charts-like-hans-rosling-doing-it-all-in-r-570efc6ba382

let w = 1000;
let h = 700;
let xPadding = 50;
let yPadding = 50;

let viz = d3.select("#container")
    .append("svg")
    .attr("width", w)
    .attr("height", h)
    .style("background-color", "lavender")
    ;


// load data

// 1 - draw the map
// 2 - group by song
// 3 - pick one of the songs and color it

// think about changing opacity of countries that do not have access to spotify / never show up in the dataset
// think abt transition from big earth to small earth to show more specific countries
// mosaic of album in a country??
// labelling countries because i don't know my geography

// let artists = ["Coldplay"] // , "Olivia Rodrigo", "Beyonce", "Mitski", "Travis Scott", "Doja Cat", "Justin Timberlake", "Bad Bunny", "Adele", "J. Cole", "Nicki Minaj", "P!NK"]
// let colors = ["red"] //, "blue", "green", "purple", "orange", "yellow", "pink", "brown", "black", "magenta", "cyan", "white"]
let spotifyCountries = [
    "AE", "AR", "AT", "AU", "BE", "BG", "BO", "BR", "BY", "CA", "CH", "CL", "CO", "CR", "CZ", "DE", "DK", "DO", "EC", "EE", "EG", "ES", "FI", "FR", "GB", "GR", "GT", "HK", "HN", "HU", "ID", "IE", "IL", "IN", "IS", "IT", "JP", "KR", "KZ", "LT", "LU", "LV", "MA", "MX", "MY", "NG", "NI", "NL", "NO", "NZ", "PA", "PE", "PH", "PK", "PL", "PT", "PY", "RO", "SA", "SE", "SG", "SK", "SV", "TH", "TR", "TW", "UA", "US", "UY", "VE", "VN", "ZA"
];

let tourDetails = [
    { "date": "2023-09-27", "country": "US", "city": "Los Angeles", "lat": 34.0522, "lng": -118.2437 },
    { "date": "2023-09-28", "country": "US", "city": "Los Angeles", "lat": 34.0522, "lng": -118.2437 },
    { "date": "2023-11-11", "country": "TW", "city": "Kaohsiung", "lat": 22.6273, "lng": 120.3014 },
    { "date": "2023-11-12", "country": "TW", "city": "Kaohsiung", "lat": 22.6273, "lng": 120.3014},
    { "date": "2023-11-15", "country": "ID", "city": "Jakarta", "lat": -6.2088, "lng": 106.8456 },
    { "date": "2023-11-18", "country": "AU", "city": "Perth", "lat": -31.9505, "lng": 115.8605 },
    { "date": "2023-11-19", "country": "AU", "city": "Perth", "lat": -31.9505, "lng": 115.8605 },
    { "date": "2023-11-22", "country": "MY", "city": "Kuala Lumpur", "lat": 3.1390, "lng": 101.6869 },
    { "date": "2024-01-19", "country": "PH", "city": "Manila", "lat": 14.5995, "lng": 120.9842 },
    { "date": "2024-01-20", "country": "PH", "city": "Manila", "lat": 14.5995, "lng": 120.9842 },
    { "date": "2024-01-23", "country": "SG", "city": "Kallang", "lat": 1.3114, "lng": 103.8822},
    { "date": "2024-01-24", "country": "SG", "city": "Kallang", "lat": 1.3114, "lng": 103.8822 },
    { "date": "2024-01-25", "country": "SG", "city": "Kallang", "lat": 1.3114, "lng": 103.8822 },
    { "date": "2024-01-26", "country": "SG", "city": "Kallang", "lat": 1.3114, "lng": 103.8822},
    { "date": "2024-01-27", "country": "SG", "city": "Kallang", "lat": 1.3114, "lng": 103.8822 },
    { "date": "2024-02-03", "country": "TH", "city": "Bangkok", "lat": 13.7563, "lng": 100.5018},
    { "date": "2024-02-04", "country": "TH", "city": "Bangkok", "lat": 13.7563, "lng": 100.5018},
]
d3.json("custom.geo.json").then(function (geoData) {
    d3.csv("./coldplay-data.csv").then(function (incomingData) {
        console.log("geoData", geoData);

        let tourData = incomingData.filter(d => {
            let songArtists = d.artists.split(",")
            if (songArtists.includes("Coldplay")) {
                d.artists = "Coldplay";
                return true;
            }
        })

        console.log("coldplay data")
        console.log(tourData)

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

        let filteredDataWithTime = dataTourDates.map(mapFunction);
        filteredDataWithTime = filteredDataWithTime.filter(d =>
            d.album_release_date < timeParser("2020-01-01")
        );

        let groupedData = d3.group(dataTourDates, d => timeFormatter(d.snapshot_date));
        // check that date is in tour
        console.log("groupedData")
        console.log(groupedData)

        // draw map
        let projection = d3.geoMercator()
            .center([130, -15])
            .scale(425)
            .translate([w / 2, h / 2]); 

        let pathMaker = d3.geoPath(projection);
        viz.selectAll(".country").data(geoData.features).enter()
            .append("path")
            .attr("class", "country")
            .attr("d", pathMaker)
            .attr("fill", "gray")
            .attr("opacity", function (d, i) {
                if (spotifyCountries.includes(d.properties.iso_a2)) {
                    return 1
                } else {
                    return 0.2
                }
            })
            .attr("stroke", "white")
        
        function updateMapForDate(tourDate) {
            let currentData = groupedData.get(timeFormatter(tourDate));
            console.log("currentData", currentData)
            // make current tour country a different color
            let activeCountryCodes = currentData.map(d => d.country);
            console.log("activeCountryCodes", activeCountryCodes)

            viz.selectAll(".country")
                .attr("fill", function (d, i) {
                    if (tourDetails.find(t => t.date === tourDate).country === d.properties.iso_a2){
                        return "pink"
                    } else if (activeCountryCodes.includes(d.properties.iso_a2)) {
                        return "blue"
                    } else {
                        return "gray"
                    }
                })
                .attr("opacity", function (d, i) {
                    if (activeCountryCodes.includes(d.properties.iso_a2)) {
                        return 1
                    } else {
                        return 0.2
                    }
                })

            
            // drop a pin for the city of the tour date
            let tourCity = tourDetails.find(d => d.date === tourDate);
            viz.selectAll(".tour-city").remove();
            viz.append("circle")
                .attr("class", "tour-city")
                .attr("cx", projection([tourCity.lng, tourCity.lat])[0])
                .attr("cy", projection([tourCity.lng, tourCity.lat])[1])
                .attr("r", 5)
                .attr("fill", "red")
                .attr("opacity", 0.5)
            
            viz.append("text")
                .attr("class", "tour-city")
                .attr("x", projection([tourCity.lng, tourCity.lat])[0])
                .attr("y", projection([tourCity.lng, tourCity.lat])[1])
                .text(tourCity.city)
                .attr("font-size", 10)
                .attr("font-family", "sans-serif")
                .attr("text-anchor", "middle")
                .attr("alignment-baseline", "middle")
                .attr("fill", "black")
                .attr("opacity", 0.2)
            
            // append date
            viz.selectAll(".tour-date").remove();
            viz.append("text")
                .attr("class", "tour-date")
                .attr("x", w - xPadding)
                .attr("y", h - yPadding)
                .text(timeFormatter(tourDate))
                .attr("font-size", 20)
                .attr("font-family", "sans-serif")
                .attr("text-anchor", "end")
                .attr("alignment-baseline", "middle")
                .attr("fill", "black")
                .attr("opacity", 0.2)
        }

        let sortedTourDates = Array.from(new Set(tourDetails.map(d => d.date))).sort((a, b) => a - b);
        console.log("sortedTourDates", sortedTourDates)
        function animateTours() {
            let i = 0;
            let interval = d3.interval(function() {
                if (i >= sortedTourDates.length) interval.stop();
                // check if in groupedData
                if (groupedData.has(timeFormatter(sortedTourDates[i]))) {
                    updateMapForDate(sortedTourDates[i]);
                }
                i++;
            }, 1000); // Update every second
        }

        animateTours();

    })
});


// function to build x anc y axis.
// the only reasons these are down here is to make the code above look less polluted

function buildXAndYAxis(xScale, yScale) {
    let xAxisGroup = viz.append("g").attr("class", 'xaxis');
    let xAxis = d3.axisBottom(xScale);
    xAxisGroup.call(xAxis)
    xAxisGroup.attr("transform", "translate(0, " + (h - yPadding) + ")")
    xAxisGroup.append("g").attr('class', 'xLabel')
        .attr("transform", "translate(" + w / 2 + ", 40)")
        .append("text")
        .attr("fill", "black")
        .text("Rank")
        .attr("font-family", "sans-serif")
        .attr("font-size", "1.7em")

        ;

    let yAxisGroup = viz.append("g").attr("class", 'yaxis');
    let yAxis = d3.axisLeft(yScale);
    yAxisGroup.call(yAxis)
    yAxisGroup.attr("transform", "translate(" + xPadding + ", 0)")

    yAxisGroup.append("g").attr('class', 'xLabel')
        .attr("transform", "translate(-33, " + h / 2 + ") rotate(-90)")
        .append("text")
        .attr("fill", "black")
        .text("Number of Countries")
        .attr("font-family", "sans-serif")
        .attr("font-size", "1.7em")

        ;
}
