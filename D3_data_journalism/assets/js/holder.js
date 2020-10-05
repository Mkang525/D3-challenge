// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

  var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("assets/data/data.csv").then(function(demoData) {
    console.log(demoData);

// Step 1: Parse Data/Cast as numbers

    demoData.forEach(function(data) {
        data.income = +data.income;
        data.obesity = +data.obesity;
    });

// Step 2: Create scale functions
   
    var xLinearScale = d3.scaleLinear()
        .domain([20, d3.max(demoData, d => d.income)])
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(demoData, d => d.obesity)])
        .range([height, 0]);


// Step 3: Create axis functions

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);


// Step 4: Append Axes to the chart
 
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);


// Step 5: Create Circles

    var circlesGroup = chartGroup.selectAll("stateCircle")
        .data(demoData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.income))
        .attr("cy", d =>  yLinearScale(d.obesity))
        .attr("r", "15")
        .attr("fill", "#89bdd3")  
        .attr("stroke", "#e3e3e3")
        .text(function(d){return d.abbr})
        

        

    var textCircle = chartGroup.selectAll('stateText')
        .data(demoData)
        .enter()
        .append('text')
        .text(function(d){return d.abbr})
        .attr("x", d => xLinearScale(d.income /1.0190))
        .attr("y", d => yLinearScale(d.obesity -0.22 )) 
        .attr("fill", "#fff")
        .attr("font-family", "sans-serif")
        
// Create axes labels

    chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Obesity");

    chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .text("Median Income (Household)");
    
});