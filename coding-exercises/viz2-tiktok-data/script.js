import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

// keys: "spotify_id","name","artists","daily_rank","daily_movement","weekly_movement","country","snapshot_date","popularity","is_explicit","duration_ms","album_name","album_release_date","danceability","energy","key","loudness","mode","speechiness","acousticness","instrumentalness","liveness","valence","tempo","time_signature"

//data from https://towardsdatascience.com/how-to-build-animated-charts-like-hans-rosling-doing-it-all-in-r-570efc6ba382

let w = 1200;
let h = 800;
let xPadding = 50;
let yPadding = 50;

let viz = d3.select("#container")
  .append("svg")
  .attr("width", w)
  .attr("height", h)
  .style("background-color", "lavender")
  ;

// idea: aggregate popularity of each song on tiktok on each day
let tiktokSongs = new Set([
  "6tNQ70jh4OwmPGpYy6R2o9",
  "3rUGC1vUpkDG9CZFHMur1t",
  "4xhsWYTOGcal8zt0J161CU",
  "5mjYQaktjmjcMKcUIcqz4s",
  "3vkCueOmm7xQDoJ17W1Pm3",
  "1BxfuPKGuaTgP7aM0Bbdwr",
  "2IGMVunIBsBLtEQyoI1Mu7",
  "3w0w2T288dec0mgeZZqoNN",
  "7x9aauaA9cu6tyfpHnqDLo",
  "17phhZDn6oGtzMe56NuWvj",
  "4tKGFmENO69tZR9ahgZu48",
  "4zqTuI0Qq7NkCSRsewyw59",
  "3qhlB30KknSejmIvZZLjOD",
  "7gaA3wERFkFkgivjwbSvkG",
  "3U5JVgI2x4rDyHGObzJfNf",
  "52eIcoLUM25zbQupAZYoFh",
  "69phA1R4gmQsBFRQ3INW8C",
  "6Ec2OByuXokwfYDS9c7jaa",
  "3hRV0jL3vUpRrcy398teAU",
  "0mflMxspEfB0VbI1kyLiAv",
  "5aIVCx5tnk0ntmdiinnYvw",
  "3h5TiWTqGxjSjFrbruPFH9",
  "4Bdpn1gSDegE9ZXOIOO0tz",
  "2HafqoJbgXdtjwCOvNEF14",
  "2KslE17cAJNHTsI2MI0jb2",
  "4OMJGnvZfDvsePyCwRGO7X",
  "2KjyiFu9poaajxBkPSmoa4",
  "59NraMJsLaMCVtwXTSia8i",
  "3h7xA3ooMcxO6QDesmOcQ1",
  "7CyPwkp0oE8Ro9Dd5CUDjW",
  "6uTPdRrEDeH8Fyg5L5qmeU",
  "2ixkFv1Qi9veYUaUDLiv3c",
  "7ABLbnD53cQK00mhcaOUVG",
  "4KULAymBBJcPRpk1yO4dOG",
  "1Iq8oo9XkmmvCQiGOfORiz",
  "6yv0ZjBlZy2oRFq7jAis2C",
  "4WQzxNp9T2aVgog7rsFD2Y",
  "5XeFesFbtLpXzIVDNQP22n",
  "1dGr1c8CrMLDpV6mPbImSI",
  "4rXLjWdF2ZZpXCVTfWcshS",
  "4W4fNrZYkobj539TOWsLO2",
  "2Zo1PcszsT9WQ0ANntJbID",
  "2aAf5cXsRSt365wgIccQO8",
  "319hAHOd0cjZFKAJ2oTKqu",
  "0WtM2NBVQNNJLh6scP13H8",
  "01qFKNWq73UfEslI0GvumE",
  "0iB5f04XdJ2tcfhoVkeLV8",
  "5Gj9GytUHWNH3yN8r4Jn0r",
  "0DEYWFC64ieZoaGQAFhOg5",
  "1JgknGBbrfmEHeOZH051SS",
  "2FDTHlrBguDzQkp7PVj16Q",
  "3HL9QFQqlyRBGr1X4OFQZi",
  "73RbfOTJIjHzi2pcVHjeHM",
  "4E63weMCaNZuGPEFMnuEi8",
  "2gP5GqHZS7urc931Vt8d70",
  "2dHHgzDwk4BJdRwy9uXhTO",
  "7tPpg1JSgoXoAUZRqspbQg",
  "4uUG5RXrOk84mYEfVj3cK",
  "6vQEOP9KgXITsVpFnKSbZ3",
  "31nfdEooLEq7dn3UMcIeB5",
  "2kfrIIZDcZJo3z1TxdAZis",
  "5ZduaRci3iNUiDfJbBfAaf",
  "5xfPSgVIzYYZfsr6lBPkMR",
  "1udwFobQ1JoOdWPQrp2b6u",
  "2ksyzVfU0WJoBpu8otr4pz",
  "5r9aVTAfQ2csU5vSUBeYRp",
  "4LRPiXqCikLlN15c3yImP7",
  "3O9BABRNcGdotELKd5Mh4S",
  "1vYXt7VSjH9JIM5oRRo7vA",
  "0SqNPxlUEkfrKrOLBYRBla",
  "1odExI7RdWc4BT515LTAwj",
  "54ipXppHLA8U4yqpOFTUhr",
  "3GfU9Dw6NsBmtrev0Rzh1e",
  "3k79jB4aGmMDUQzEwa46Rz",
  "3VuxmTkJ3D9ZjqyVrRxWlE",
  "7KA4W4McWYRpgf0fWsJZWB",
  "0yLdNVWF3Srea0uzk55zFn",
  "1S50gMh9nRTkOyV6KqkKPF",
  "3CWq0pAKKTWb0K4yiglDc4",
  "58RLEZv3QmzdFmz3p5tuNO",
  "7FbrGaHYVDmfr7KoLIZnQ7",
  "0qz837PyeAHmgpbN7cpexG",
  "23RoR84KodL5HWvUTneQ1w",
  "3Dzso9Q2WwupEclqgxBZht",
  "6GDJDe3I7yHq4rPDTfuJMj",
  "52CTlUPosFjUvXUAadKOVV",
  "6qyS9qBy0mEk3qYaH8mPss",
  "741UUVE2kuITl0c6zuqqbO",
  "3Tv3LmCXZAlmYAv4hf4A0m",
  "02MWAaffLxlfxAUY7c5dvx",
  "1xK59OXxi2TAAAbmZK0kBL",
  "76OGwb5RA9h4FxQPT33ekc",
  "53jnnqFSRGMDB9ADrNriCA",
  "0qquvyPVoiZ9Q9XgKkCBa6",
  "2QjOHCTQ1Jl3zawyYOpxh6",
  "1u8c2t2Cy7UBoG4ArRcF5g",
  "1Qrg8KqiBpW07V7PNxwwwL",
  "3sy0GshTtIcovnmWxsXBqN",
  "3F5CgOj3wFlRv51JsHbxhe",
  "5JdLUE9D743ob2RtgmVpVx",
  "26b3oVLrRUaaybJulow9kz",
  "73vIOb4Q7YN6HeJTbscRx5",
  "4E63weMCaNZuGPEFMnuEi8",
  "2gP5GqHZS7urc931Vt8d70",
  "3k79jB4aGmMDUQzEwa46Rz",
  "3VuxmTkJ3D9ZjqyVrRxWlE",
  "7KA4W4McWYRpgf0fWsJZWB",
  "0yLdNVWF3Srea0uzk55zFn",
  "1S50gMh9nRTkOyV6KqkKPF",
  "3CWq0pAKKTWb0K4yiglDc4",
  "58RLEZv3QmzdFmz3p5tuNO",
  "7FbrGaHYVDmfr7KoLIZnQ7",
  "0qz837PyeAHmgpbN7cpexG",
  "23RoR84KodL5HWvUTneQ1w",
  "3Dzso9Q2WwupEclqgxBZht",
  "6GDJDe3I7yHq4rPDTfuJMj",
  "52CTlUPosFjUvXUAadKOVV",
  "6qyS9qBy0mEk3qYaH8mPss",
  "741UUVE2kuITl0c6zuqqbO",
  "3Tv3LmCXZAlmYAv4hf4A0m",
  "02MWAaffLxlfxAUY7c5dvx",
  "1xK59OXxi2TAAAbmZK0kBL",
  "76OGwb5RA9h4FxQPT33ekc",
  "53jnnqFSRGMDB9ADrNriCA",
  "0qquvyPVoiZ9Q9XgKkCBa6",
  "2QjOHCTQ1Jl3zawyYOpxh6",
  "1u8c2t2Cy7UBoG4ArRcF5g",
  "1Qrg8KqiBpW07V7PNxwwwL",
  "3sy0GshTtIcovnmWxsXBqN",
  "3F5CgOj3wFlRv51JsHbxhe",
  "5JdLUE9D743ob2RtgmVpVx",
  "26b3oVLrRUaaybJulow9kz",
  "73vIOb4Q7YN6HeJTbscRx5",
  "4E63weMCaNZuGPEFMnuEi8",
  "2gP5GqHZS7urc931Vt8d70",
  "3k79jB4aGmMDUQzEwa46Rz",
  "3VuxmTkJ3D9ZjqyVrRxWlE",
  "7KA4W4McWYRpgf0fWsJZWB",
  "0yLdNVWF3Srea0uzk55zFn",
  "1S50gMh9nRTkOyV6KqkKPF",
  "3CWq0pAKKTWb0K4yiglDc4",
  "58RLEZv3QmzdFmz3p5tuNO",
  "7FbrGaHYVDmfr7KoLIZnQ7",
  "0qz837PyeAHmgpbN7cpexG",
  "23RoR84KodL5HWvUTneQ1w",
  "3Dzso9Q2WwupEclqgxBZht",
  "6GDJDe3I7yHq4rPDTfuJMj",
  "52CTlUPosFjUvXUAadKOVV",
  "6qyS9qBy0mEk3qYaH8mPss",
  "741UUVE2kuITl0c6zuqqbO",
  "3Tv3LmCXZAlmYAv4hf4A0m",
  "02MWAaffLxlfxAUY7c5dvx",
  "1xK59OXxi2TAAAbmZK0kBL",
  "76OGwb5RA9h4FxQPT33ekc",
  "53jnnqFSRGMDB9ADrNriCA",
  "0qquvyPVoiZ9Q9XgKkCBa6",
  "2QjOHCTQ1Jl3zawyYOpxh6",
  "1u8c2t2Cy7UBoG4ArRcF5g",
  "1Qrg8KqiBpW07V7PNxwwwL",
  "3sy0GshTtIcovnmWxsXBqN",
  "3F5CgOj3wFlRv51JsHbxhe",
  "5JdLUE9D743ob2RtgmVpVx",
  "26b3oVLrRUaaybJulow9kz",
  "73vIOb4Q7YN6HeJTbscRx5",
  "4E63weMCaNZuGPEFMnuEi8",
  "2gP5GqHZS7urc931Vt8d70",
  "3k79jB4aGmMDUQzEwa46Rz",
  "3VuxmTkJ3D9ZjqyVrRxWlE",
  "7KA4W4McWYRpgf0fWsJZWB",
  "0yLdNVWF3Srea0uzk55zFn",
  "1S50gMh9nRTkOyV6KqkKPF",
  "3CWq0pAKKTWb0K4yiglDc4",
  "58RLEZv3QmzdFmz3p5tuNO",
  "7FbrGaHYVDmfr7KoLIZnQ7",
  "0qz837PyeAHmgpbN7cpexG",
  "23RoR84KodL5HWvUTneQ1w",
  "3Dzso9Q2WwupEclqgxBZht",
  "6GDJDe3I7yHq4rPDTfuJMj",
  "52CTlUPosFjUvXUAadKOVV",
  "6qyS9qBy0mEk3qYaH8mPss",
  "741UUVE2kuITl0c6zuqqbO",
  "3Tv3LmCXZAlmYAv4hf4A0m",
  "02MWAaffLxlfxAUY7c5dvx",
  "1xK59OXxi2TAAAbmZK0kBL",
  "76OGwb5RA9h4FxQPT33ekc",
  "53jnnqFSRGMDB9ADrNriCA",
  "0qquvyPVoiZ9Q9XgKkCBa6",
  "2QjOHCTQ1Jl3zawyYOpxh6",
  "1u8c2t2Cy7UBoG4ArRcF5g",
  "1Qrg8KqiBpW07V7PNxwwwL",
  "3sy0GshTtIcovnmWxsXBqN",
  "3F5CgOj3wFlRv51JsHbxhe",
  "5JdLUE9D743ob2RtgmVpVx",
  "26b3oVLrRUaaybJulow9kz",
  "73vIOb4Q7YN6HeJTbscRx5",
  "4E63weMCaNZuGPEFMnuEi8",
  "2gP5GqHZS7urc931Vt8d70",
  "3k79jB4aGmMDUQzEwa46Rz",
  "3VuxmTkJ3D9ZjqyVrRxWlE",
  "7KA4W4McWYRpgf0fWsJZWB",
  "0yLdNVWF3Srea0uzk55zFn",
  "1S50gMh9nRTkOyV6KqkKPF",
  "3CWq0pAKKTWb0K4yiglDc4",
  "58RLEZv3QmzdFmz3p5tuNO",
  "7FbrGaHYVDmfr7KoLIZnQ7",
  "0qz837PyeAHmgpbN7cpexG",
  "23RoR84KodL5HWvUTneQ1w",
  "3Dzso9Q2WwupEclqgxBZht",
  "6GDJDe3I7yHq4rPDTfuJMj",
  "52CTlUPosFjUvXUAadKOVV",
  "6qyS9qBy0mEk3qYaH8mPss",
  "741UUVE2kuITl0c6zuqqbO",
  "3Tv3LmCXZAlmYAv4hf4A0m"
]);

function gotData(incomingData) {

  let filteredData = incomingData.filter(d => {
    return tiktokSongs.has(d.spotify_id);
  });

  // console.log(filteredData)

  let filteredDataWithRank = filteredData.filter(d => parseInt(d.daily_rank) <= 50);

  console.log(filteredDataWithRank);
  // date formatting
  let timeParser = d3.timeParse("%Y-%m-%d");
  let formatDate = d3.timeFormat("%B %d, %Y");

  function mapFunction(d) {
    d.snapshot_date = timeParser(d.snapshot_date);
    d.album_release_date = timeParser(d.album_release_date);
    return d;
  };

  let filteredDataWithTime = filteredDataWithRank.map(mapFunction);

  let filteredDataReleaseBefore2023 = filteredDataWithTime.filter(d => d.album_release_date < timeParser("2023-01-01"));

  // let reformatTime = filteredDataReleaseBefore2023.map(d => {
  //   d.snapshot_date = reformatDate(d.snapshot_date);
  //   d.album_release_date = reformatDate(d.album_release_date);
  //   return d;
  // });

  // console.log(reformatTime);

  // determine number of countries per song
  let countryCount = filteredDataReleaseBefore2023.reduce(function (acc, d, i) {
    if (acc[d.spotify_id]) {
      acc[d.spotify_id].add(d.country);
    } else {
      acc[d.spotify_id] = new Set([d.country]);
    }
    return acc;
  }, {});

  console.log("countryCount", countryCount);

  // make the xscale which we use to locate points along the xaxis
  // let snapshotExtent = d3.extent(filteredDataWithTime, d => d.snapshot_date);
  // let xScale = d3.scaleTime().domain(snapshotExtent).range([xPadding, xPadding+w])

  // make the yscale which we use to locate points along the yaxis
  let xScale = d3.scaleLinear().domain([50, 0]).range([xPadding, w - xPadding]);

  // determine size of circle depending on how many times show up on day
  function getCircleSize(d, i) {
    return countryCount[d.spotify_id].size;
  }
  let sizeExtent = d3.extent(filteredDataReleaseBefore2023, getCircleSize);
  // console.log(sizeExtent)
  let sizeScale = d3.scaleLinear().domain(sizeExtent).range([5, 50]);
  let yScale = d3.scaleLinear().domain(sizeExtent).range([h - yPadding, yPadding]);

  // using the function defined at the bottom of this script to build two axis
  buildXAndYAxis(xScale, yScale);


  // the simple output of this complicated bit of code,
  // is an array of all the years the data talks about.
  // the "dates" array looks like:
  // ["1962", "1963", "1964", "1965", ... , "2012", "2013", "2014", "2015"]
  let dates = filteredDataReleaseBefore2023.reduce(function (acc, d, i) {
    if (!acc.includes(formatDate(d.snapshot_date))) {
      acc.push(formatDate(d.snapshot_date))
    }
    return acc.reverse();
  }, [])

  // console.log("dates", dates);

  // this block of code is needed to select a subsection of the data (by year)
  let currentDateIndex = 0;
  let currentDate = dates[currentDateIndex];
  function filterDate(d, i) {
    if (formatDate(d.snapshot_date) === currentDate) {
      return true;
    } else {
      return false;
    }
  }

  // make a group for all things visualization:
  let vizGroup = viz.append("g").attr("class", "vizGroup");


  // this function is called every second.
  // inside it is a data variable that always carries the "latest" data of a new year
  // inside it we want to draw shapes and deal wirth both updating and entering element.
  function drawViz() {

    let currentDateData = filteredDataReleaseBefore2023.filter(filterDate);
  
    let colorScale = d3.scaleLinear().domain(sizeExtent).range(["white", "black"]);
    // console.log("currentDateData", currentDateData)
    // console.log("---\nthe currentDateData array now carries the data for year", currentDate);


    // Below here is where your coding should take place! learn from lab 6:
    // https://github.com/leoneckert/critical-data-and-visualization-spring-2020/tree/master/labs/lab-6
    // the three steps in the comments below help you to know what to aim for here

    // bind currentYearData to elements
    let uniqueData = [];
    let map = new Set();
    for (let item of currentDateData) {
      if (!map.has(item.name)) {
        map.add(item.name);
        uniqueData.push(item);
      }
    }

    let datagroups = vizGroup.selectAll(".datagroup").data(uniqueData, d => d.spotify_id);

    // console.log("datagroups", datagroups);

    function getLocation(d, i) {
      return "translate(" + xScale(d.daily_rank) + ", " + yScale(countryCount[d.spotify_id].size) + ")";
    }

    // take care of entering elements
    function getEnteringPosition(d, i) {
      let x = xScale(d.daily_rank);
      let y = h;
      return "translate(" + x + "," + y + ")";
    }

    let enteringGroups = datagroups.enter()
      .append("g")
      .attr("class", "datagroup")
      ;

    enteringGroups
      .append("circle")
      .attr("class", "songCircle")
      .attr("r", d => sizeScale(countryCount[d.spotify_id].size))
      .attr("fill", d => colorScale(countryCount[d.spotify_id].size))
      ;

    enteringGroups
      .append("text")
      .text(d => d.name)
      .attr("x", d => sizeScale(countryCount[d.spotify_id].size) + 10)
      .attr("y", 5)
      .attr("font-family", "sans-serif")
      .attr("font-size", "1em")
      .attr("fill", "black")
      ;

    // enteringGroups
    //   .append("text")
    //     .text(d => d.country)
    //     .attr("x", 10)
    //     .attr("y", 20)
    //     .attr("font-family", "sans-serif")
    //     .attr("font-size", "1em")
    //     .attr("fill", "white")
    // ;

    enteringGroups
      .attr("transform", getEnteringPosition)
      .transition()
      .attr("transform", getLocation)
      ;


    // take care of updating elements
    datagroups
      .transition()
      .delay(100)
      .ease(d3.easeLinear)
      .attr("transform", getLocation)
      .attr("r", d => sizeScale(countryCount[d.spotify_id].size))
      .attr("fill", d => colorScale(countryCount[d.spotify_id].size))
      ;

    // take care of exiting elements
    let exitingGroups = datagroups.exit();
    exitingGroups.remove();

  }


  // this puts the YEAR onto the visualization
  let year = viz.append("text")
    .text("")
    .attr("x", 100)
    .attr("y", h - 100)
    .attr("font-family", "sans-serif")
    .attr("font-size", "2.7em")

    ;

  // this called the drawViz function every second
  // and changes the year of interest
  // and updates the text element that displays the year.
  setInterval(function () {
    currentDateIndex++;
    if (currentDateIndex > dates.length) {
      currentDateIndex = 0;
    }
    currentDate = dates[currentDateIndex];
    year.text(currentDate)
    drawViz();
  }, 1000);


}


// load data
d3.csv("tiktokData.csv").then(gotData);


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
