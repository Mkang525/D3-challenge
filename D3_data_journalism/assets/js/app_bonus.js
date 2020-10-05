var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left:100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3
    .select(".chart")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

//Initial Params

var chosenXAxis = "obesity";
console.log(chosenXAxis);
//function used for updating x-scale var upon click on axis label

function xScale(demoData, chosenXAxis) {
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(demoData, d => d[chosenXAxis]) * 0.8,
            d3.max(demoData, d => d[chosenXAxis]) * 1.2
        ])
        .range([0, width]);
    return xLinearScale;

}

//function used for updating xAxis var upon click on axis label

function renderAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);
    return xAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis) {
    circlesGroup.transition()
        .duration(1000)
        .attr("cs", d => newXScale(d[chosenXAxis]));
    return circlesGroup;
}
console.log(chosenXAxis);
// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {

    var label;

    if (chosenXAxis === "obesity") {
        label = "Obesity (%):";
    }

    else {
        label = "Lacks Healthcare (%):"
    }

    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, 60])
        .html(function(d) {
            return (`${d.abbr}<br>${label} ${d[chosenXAxis]}`);
        });

    circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", function(data) {
        toolTip.show(data);
    })

    //onmouseout event
    .on("mouseout", function(data, index) {
        toolTip.hide(d, this);
    });

    return circlesGroup;
}

// Retrieve data from the CSV file and execute everything below

d3.csv("assets/data/data.csv").then(function(demoData, err) {
    console.log(demoData);

    if (err) throw err;

// parse data
    demoData.forEach(function(data) {
        data.income = +data.income;
        data.healthcare = +data.healthcare;
        data.obesity = +data.obesity;
    });

// xLinearScale function above csv import
    var xLinearScale = xScale(demoData, chosenXAxis);

// Create y scale function
    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(demoData, d => d.income)])
        .range([height, 0]);

// Create initial axis functions
var bottomAxis = d3.axisBottom(xLinearScale);
var leftAxis = d3.axisLeft(yLinearScale);

// append x axis
var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

chartGroup.append("g")
    .call(leftAxis);

// append initial circles
var circlesGroup = chartGroup.selectAll("circle")
    .data(demoData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d.income))
    .attr("r", "15")
    .attr("fill", "#89bdd3")  
    .attr("stroke", "#e3e3e3")

var textCircle = chartGroup.selectAll('stateText')
    .data(demoData)
    .enter()
    .append('text')
    .text(function(d){return d.abbr})
    .attr("x", d => xLinearScale(d[chosenXAxis] -0.30))
    .attr("y", d => yLinearScale(d.income /1.0150)) 
    .attr("fill", "#fff")
    .attr("font-family", "sans-serif")

// var labelsGroup = chartGroup.append("g")
//     .attr("transform", `translate(${width / 2}, ${height + 20})`);

// var obesityLabel = labelsGroup.append("text")
//     .attr("x", 0)
//     .attr("y", 20)
//     .attr("value", "obesity") 
//     .classed("active", true)
//     .text("Obesity (%)");

// var healthcareLabel = labelsGroup.append("text")
//     .attr("x", 0)
//     .attr("y", 40)
//     .attr("value", "healthcare")
//     .classed("inactive", true)
//     .text("Lack of Healthcare (%)");

// // append y axis
// chartGroup.append("text")
//     .attr("transform", "rotate(-90)")
//     .attr("y", 0 - margin.left)
//     .attr("x", 0 - (height/2 + 50))
//     .attr("dy", "1em")
//     .classed("axis-text", true)
//     .text("Household Income (%)");

// var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

})