// ----------------------------------- DATA -------------------------------------
// line chart settings
var startingPosition = 0,
    axisRange = 25,
    animationSpeed = 500,
    value = 0,
    data = d3.range(axisRange).map(nextFrame);

// populate data
function nextFrame(){
    startingPosition = periodNumber +  2;
    value = balls.length;
    return {
        time: startingPosition,
        value: value,
    }
}

// ------------------------------------- D3 --------------------------------------
var margin = {top: 6, right: 0, bottom: 25, left: 40},
    width = 250 - margin.right,
    height = 80 - margin.top - margin.bottom;

// the x axis shjould go from 0 to the actual number of balls
var x = d3.scale.linear()
    .domain([0, balls.length])
    .range([0, width]);

var y = d3.time.scale()
    .range([height, 0])
    .domain([0, 50]);

// moving line svg
var line = d3.svg.line()
    .interpolate("basis")
    .x(function (d) {return x(d.time);})
    .y(function (d) {return y(d.value);});

// insert svg into element
var svg = d3.select("#graph")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .style("margin-left", -margin.left + "px")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// deletes animation outside of the clipPah
svg.append("defs").append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", width)
    .attr("height", height);

// append x axis data
var xAxis = d3.svg.axis().scale(x).orient("bottom");
var axis = svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(x.axis=xAxis)
    .attr("font-size", "10px")


var path = svg.append("g")
    .attr("clip-path", "url(#clip)")
    .append("path")
    .data([data])
    .attr("class", "line");

tick();

    // ---------------------------------- ANIMATION ----------------------------------
function tick() {

    // update the domains
    x.domain([startingPosition - axisRange + 2, startingPosition]);

    // push the accumulated count onto the back, and reset the count
    data.push(nextFrame());

    // redraw the line
    svg.select(".line")
        .attr("d", line)
        .attr("transform", null);
    
    // slide the x-axis left
    var numTicks = 5;
    axis.transition()
        .duration(animationSpeed)
        .ease("linear")
        .call(x.axis=xAxis.ticks(numTicks));

    // slide the line left
    path.transition()
        .duration(animationSpeed)
        .ease("linear")
        .attr("transform", "translate(" + x(startingPosition-axisRange) + ")")
        .each("end", tick);

    // pop the old data point off the front
    data.shift();

}