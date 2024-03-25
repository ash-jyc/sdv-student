import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
// import * as d3 from "https://d3js.org/d3.v4.js";

let country_codes = [
  {"name": "Albania", "code": "AL"},
  {"name": "Åland Islands", "code": "AX"},
  {"name": "Algeria", "code": "DZ"},
  {"name": "American Samoa", "code": "AS"},
  {"name": "Andorra", "code": "AD"},
  {"name": "Angola", "code": "AO"},
  {"name": "Anguilla", "code": "AI"},
  {"name": "Antarctica", "code": "AQ"},
  {"name": "Antigua and Barbuda", "code": "AG"},
  {"name": "Argentina", "code": "AR"},
  {"name": "Armenia", "code": "AM"},
  {"name": "Aruba", "code": "AW"},
  {"name": "Australia", "code": "AU"},
  {"name": "Austria", "code": "AT"},
  {"name": "Azerbaijan", "code": "AZ"},
  {"name": "Bahamas (the)", "code": "BS"},
  {"name": "Bahrain", "code": "BH"},
  {"name": "Bangladesh", "code": "BD"},
  {"name": "Barbados", "code": "BB"},
  {"name": "Belarus", "code": "BY"},
  {"name": "Belgium", "code": "BE"},
  {"name": "Belize", "code": "BZ"},
  {"name": "Benin", "code": "BJ"},
  {"name": "Bermuda", "code": "BM"},
  {"name": "Bhutan", "code": "BT"},
  {"name": "Bolivia (Plurinational State of)", "code": "BO"},
  {"name": "Bonaire, Sint Eustatius and Saba", "code": "BQ"},
  {"name": "Bosnia and Herzegovina", "code": "BA"},
  {"name": "Botswana", "code": "BW"},
  {"name": "Bouvet Island", "code": "BV"},
  {"name": "Brazil", "code": "BR"},
  {"name": "British Indian Ocean Territory (the)", "code": "IO"},
  {"name": "Brunei Darussalam", "code": "BN"},
  {"name": "Bulgaria", "code": "BG"},
  {"name": "Burkina Faso", "code": "BF"},
  {"name": "Burundi", "code": "BI"},
  {"name": "Cabo Verde", "code": "CV"},
  {"name": "Cambodia", "code": "KH"},
  {"name": "Cameroon", "code": "CM"},
  {"name": "Canada", "code": "CA"},
  {"name": "Cayman Islands (the)", "code": "KY"},
  {"name": "Central African Republic (the)", "code": "CF"},
  {"name": "Chad", "code": "TD"},
  {"name": "Chile", "code": "CL"},
  {"name": "China", "code": "CN"},
  {"name": "Christmas Island", "code": "CX"},
  {"name": "Cocos (Keeling) Islands (the)", "code": "CC"},
  {"name": "Colombia", "code": "CO"},
  {"name": "Comoros (the)", "code": "KM"},
  {"name": "Congo (the Democratic Republic of the)", "code": "CD"},
  {"name": "Congo (the)", "code": "CG"},
  {"name": "Cook Islands (the)", "code": "CK"},
  {"name": "Costa Rica", "code": "CR"},
  {"name": "Croatia", "code": "HR"},
  {"name": "Cuba", "code": "CU"},
  {"name": "Curaçao", "code": "CW"},
  {"name": "Cyprus", "code": "CY"},
  {"name": "Czechia", "code": "CZ"},
  {"name": "Côte d'Ivoire", "code": "CI"},
  {"name": "Denmark", "code": "DK"},
  {"name": "Djibouti", "code": "DJ"},
  {"name": "Dominica", "code": "DM"},
  {"name": "Dominican Republic (the)", "code": "DO"},
  {"name": "Ecuador", "code": "EC"},
  {"name": "Egypt", "code": "EG"},
  {"name": "El Salvador", "code": "SV"},
  {"name": "Equatorial Guinea", "code": "GQ"},
  {"name": "Eritrea", "code": "ER"},
  {"name": "Estonia", "code": "EE"},
  {"name": "Eswatini", "code": "SZ"},
  {"name": "Ethiopia", "code": "ET"},
  {"name": "Falkland Islands (the) [Malvinas]", "code": "FK"},
  {"name": "Faroe Islands (the)", "code": "FO"},
  {"name": "Fiji", "code": "FJ"},
  {"name": "Finland", "code": "FI"},
  {"name": "France", "code": "FR"},
  {"name": "French Guiana", "code": "GF"},
  {"name": "French Polynesia", "code": "PF"},
  {"name": "French Southern Territories (the)", "code": "TF"},
  {"name": "Gabon", "code": "GA"},
  {"name": "Gambia (the)", "code": "GM"},
  {"name": "Georgia", "code": "GE"},
  {"name": "Germany", "code": "DE"},
  {"name": "Ghana", "code": "GH"},
  {"name": "Gibraltar", "code": "GI"},
  {"name": "Greece", "code": "GR"},
  {"name": "Greenland", "code": "GL"},
  {"name": "Grenada", "code": "GD"},
  {"name": "Guadeloupe", "code": "GP"},
  {"name": "Guam", "code": "GU"},
  {"name": "Guatemala", "code": "GT"},
  {"name": "Guernsey", "code": "GG"},
  {"name": "Guinea", "code": "GN"},
  {"name": "Guinea-Bissau", "code": "GW"},
  {"name": "Guyana", "code": "GY"},
  {"name": "Haiti", "code": "HT"},
  {"name": "Heard Island and McDonald Islands", "code": "HM"},
  {"name": "Holy See (the)", "code": "VA"},
  {"name": "Honduras", "code": "HN"},
  {"name": "Hong Kong", "code": "HK"},
  {"name": "Hungary", "code": "HU"},
  {"name": "Iceland", "code": "IS"},
  {"name": "India", "code": "IN"},
  {"name": "Indonesia", "code": "ID"},
  {"name": "Iran (Islamic Republic of)", "code": "IR"},
  {"name": "Iraq", "code": "IQ"},
  {"name": "Ireland", "code": "IE"},
  {"name": "Isle of Man", "code": "IM"},
  {"name": "Israel", "code": "IL"},
  {"name": "Italy", "code": "IT"},
  {"name": "Jamaica", "code": "JM"},
  {"name": "Japan", "code": "JP"},
  {"name": "Jersey", "code": "JE"},
  {"name": "Jordan", "code": "JO"},
  {"name": "Kazakhstan", "code": "KZ"},
  {"name": "Kenya", "code": "KE"},
  {"name": "Kiribati", "code": "KI"},
  {"name": "Korea (the Democratic People's Republic of)", "code": "KP"},
  {"name": "Korea (the Republic of)", "code": "KR"},
  {"name": "Kuwait", "code": "KW"},
  {"name": "Kyrgyzstan", "code": "KG"},
  {"name": "Lao People's Democratic Republic (the)", "code": "LA"},
  {"name": "Latvia", "code": "LV"},
  {"name": "Lebanon", "code": "LB"},
  {"name": "Lesotho", "code": "LS"},
  {"name": "Liberia", "code": "LR"},
  {"name": "Libya", "code": "LY"},
  {"name": "Liechtenstein", "code": "LI"},
  {"name": "Lithuania", "code": "LT"},
  {"name": "Luxembourg", "code": "LU"},
  {"name": "Macao", "code": "MO"},
  {"name": "Madagascar", "code": "MG"},
  {"name": "Malawi", "code": "MW"},
  {"name": "Malaysia", "code": "MY"},
  {"name": "Maldives", "code": "MV"},
  {"name": "Mali", "code": "ML"},
  {"name": "Malta", "code": "MT"},
  {"name": "Marshall Islands (the)", "code": "MH"},
  {"name": "Martinique", "code": "MQ"},
  {"name": "Mauritania", "code": "MR"},
  {"name": "Mauritius", "code": "MU"},
  {"name": "Mayotte", "code": "YT"},
  {"name": "Mexico", "code": "MX"},
  {"name": "Micronesia (Federated States of)", "code": "FM"},
  {"name": "Moldova (the Republic of)", "code": "MD"},
  {"name": "Monaco", "code": "MC"},
  {"name": "Mongolia", "code": "MN"},
  {"name": "Montenegro", "code": "ME"},
  {"name": "Montserrat", "code": "MS"},
  {"name": "Morocco", "code": "MA"},
  {"name": "Mozambique", "code": "MZ"},
  {"name": "Myanmar", "code": "MM"},
  {"name": "Namibia", "code": "NA"},
  {"name": "Nauru", "code": "NR"},
  {"name": "Nepal", "code": "NP"},
  {"name": "Netherlands (the)", "code": "NL"},
  {"name": "New Caledonia", "code": "NC"},
  {"name": "New Zealand", "code": "NZ"},
  {"name": "Nicaragua", "code": "NI"},
  {"name": "Niger (the)", "code": "NE"},
  {"name": "Nigeria", "code": "NG"},
  {"name": "Niue", "code": "NU"},
  {"name": "Norfolk Island", "code": "NF"},
  {"name": "Northern Mariana Islands (the)", "code": "MP"},
  {"name": "Norway", "code": "NO"},
  {"name": "Oman", "code": "OM"},
  {"name": "Pakistan", "code": "PK"},
  {"name": "Palau", "code": "PW"},
  {"name": "Palestine, State of", "code": "PS"},
  {"name": "Panama", "code": "PA"},
  {"name": "Papua New Guinea", "code": "PG"},
  {"name": "Paraguay", "code": "PY"},
  {"name": "Peru", "code": "PE"},
  {"name": "Philippines (the)", "code": "PH"},
  {"name": "Pitcairn", "code": "PN"},
  {"name": "Poland", "code": "PL"},
  {"name": "Portugal", "code": "PT"},
  {"name": "Puerto Rico", "code": "PR"},
  {"name": "Qatar", "code": "QA"},
  {"name": "Republic of North Macedonia", "code": "MK"},
  {"name": "Romania", "code": "RO"},
  {"name": "Russian Federation (the)", "code": "RU"},
  {"name": "Rwanda", "code": "RW"},
  {"name": "Réunion", "code": "RE"},
  {"name": "Saint Barthélemy", "code": "BL"},
  {"name": "Saint Helena, Ascension and Tristan da Cunha", "code": "SH"},
  {"name": "Saint Kitts and Nevis", "code": "KN"},
  {"name": "Saint Lucia", "code": "LC"},
  {"name": "Saint Martin (French part)", "code": "MF"},
  {"name": "Saint Pierre and Miquelon", "code": "PM"},
  {"name": "Saint Vincent and the Grenadines", "code": "VC"},
  {"name": "Samoa", "code": "WS"},
  {"name": "San Marino", "code": "SM"},
  {"name": "Sao Tome and Principe", "code": "ST"},
  {"name": "Saudi Arabia", "code": "SA"},
  {"name": "Senegal", "code": "SN"},
  {"name": "Serbia", "code": "RS"},
  {"name": "Seychelles", "code": "SC"},
  {"name": "Sierra Leone", "code": "SL"},
  {"name": "Singapore", "code": "SG"},
  {"name": "Sint Maarten (Dutch part)", "code": "SX"},
  {"name": "Slovakia", "code": "SK"},
  {"name": "Slovenia", "code": "SI"},
  {"name": "Solomon Islands", "code": "SB"},
  {"name": "Somalia", "code": "SO"},
  {"name": "South Africa", "code": "ZA"},
  {"name": "South Georgia and the South Sandwich Islands", "code": "GS"},
  {"name": "South Sudan", "code": "SS"},
  {"name": "Spain", "code": "ES"},
  {"name": "Sri Lanka", "code": "LK"},
  {"name": "Sudan (the)", "code": "SD"},
  {"name": "Suriname", "code": "SR"},
  {"name": "Svalbard and Jan Mayen", "code": "SJ"},
  {"name": "Sweden", "code": "SE"},
  {"name": "Switzerland", "code": "CH"},
  {"name": "Syrian Arab Republic", "code": "SY"},
  {"name": "Taiwan (Province of China)", "code": "TW"},
  {"name": "Tajikistan", "code": "TJ"},
  {"name": "Tanzania, United Republic of", "code": "TZ"},
  {"name": "Thailand", "code": "TH"},
  {"name": "Timor-Leste", "code": "TL"},
  {"name": "Togo", "code": "TG"},
  {"name": "Tokelau", "code": "TK"},
  {"name": "Tonga", "code": "TO"},
  {"name": "Trinidad and Tobago", "code": "TT"},
  {"name": "Tunisia", "code": "TN"},
  {"name": "Turkey", "code": "TR"},
  {"name": "Turkmenistan", "code": "TM"},
  {"name": "Turks and Caicos Islands (the)", "code": "TC"},
  {"name": "Tuvalu", "code": "TV"},
  {"name": "Uganda", "code": "UG"},
  {"name": "Ukraine", "code": "UA"},
  {"name": "United Arab Emirates (the)", "code": "AE"},
  {"name": "Great Britain", "code": "GB"},
  {"name": "United States Minor Outlying Islands (the)", "code": "UM"},
  {"name": "United States", "code": "US"},
  {"name": "Uruguay", "code": "UY"},
  {"name": "Uzbekistan", "code": "UZ"},
  {"name": "Vanuatu", "code": "VU"},
  {"name": "Venezuela (Bolivarian Republic of)", "code": "VE"},
  {"name": "Viet Nam", "code": "VN"},
  {"name": "Virgin Islands (British)", "code": "VG"},
  {"name": "Virgin Islands (U.S.)", "code": "VI"},
  {"name": "Wallis and Futuna", "code": "WF"},
  {"name": "Western Sahara", "code": "EH"},
  {"name": "Yemen", "code": "YE"},
  {"name": "Zambia", "code": "ZM"},
  {"name": "Zimbabwe", "code": "ZW"}
]

let c = {};
country_codes.forEach(d => c[d.name] = d.code);

// keys: "spotify_id","name","artists","daily_rank","daily_movement","weekly_movement","country","snapshot_date","popularity","is_explicit","duration_ms","album_name","album_release_date","danceability","energy","key","loudness","mode","speechiness","acousticness","instrumentalness","liveness","valence","tempo","time_signature"

let w = 1200;
let h = 800;
let paddingX = 100;
let paddingY = 40;

let viz = d3.select("#container")
  .append("svg")
  .attr("class", "viz")
  .attr("width", w)
  .attr("height", h)
  .style("background-color", "rgb(189, 175, 220)")
  ;


function gotData(incomingData) {
  // console.log(c);
  viz.selectAll("*").remove();

  // let country = c[document.getElementById("chooseCountry").value];

  // let filteredData = incomingData.filter(d =>
  //   d.country == country
  // );

  // console.log(filteredData)

  let timeParser = d3.timeParse("%Y-%m-%d");
  let formatDate = d3.timeFormat("%B %d, %Y");
  let threshDateMin = timeParser("1971-01-01");
  let threshDateMax = timeParser("2000-01-01");

  function mapFunction(d) {
    d.snapshot_date = timeParser(d.snapshot_date);
    d.album_release_date = timeParser(d.album_release_date);
    return d;
  }

  let filteredDataWithTime = incomingData.map(mapFunction);
  let filteredDataBefore2020 = filteredDataWithTime.filter(d =>
    d.album_release_date <= threshDateMax && d.album_release_date >= threshDateMin
  );

  let topTenUSBefore2020 = filteredDataBefore2020;

  // let topTenUSBefore2020 = filteredDataBefore2020.filter(d =>
  //   parseInt(d.daily_rank) <= 50
  // );

  // CREATE SCALES
  

  let releaseDateExtent = d3.extent(topTenUSBefore2020, d => d.album_release_date);
  let xScale = d3.scaleTime().domain(releaseDateExtent).range([paddingX, w - paddingX]);

  let snapshotDateExtent = d3.extent(topTenUSBefore2020, d => d.snapshot_date);
  let yScale = d3.scaleTime().domain(snapshotDateExtent).range([h - paddingY, paddingY]);

  // MAKE A COLOR SCALE FOR RANK
  let rankExtent = [1, 25, 50]
  let colorScale = d3.scaleLinear().domain(rankExtent).range(["red", "white", "blue"]);

  // CREATE AXES
  let xAxisGroup = viz.append("g").attr("class", "xAxisGroup");
  let xAxis = d3.axisBottom(xScale);
  xAxisGroup.call(xAxis);
  xAxisGroup.attr("transform", "translate(0," + (h - paddingY) + ")");

  let yAxisGroup = viz.append("g").attr("class", "yAxisGroup");
  let yAxis = d3.axisLeft(yScale);
  yAxisGroup.call(yAxis);
  yAxisGroup.attr("transform", "translate(" + (paddingX) + ",0)");

  // CREATE DATAGROUPS
  function getLocation(d) {
    let x = xScale(d.album_release_date);
    let y = yScale(d.snapshot_date);
    return "translate(" + x + "," + y + ")";
  }

  let datagroups = viz.selectAll(".datagroup").data(topTenUSBefore2020).enter()
    .append("g")
    .attr("class", "datagroup")
    .attr("transform", getLocation)
  ;

  // ADD MOUSEOVER
  var tooltip = d3.select("#tooltip")
    .style("opacity", 2)
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")

  var mouseover = function (event, d) {
    tooltip
      .style("opacity", 1);
    d3.select(this)
      .style("stroke", "black")
      .style("opacity", 1);
  }
  var mousemove = function (event, d) {
    // var [x, y] = d3.pointer(event)
    // console.log(x, y)
    tooltip
      .html("Song: " + d.name + "<br/>Artist: " + d.artists + "<br/>Release date: " + formatDate(d.album_release_date) + "<br/>Rank: " + d.daily_rank + "<br/>Country: " + d.country)
      .style("left", (event.pageX+10) + "px")
      .style("top", (event.pageY) + "px")
  }
  var mouseleave = function (event, d) {
    tooltip
      .style("opacity", 0);
    d3.select(this)
      .style("stroke", "none")
      .style("opacity", 0.8);
  }

  datagroups.selectAll(".songCircle").data(d => [d]).enter()
    .append("circle")
      .attr("class", "songCircle")
      .attr("r", 5)
      .attr("fill", d => colorScale(parseInt(d.daily_rank)))
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseout", mouseleave);
  ;
}

d3.csv("universal_top_spotify_songs.csv").then(gotData);

// function byCountry() {
//   d3.csv("universal_top_spotify_songs.csv").then(gotData);
// }

// window.byCountry = byCountry;