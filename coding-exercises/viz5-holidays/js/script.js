import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

let w = 900;
let h = 650;

let vizContainer = d3.select("#viz5")
let viz = vizContainer
  .append("svg")
  .attr("class", "viz")
  // .attr("width", w)
  // .attr("height", h)
  // .style("background-color", "lavender")
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", "0 0 " + w + " " + h)
  ;

// append months
let months = viz.selectAll("text.month")
  .data(["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"])
  .enter()
  .append("text")
  .attr("class", "month")
  .text(d => d)
  .attr("x", (d, i) => i * 67 + 92)
  .attr("y", 15)
  .attr("fill", "white")
  .attr("font-size", 18)
  .attr("font-weight", 550)
  .attr("text-anchor", "end")
  .attr("transform", "translate(20, 0)")


function gotData(incomingDatasets) {
  console.log("holidays", incomingDatasets)
  let christmas = incomingDatasets[0]
  let eid = incomingDatasets[1]
  let christmasData = christmas.chart.seriesData[1].data.map(d=>{
    d.season = "xmas";
    return d
  });
  let eidData = eid.chart.seriesData[1].data.map(d=>{
    d[2] = "eid";
    return d
  });
  console.log(christmasData);
  console.log(eidData);
  let groupedByDay = d3.groups(christmasData.concat(eidData), d=>d[0])
  console.log(groupedByDay)


  // format time
  function mapFunction(d, i) {
    let time = new Date(d[0]);
    let value = d[1];
    return { time: time, value: value };
  }

  let mappedDataChristmas = christmasData.map(mapFunction).map(d=>{
    d.occasion = "christmas"
    return d
  });;
  console.log(mappedDataChristmas);
  let mappedDataEid = eidData.map(mapFunction).map(d=>{
    d.occasion = "ramadan"
    return d
  });
  console.log(mappedDataEid)


  // get years
  const christmasGroup = d3.groups(mappedDataChristmas, d => d.time.getFullYear()).slice(1);
  const eidGroup = d3.groups(mappedDataEid, d => d.time.getFullYear()).slice(1);

  console.log("original groups")
  console.log(christmasGroup)
  console.log(eidGroup)
  let years = []
  console.log(christmasGroup[0][1])
  for (let i=0; i<christmasGroup.length; i++) {
    let curYear = christmasGroup[i][0]
    let data1 = christmasGroup[i][1]
    let data2 = eidGroup[i][1]
    // let element = [curYear, [data1, data2]]
    let bothHolidays = d3.groups(data1.concat(data2), d=>d.time).map(d=>d[1])
    let element = [curYear, bothHolidays]
    years.push(element)
  }
  console.log(years);

  // get min and max values
  let minChristmas = d3.min(mappedDataChristmas, function (d) {
    return d.value;
  });
  let maxChristmas = d3.max(mappedDataChristmas, function (d) {
    return d.value;
  });
  let minEid = d3.min(mappedDataEid, function(d) {
    return d.value;
  })
  let maxEid = d3.max(mappedDataEid, function(d) {
    return d.value
  })

  // helper functions
  const cellSize = 15
  const yearHeight = cellSize * 7 + 25
  const formatDay = d => ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"][d.getUTCDay()]
  const countDay = d => d.getUTCDay()
  const timeWeek = d3.utcSunday
  const year = viz.selectAll('g')
    .data(years)
    .join('g')
    .attr('transform', (d, i) => `translate(40, ${yearHeight * i + cellSize * 1.5})`);

  // append year
  year.append('text')
    .attr('x', -5)
    .attr('y', 0)
    .attr("text-anchor", "end")
    .attr('font-size', 16)
    .attr('font-weight', 550)
    .attr('transform', 'rotate(270)')
    .attr("fill", "white")
    .text(d => d[0]);

  // append day of week
  year.append('g')
    .attr('text-anchor', 'end')
    .selectAll('text')
    .data(d3.range(7).map(i => new Date(1999, 0, i)))
    .join('text')
    .attr('x', 25)
    .attr('y', d => (countDay(d) + 0.5) * cellSize)
    .attr('dy', '0.31em')
    .text(formatDay)
    .attr("fill", "white");

  const colorFn = d3.scaleLinear().domain([0, 40732182, 40732182, maxChristmas]).range(["white", "white", "cyan", "cyan"])
  const colorFnEid = d3.scaleLinear().domain([0, 85000, 85000 , maxEid]).range(["white", "white", "magenta", "magenta"])
  
  const opacityScaleChristmas = d3.scaleLinear().domain([40732182, maxChristmas]).range([0.5, 1])
  const opacityScaleEid = d3.scaleLinear().domain([85000, maxEid]).range([0.5, 1])

  // append rects
  year.append('g')
    .selectAll('rect')
    .data(d => d[1])
    .join('rect')
    .attr("width", cellSize - 1.5)
    .attr("height", cellSize - 1.5)
    .attr("x", d => timeWeek.count(d3.utcYear(d[0].time), d[0].time) * cellSize + 30)
    .attr("y", d => countDay(d[0].time) * cellSize + 0.5)
    .attr("fill", d => {
      // console.log(d)
      if (d[0].value > 40732182) {
        return colorFn(d[0].value)
      } else if (d[1].value > 85000) {
        return colorFnEid(d[1].value)
      } else {
        return "white"
      }
    })
    .attr("opacity", d => {
      if (d[0].value > 40732182) {
        return opacityScaleChristmas(d[0].value)
      } else if (d[1].value > 85000) {
        return opacityScaleEid(d[1].value)
      } else {
        return 0.1
      }
    })
  
  // append boxes for the legend
  let legend = viz.append("g")
    .attr("class", "legend")
    .attr("transform", "translate(500, 550)")
    .selectAll("g")
    .data(["cyan", "magenta"])
    .enter()
    .append("g")
    .attr("transform", (d, i) => `translate(0, ${i * 20})`);

  legend.append("rect")
    .attr("width", 20)
    .attr("height", 20)
    .attr("fill", d => d);
  
  legend.append("text")
    .attr("x", 30)
    .attr("y", 15)
    .attr("text-anchor", "start")
    .attr("fill", "white")
    .text(d => {
      if (d == "cyan") {
        return "All I Want For Christmas Is You"
      } else {
        return "Ya Leilat El Eid Spotify"
      }
    })

}


Promise.all([
  d3.json("../viz5-holidays/data/Mariah-Carey-All-I-Want-for-Christmas-Is-You-Spotify.json"),
  d3.json("../viz5-holidays/data/Umm-Kulthum-Ya-Leilet-El-Eid-Spotify.json")
]).then(gotData);
