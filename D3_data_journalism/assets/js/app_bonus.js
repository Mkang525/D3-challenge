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

var chosenXAxis = "income";

//function used for updating x-scale var upon click on axis label

function xScale(demoData, chosenXAxis) {
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(demoData, d => d.chosenXAxis) * 0.8,
            d3.max(demoData, d => d.chosenXAxis) * 1.2
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
        .attr("cs", d => newXScale(d.chosenXAxis));
    return circlesGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {

    var label;

    if (chosenXAxis === "income") {
        label = "Household Income (Median):";
    }

    else {
        label = "Lacks Healthcare (%):"
    }

    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, 60])
        .html(function(d) {
            return (`${d.abbr}<br>${label} ${d.chosenXAxis}`);
        });

    circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", function(data) {
        toolTip.show(data);
    })

    //onmouseout event
    .on("mouseout", function(data, index) {
        toolTip.hide(data);
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
    });

// xLinearScale function above csv import
    var xLinearScale = xScale(demoData, chosenXAxis);

// Create y scale function
    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(demoData, d => d.income)])
        .range([height, 0]);

})