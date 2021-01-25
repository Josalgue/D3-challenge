// Set up the chart

var svgWidth = 800;
var svgHeight = 560;

var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 50
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, 
// append an SVG group that will hold the chart
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import data from the csv file

d3.csv("../data/data.csv").then(function(stateData) {

    stateData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
  });

// Create scaling functions
var xLinearScale = d3.scaleLinear()
    .domain([9, d3.max(stateData, d => d.poverty)])
    .range([0, width]);

var yLinearScale = d3.scaleLinear()
    .domain([4, d3.max(stateData, d => d.healthcare)])
    .range([height, 0]);


// Create axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

// Add axis
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  chartGroup.append("g")
    .call(leftAxis);

// Add data points
var circlesGroup = chartGroup.selectAll("circle")
    .data(stateData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", 10)
    .attr("fill", "lightblue")
    .attr("opacity", ".5")
    .attr("stroke", "white")

// State abbreviations
chartGroup.append("text")
.style("text-anchor", "middle")
.style("font-family", "sans-serif")
.style("font-size", "8px")
.selectAll("tspan")
.data(stateData)
.enter()
.append("tspan")
.attr("x", function(data) {
    return xLinearScale(data.poverty);
})
.attr("y", function(data) {
    return yLinearScale(data.healthcare -.02);
})
.text(function(data) {
    return data.abbr
});


// ToolTip
var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([-10, 30])
    .html(function(d) {
        return ('${d.abbr}<br>Healthcare (%): ${d.healthcare}%<br>Poverty: ${d.poverty}');
    });


// Integrate ToolTip into chart
chartGroup.call(toolTip);

// Event listener for display and hide of ToolTip
circlesGroup.on("mouseover", function(d) {
    toolTip.show(d);
})
    .on("mouseout", function(d, i){
        toolTip.hide(d);
    });

});