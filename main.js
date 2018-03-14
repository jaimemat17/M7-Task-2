
// Let's start using ES6
// And let's organize the code following clean code concepts
// Later one we will complete a version using imports + webpack

// Isolated data array to a different file

let margin = null,
    width = null,
    height = null;

let svg = null;
let x, y = null; // scales

const color = d3.scaleOrdinal(d3.schemeCategory10);

var Spain = countryData
                    .filter(data => data["Country Code"] === "ESP")
                    .map(data => ({x: data.Year, y: data.Value, z: data["Country Name"]}))
                ;
            
var Germany = countryData
                  .filter(data => data["Country Code"] === "DEU")
                  .map(data => ({x: data.Year, y: data.Value, z: data["Country Name"] }))
                ;

// Define the div for the tooltip
var div = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);


setupCanvasSize();
appendSvg("body");
setupXScale();
setupYScale();
appendXAxis();
appendYAxis();
appendLineCharts();
appendScatterPlot();
AppendLegend();


// 1. let's start by selecting the SVG Node
function setupCanvasSize() {
  margin = {top: 20, left: 80, bottom: 20, right: 30};
  width = 960 - margin.left - margin.right;
  height = 520 - margin.top - margin.bottom;
}

function appendSvg(domElement) {
  svg = d3.select(domElement).append("svg")
              .attr("width", 200 + width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .append("g")
              .attr("transform",`translate(${margin.left}, ${margin.top})`);

}

// Now on the X axis we want to map totalSales values to
// pixels
// in this case we map the canvas range 0..350, to 0...maxSales
// domain == data (data from 0 to maxSales) boundaries
function setupXScale()
{

  x = d3.scaleTime()
      .range([0, width])
      .domain(d3.extent(Spain, function(d) { return d.x}));
}

// Now we don't have a linear range of values, we have a discrete
// range of values (one per product)
// Here we are generating an array of product names
function setupYScale()
{
  var maxPopulation = d3.max(Spain.concat(Germany), function(d, i) {return d.y;});

  y = d3.scaleLinear()
        .range([height, 0])
        .domain([0, maxPopulation]);

}

function appendXAxis() {
  // Add the X Axis
  svg.append("g")
    .attr("transform",`translate(0, ${height})`)
    .call(d3.axisBottom(x));
}

function appendYAxis() {
  // Add the Y Axis
  svg.append("g")
  .call(d3.axisLeft(y));
}

function appendLineCharts()
{
  // define the line
  var valueline = d3.line()
                    .x(function(d) { return x(d.x); })
                    .y(function(d) { return y(d.y); });

  // Add the valueline path.
  svg.append("path")
  .data([Spain])
  .attr("class", "line")
  .attr("d", valueline)
  .style("stroke", "blue");

  svg.append("path")
  .data([Germany])
  .attr("class", "line")
  .attr("d", valueline)
  .style("stroke", "red");

}

function appendScatterPlot()
{
  svg.selectAll("dot")
        .data(Spain)
      .enter().append("circle")
        .attr("r", 3)
        .attr("cx", function(d) { return x(d.x); })
        .attr("cy", function(d) { return y(d.y); })
        .attr('fill', function(d) {
            return color(d.z);
          })
        .on("mouseover", function(d) {
          d3.select(this)
          .attr('fill', 'grey');	
        })
        .on("mouseout", function(d) {
          d3.select(this)
          .attr('fill', function(d) {
            return color(d.z);
          });	
        })
        .on("click", function(d){
          d3.selectAll("circle").attr('r', 3);
          d3.select(this)
            .attr('r', 6);
          div.transition()		
              .duration(200)		
              .style("opacity", .9);		
          div.html("Population: " + d.y + "<br/>" + "Year: " + d.x)	
              .style("left", (d3.event.pageX) + "px")		
              .style("top", (d3.event.pageY + 20) + "px");	
          })
        .on("dblclick", function(d){
              d3.select(this).attr("r", 3)
              div.transition()		
              .duration(200)		
              .style("opacity", 0);	
        });

    svg.selectAll("dot")
      .data(Germany)
    .enter().append("circle")
      .attr("r", 3)
      .attr("cx", function(d) { return x(d.x); })
      .attr("cy", function(d) { return y(d.y); })
      .attr('fill', function(d) {
        return color(d.z);
      })
      .on("mouseover", function(d) {
        d3.select(this)
        .attr('fill', 'grey');	
      })
      .on("mouseout", function(d) {
        d3.select(this)
        .attr('fill', function(d) {
          return color(d.z);
        });	
      })
      .on("click", function(d){
        d3.selectAll("circle").attr('r', 3);
        d3.select(this)
          .attr('r', 6);
        div.transition()		
            .duration(200)		
            .style("opacity", .9);		
        div.html("Population: " + d.y + "<br/>" + "Year: " + d.x)	
            .style("left", (d3.event.pageX) + "px")		
            .style("top", (d3.event.pageY + 20) + "px");	
        })
        .on("dblclick", function(d){
          d3.select(this).attr("r", 3)
          div.transition()		
          .duration(200)		
          .style("opacity", 0);	
        });
}
barColor = ['red','blue']
function AppendLegend() {
    // building a legend is as simple as binding
    // more elements to the same data. in this case,
    // <text> tags
    svg.append('g')
      .attr("transform",`translate(900, 0)`)
      .attr('class', 'legend')
        .selectAll('text')
        .data(d3.map(Spain.concat(Germany), function(d){return d.z;}).keys())
          .enter()
            .append('text')
              .text(function(d) { return '• ' + d; })
              .attr('fill', function(d) { return color(d); })
              .attr('y', function(d, i) { return 20 * (i + 1); })  
  }