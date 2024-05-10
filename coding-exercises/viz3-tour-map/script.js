import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

// keys: "spotify_id","name","artists","daily_rank","daily_movement","weekly_movement","country","snapshot_date","popularity","is_explicit","duration_ms","album_name","album_release_date","danceability","energy","key","loudness","mode","speechiness","acousticness","instrumentalness","liveness","valence","tempo","time_signature"

let w = 500;
let h = 500;
let xPadding = 50;
let yPadding = 50;

let vizContainer = d3.select("#viz3");

let msPerDay = 1000;

let viz = vizContainer.append("svg")
    // .attr("background-color", "black")
    .attr("preserveAspectRatio", "xMinYmin meet")
    .attr("viewBox", "0 0 " + w + " " + h)
    ;

let mapLayer = viz.append("g").attr("class", "map");
let tourLayer = viz.append("g").attr("class", "tour");
let legendLayer = viz.append("g").attr("class", "legend");

let dateText = viz.append("text")
    .attr("class", "tour-date")
    .attr("x", w - xPadding)
    .attr("y", 50)
    .text("2023-11-06")
    .attr("font-size", 20)
    .attr("font-family", "sans-serif")
    .attr("text-anchor", "end")
    .attr("alignment-baseline", "middle")
    .attr("fill", "white")

let legendData = [
    {
        "color" : "rgb(156, 136, 235)",
        "title" : "Touring and Trending"
    },
    {
        "color" : "magenta",
        "title" : "Touring Only"
    },
    {
        "color" : "cyan",
        "title" : "Trending Only"
    }
]

let legendGroup = legendLayer.selectAll(".legend").data(legendData).enter();

legendGroup
    .append("rect")
    .attr("class", "legendRect")
    .attr("width", 25)
    .attr("height", 12)
    .attr("fill", d => d.color)
    .attr("x", 100)
    .attr("y", (d, i) => 400 + (12*i))

legendGroup
    .append("text")
    .attr("class", "legendLabel")
    .text(d => d.title)
    .attr("fill", "white")
    .attr("x", 130)
    .attr("y", (d, i) => 412 + (12*i))
    .attr("font-size", "12px")

// fix time
let timeParser = d3.timeParse("%Y-%m-%d")
let timeFormatter = d3.timeFormat("%Y-%m-%d")

let tourDetails = [
    { "date": "2023-11-06", "country": "J", "city": "Tokyo", "lat": 35.6895, "lng": 139.6917 },
    { "date": "2023-11-07", "country": "J", "city": "Tokyo", "lat": 35.6895, "lng": 139.6917 },
    { "date": "2023-11-11", "country": "TW", "city": "Kaohsiung", "lat": 22.6273, "lng": 120.3014 },
    { "date": "2023-11-12", "country": "TW", "city": "Kaohsiung", "lat": 22.6273, "lng": 120.3014 },
    { "date": "2023-11-15", "country": "INDO", "city": "Jakarta", "lat": -6.2088, "lng": 106.8456 },
    { "date": "2023-11-18", "country": "AU", "city": "Perth", "lat": -31.9505, "lng": 115.8605 },
    { "date": "2023-11-19", "country": "AU", "city": "Perth", "lat": -31.9505, "lng": 115.8605 },
    { "date": "2023-11-22", "country": "MY", "city": "Kuala Lumpur", "lat": 3.1390, "lng": 101.6869 },
    // manually add 2 points to homebase
    { "date": "2023-11-25", "country": "Homebase", "city": "Homebase", "lat": 51.5074, "lng": 0.1278 },
    { "date": "2024-01-15", "country": "Homebase", "city": "Homebase", "lat": 51.5074, "lng": 0.1278 },
    // leave home
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

tourDetails = tourDetails.map(d => {
    d.date = timeParser(d.date);
    return d;

})

for (let i = 0; i < tourDetails.length; i++) {
    let idxNext = i + 1;
    if (i == tourDetails.length - 1) {
        idxNext = 0;
    }
    let date1 = tourDetails[i].date;
    let date2 = tourDetails[idxNext].date;
    let diffTime = Math.abs(date2 - date1);
    let diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (i == tourDetails.length - 1) {
        diffDays = 1;
    }
    tourDetails[i].nextLng = tourDetails[idxNext].lng;
    tourDetails[i].nextLat = tourDetails[idxNext].lat;
    tourDetails[i].daysOfTravel = diffDays;
}


// console.log(tourDetails)  

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


        function mapFunction(d) {
            d.snapshot_date = timeParser(d.snapshot_date);
            d.album_release_date = timeParser(d.album_release_date);
            return d;
        }

        // filter dates in dataset
        let dataTourDates = tourData.filter(d => d.album_release_date !== "N/A");
        // console.log("tours with dates")
        // console.log(tourDetails)
        // console.log(dataTourDates)

        let startTourDate = timeParser("2023-11-06");
        let endTourDate = timeParser("2024-02-05");
        console.log(startTourDate, endTourDate)

        let filteredDataWithTime = dataTourDates.map(mapFunction);

        let groupedData = d3.group(filteredDataWithTime, d => d.snapshot_date);
        // check that date is in tour
        // console.log("groupedData")
        // console.log(groupedData)

        // draw map
        let projection = d3.geoMercator()
            .center([120, 0])
            .scale(200)
            .translate([w / 2, h / 2]);

        let pathMaker = d3.geoPath(projection);
        mapLayer.selectAll(".country").data(geoData.features).enter()
            .append("path")
            .attr("class", "country")
            .attr("d", pathMaker)
            .attr("opacity", 1)
            .attr("stroke", "rgb(255, 150, 206)")

        let christmasTreeGroup = tourLayer.append("g")
        let christmasTree = christmasTreeGroup.append("image")
            .attr("xlink:href", "../images/christmas-tree.png")
            .attr("x", 10)  // Top left corner
            .attr("y", 10)
            .attr("width", 150)
            .attr("height", 150)
            .attr("visibility", "hidden");

        function updateMapForDate(tourDate) {

            let currentData = groupedData.get(tourDate);
            // console.log("currentData", currentData)
            // make current tour country a different color
            let activeCountryCodes = currentData.map(d => d.country);
            // console.log("activeCountryCodes", activeCountryCodes)

            // console.log("an active country", activeCountryCodes.includes("d.properties.postal"))
            // console.log("find tour", tourDetails.find(tour => timeFormatter(tour.date)))
            // console.log("this should be magenta", tourDetails.find(tour => timeFormatter(tour.date) === timeFormatter(tourDate) && tour.country === "JP"))

            mapLayer.selectAll(".country")
                .attr("fill", function (d, i) {
                    // console.log(d)
                    if (activeCountryCodes.includes(d.properties.postal) && (tourDetails.find(tour => timeFormatter(tour.date) === timeFormatter(tourDate) && tour.country === d.properties.postal))) {
                        return "rgb(156, 136, 235)"
                    } else if (activeCountryCodes.includes(d.properties.postal)) {
                        return "cyan"
                    } else if (tourDetails.find(tour => timeFormatter(tour.date) === timeFormatter(tourDate) && tour.country === d.properties.postal)) {
                        return "magenta"
                    }
                })
                .attr("opacity", function (d, i) {
                    if (activeCountryCodes.includes(d.properties.postal) || (tourDetails.find(tour => timeFormatter(tour.date) === timeFormatter(tourDate) && tour.country === d.properties.postal))) {
                        console.log("colored")
                        return 1
                    } else {
                        return 1
                    }
                })
            
            let tourCity = tourDetails.find(d => timeFormatter(d.date) === timeFormatter(tourDate));
            if (tourCity) {
                console.log("tourCity", tourCity)

                if (tourCity.city === "Homebase") {
                    christmasTree.attr("visibility", "show")
                } else {
                    christmasTree.attr("visibility", "hidden")
                }

                let datagroup = tourLayer.selectAll(".coldplay").data([tourCity])
                let enterGroup = datagroup.enter().append("g");

                enterGroup.attr("class", "coldplay")
                    .attr("transform", function (d, i) {
                        // console.log("translate(" + projection([d.lng, d.lat]) + ")")
                        return "translate(" + projection([d.lng, d.lat]) + ")";
                    })
                    .transition().duration(d => {
                        return d.daysOfTravel * msPerDay;
                    })
                    .attr("transform", function (d, i) {
                        // console.log("translate(" + projection([d.lng, d.lat]) + ")")
                        return "translate(" + projection([d.nextLng, d.nextLat]) + ")";
                    })
                    ;

                enterGroup.append("svg:image")
                    .attr("xlink:href", "../images/coldplay-symbol.png")
                    .attr("width", 30)
                    .attr("height", 30)
                    .attr("x", 0)
                    .attr("y", 0)

                enterGroup.append("text")
                    .attr("class", "tour-city-label")
                    .attr("x", 0)
                    .attr("y", 40)
                    .attr("fill", "light blue")
                    .attr("font-size", "12px")
                    .text(d => d.city)

                //update:
                datagroup.selectAll(".tour-city-label").remove()
                if (tourCity.city !== "Homebase")
                    datagroup.append("text")
                        .attr("class", "tour-city-label")
                        .attr("x", 0)
                        .attr("y", 40)
                        .attr("fill", "white")
                        .attr("font-size", "12px")
                        .text(d => d.city)
                

                datagroup.transition().duration(d => {
                    return d.daysOfTravel * msPerDay;
                })
                    .attr("transform", function (d, i) {
                        // console.log("translate(" + projection([d.lng, d.lat]) + ")")
                        return "translate(" + projection([d.nextLng, d.nextLat]) + ")";
                    });

                // datagroup.selectAll(".tour-city-label")
                // .text(d => d.city)
            }
            dateText.text(timeFormatter(currentData[0].snapshot_date))
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
                if (i >= sortedTourDates.length) {
                    i = 0
                };
                // check if in groupedData
                updateMapForDate(sortedTourDates[i]);
                // }
                i++;
                // interval.stop();
            }, msPerDay); // Update every second
        }

        animateTours();

    })
});
