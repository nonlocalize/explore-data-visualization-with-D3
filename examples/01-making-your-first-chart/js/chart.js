async function drawLineChart() {
  const dataset = await d3.json("./data/seattle_wa_weather_data.json")

  // Access data
  const dateFormatString = "%Y-%m-%d"
  const dateParser = d3.timeParse(dateFormatString)
  const xAccessor = d => dateParser(d.date)
  const yAccessor = d => d.temperatureMax

  // Create dimensions for our chart
  // We want a small top and right margin to give our chart some space.
  // The line of the y-axis might overflow the chart bounds, so let's
  // define a larger bottom and left room to create room for our axes.
  let dimensions = {
    width: window.innerWidth * 0.9,
    height: 400,
    margin: {
      top: 15,
      right: 15,
      bottom: 40,
      left: 60,
    },
  }
  dimensions.boundedWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right
  dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom

  // Draw
  const wrapper = d3.select("#wrapper")
    .append("svg")
      .attr("width", dimensions.width)
      .attr("height", dimensions.height)

  // We can draw our chart inside of a "g" element and shift it all at once using the CSS transform property
  const bounds = wrapper.append("g")  // Think of "g" as the "div" equivalent within an SVG element
    .style("transform", `translate(${
      dimensions.margin.left
    }px, ${
      dimensions.margin.top
    }px)`)

  // Create our scales
  const yScale = d3.scaleLinear()
    .domain(d3.extent(dataset, yAccessor))  // d3.extent returns an array with the min and max value
    .range([dimensions.boundedHeight, 0])   // range refers to the highest and lowest numbers to display

  // Let's visualize the threshold by adding a rectangle to cover all temperatures below freezing
  const freezingTemperaturePlacement = yScale(32) // 32 degrees Fahrenheit
  const freezingTemperatures = bounds.append("rect")
    .attr("x", 0)
    .attr("width", dimensions.boundedWidth)
    .attr("y", freezingTemperaturePlacement)
    .attr("height", dimensions.boundedHeight - freezingTemperaturePlacement)
    .attr("fill", "#e0f3f3")  // Make the rectangle frosty to indicate freezing

  const xScale = d3.scaleTime()
    .domain(d3.extent(dataset, xAccessor))  // Use a time scale since we are working with date objects
    .range([0, dimensions.boundedWidth])

  /*
    “The d attribute will take a few commands that can be capitalized (if giving an absolute value) or lowercased (if giving a relative value):

    M will move to a point (followed by x and y values)
    L will draw a line to a point (followed by x and y values)
    Z will draw a line back to the first point”

    Excerpt From: Nate Murray. “Fullstack Data Visualization with D3.” Apple Books.

    bounds.append("path").attr("d", "M 0 0 L 100 0 L 100 100 L 0 50 Z")

  */
  const lineGenerator = d3.line() // Creates a generator that converts data points into a d string
    // Transform our data point with the appropriate accessor and the scale to get the scaled value in pixel space
    .x(d => xScale(xAccessor(d)))
    .y(d => yScale(yAccessor(d)))

  const line = bounds.append("path")
    // Feed our dataset to our line generator function
    .attr("d", lineGenerator(dataset))
    // SVG elements default to a black fill and no stroke; which gives us a filled in shape unless we add styling
    .attr("fill", "none")
    .attr("stroke", "#af9358")
    .attr("stroke-width", 2)

  // Additional things to draw (tick marks, labels, legends, etc)

  // Draw y axis tick marks and labels
  const yAxisGenerator = d3.axisLeft()  // We want labels of the y-axis to be to the left of the axis line
    .scale(yScale)
  // Our axis generator will create lots of element; create a g element to contain them and keep our DOM organized
  const yAxis = bounds.call(yAxisGenerator)

  // Draw x axis tick marks and labels
  const xAxisGenerator = d3.axisBottom()  // We want our labels of the x-axis to appear under the axis line
    .scale(xScale)
  const xAxis = bounds.append("g")
    .call(xAxisGenerator)
    // If you stop here, the xAxisGenerator knows how to display tick marks and labels relative to the axis line, but we need to move it to the bottom with a CSS transform
      .style("transform", `translateY(${
        dimensions.boundedHeight
      }px)`)
}

drawLineChart()