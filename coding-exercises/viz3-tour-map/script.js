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

let artists = ["Coldplay"] // , "Olivia Rodrigo", "Beyonce", "Mitski", "Travis Scott", "Doja Cat", "Justin Timberlake", "Bad Bunny", "Adele", "J. Cole", "Nicki Minaj", "P!NK"]
let colors = ["red"] //, "blue", "green", "purple", "orange", "yellow", "pink", "brown", "black", "magenta", "cyan", "white"]
let spotifyCountries = [
    "AE", "AR", "AT", "AU", "BE", "BG", "BO", "BR", "BY", "CA", "CH", "CL", "CO", "CR", "CZ", "DE", "DK", "DO", "EC", "EE", "EG", "ES", "FI", "FR", "GB", "GR", "GT", "HK", "HN", "HU", "ID", "IE", "IL", "IN", "IS", "IT", "JP", "KR", "KZ", "LT", "LU", "LV", "MA", "MX", "MY", "NG", "NI", "NL", "NO", "NZ", "PA", "PE", "PH", "PK", "PL", "PT", "PY", "RO", "SA", "SE", "SG", "SK", "SV", "TH", "TR", "TW", "UA", "US", "UY", "VE", "VN", "ZA"
];
let tourDetails = [
    { "date": "2023-09-27", "country": "US" },
    { "date": "2023-09-28", "country": "US" },
    { "date": "2023-11-11", "country": "TW" },
    { "date": "2023-11-12", "country": "TW" },
    { "date": "2023-11-15", "country": "ID" },
    { "date": "2023-11-18", "country": "AU" },
    { "date": "2023-11-19", "country": "AU" },
    { "date": "2023-11-22", "country": "MY" },
    { "date": "2024-01-19", "country": "PH" },
    { "date": "2024-01-20", "country": "PH" },
    { "date": "2024-01-23", "country": "SG" },
    { "date": "2024-01-27", "country": "SG" },
    { "date": "2024-01-23", "country": "SG" },
    { "date": "2024-01-24", "country": "SG" },
    { "date": "2024-01-25", "country": "SG" },
    { "date": "2024-01-26", "country": "SG" },
    { "date": "2024-01-27", "country": "SG" },
    { "date": "2024-01-23", "country": "SG" },
    { "date": "2024-01-24", "country": "SG" },
    { "date": "2024-01-25", "country": "SG" },
    { "date": "2024-01-26", "country": "SG" },
    { "date": "2024-01-27", "country": "SG" },
    { "date": "2024-02-03", "country": "TH" },
    { "date": "2024-02-04", "country": "TH" },
]
d3.json("custom.geo.json").then(function (geoData) {
    d3.csv("../universal_top_spotify_songs.csv").then(function (incomingData) {
        console.log("geoData", geoData);

        let tourData = incomingData.filter(d => {
            let songArtists = d.artists.split(",")
            // for (let i = 0; i < artists.length; i++) {
            if (songArtists.includes("Coldplay")) {
                d.artists = "Coldplay";
                return true;
            }
            // }
            // return false;
        })

        let timeParser = d3.timeParse("%Y-%m-%d")

        function mapFunction(d) {
            d.snapshot_date = timeParser(d.snapshot_date);
            d.album_release_date = timeParser(d.album_release_date);
            return d;
        }

        // filter dates in dataset
        let dataTourDates = tourData.filter(d => {
            let tourDates = tourDetails.map(e => e.date)
            return tourDates.includes(d.snapshot_date)
        })

        console.log(dataTourDates)

        let filteredDataWithTime = dataTourDates.map(mapFunction);
        filteredDataWithTime = filteredDataWithTime.filter(d =>
            d.album_release_date < timeParser("2020-01-01")
        );

        let groupedData = d3.groups(filteredDataWithTime, function (d) {
            return d.artists;
        })

        // make a list of countries artist toured at
        // let artistsTourCountries = groupedData.map(d => {
        //     let countries = d[1].map(e => e.country)
        //     return { artist: d[0], countries: countries }
        // });

        // console.log(artistsTourCountries)

        // // color countries based on artist
        // let countryColor = {}
        // artistsTourCountries.forEach(d => {
        //     d.countries.forEach(e => {
        //         countryColor[e] = d.artist
        //     })
        // })

        // let artistToColor = {}
        // for (let i = 0; i < artists.length; i++) {
        //     artistToColor[artists[i]] = colors[i]
        // }

        // console.log(countryColor)
        // console.log(artistToColor)

        // draw map
        let projection = d3.geoEqualEarth();

        let pathMaker = d3.geoPath(projection);
        viz.selectAll(".country").data(geoData.features).enter()
            .append("path")
            .attr("class", "country")
            .attr("d", pathMaker)
            .attr("fill", /*function (d, i) {
                // console.log(d.properties.iso_a2)
                let country = d.properties.iso_a2
                // console.log(country, countryColor[country], artistToColor[countryColor[country]])
                if (countryColor[country]) {
                    console.log(country, countryColor[country], artistToColor[countryColor[country]])
                    return artistToColor[countryColor[country]]
                } else {
                    return "gray"
                }
            })*/ "gray")
            .attr("opacity", function (d, i) {
                if (spotifyCountries.includes(d.properties.iso_a2)) {
                    return 1
                } else {
                    return 0.2
                }
            })
            .attr("stroke", "white")
        
        function updateMapForDate(tourDate) {
            let activeCountries = tourDetails.filter(d => d.date === tourDate);
            let activeCountryCodes = activeCountries.map(d => d.country);
            
            viz.selectAll(".country")
                .transition()
                .duration(200)
                .attr("fill", d => activeCountryCodes.includes(d.properties.iso_a2) ? "red" : "lightgray");
        }

        let sortedTourDates = Array.from(new Set(tourDetails.map(d => d.date))).sort();

        function animateTours() {
            let i = 0;
            let interval = d3.interval(function() {
                if (i >= sortedTourDates.length) interval.stop();
                updateMapForDate(sortedTourDates[i]);
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
