async function drawBars() {
  // 1. Access data
  const pathToJSON = './../../data/seattle_wa_weather_data.json'
  const dataset = await d3.json(pathToJSON)

  // 2. Create chart dimensions

  const width = 600
  let dimensions = {
    width: width,
    height: width * 0.6,
    margin: {
      top: 30,
      right: 10,
      bottom: 50,
      left: 50,
    },
  }
  dimensions.boundedWidth =
    dimensions.width - dimensions.margin.left - dimensions.margin.right
  dimensions.boundedHeight =
    dimensions.height - dimensions.margin.top - dimensions.margin.bottom

  // 3. Draw canvas

  const wrapper = d3
    .select('#wrapper')
    .append('svg')
    .attr('width', dimensions.width)
    .attr('height', dimensions.height)

  const bounds = wrapper
    .append('g')
    .style(
      'transform',
      `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`
    )

  // init static elements
  bounds.append('g').attr('class', 'bins')
  bounds.append('line').attr('class', 'mean')
  bounds
    .append('g')
    .attr('class', 'x-axis')
    .style('transform', `translateY(${dimensions.boundedHeight}px)`)
    .append('text')
    .attr('class', 'x-axis-label')

  const metricAccessor = d => d.humidity
  const yAccessor = d => d.length

  // 4. Create scales

  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(dataset, metricAccessor))
    .range([0, dimensions.boundedWidth])
    .nice()

  const binsGenerator = d3
    .histogram()
    .domain(xScale.domain())
    .value(metricAccessor)
    .thresholds(12)

  const bins = binsGenerator(dataset)

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(bins, yAccessor)])
    .range([dimensions.boundedHeight, 0])
    .nice()

  // 5. Draw data

  const barPadding = 1

  let binGroups = bounds
    .select('.bins')
    .selectAll('.bin')
    .data(bins)

  binGroups.exit().remove()

  const newBinGroups = binGroups
    .enter()
    .append('g')
    .attr('class', 'bin')

  newBinGroups.append('rect')
  newBinGroups.append('text')

  // update binGroups to include new points
  binGroups = newBinGroups.merge(binGroups)

  const barRects = binGroups
    .select('rect')
    .attr('x', d => xScale(d.x0) + barPadding)
    .attr('y', d => yScale(yAccessor(d)))
    .attr('height', d => dimensions.boundedHeight - yScale(yAccessor(d)))
    .attr('width', d => d3.max([0, xScale(d.x1) - xScale(d.x0) - barPadding]))

  // Add labels to bins with relevant days only; no need to call a 0 label - the bar will be empty
  const barText = binGroups
    .filter(yAccessor)
    .append('text')
    // Center the label horizontally above the bar
    .attr('x', d => xScale(d.x0) + (xScale(d.x1) - xScale(d.x0)) / 2)
    // Shift text up by 5 pixels to add a little gap
    .attr('y', d => yScale(yAccessor(d)) - 5)
    .text(yAccessor)
    // Use text-anchor to horizontally align our text instead of compensating for width
    .style('text-anchor', 'middle')
    // Color and style
    .attr('fill', 'darkgrey')
    .style('font-size', '12px')
    .style('font-family', 'sans-serif')

  const mean = d3.mean(dataset, metricAccessor)

  const meanLine = bounds
    .selectAll('.mean')
    .attr('x1', xScale(mean))
    .attr('x2', xScale(mean))
    .attr('y1', 25)
    .attr('y2', dimensions.boundedHeight)

  const meanLabel = bounds
    .append('text')
    .attr('x', xScale(mean))
    .attr('y', 15)
    .text('mean')
    .attr('fill', 'maroon')
    .style('font-size', '12px')
    .style('text-anchor', 'middle')

  // draw axes
  const xAxisGenerator = d3.axisBottom().scale(xScale)

  const xAxis = bounds.select('.x-axis').call(xAxisGenerator)

  const xAxisLabel = xAxis
    .select('.x-axis-label')
    .attr('x', dimensions.boundedWidth / 2)
    .attr('y', dimensions.margin.bottom - 10)
    .text('Humidity')

  // 7. Set up interactions

  // Since we need to update our tooltip text and position when we hover over a bar, we need to use event listeners
  binGroups
    .select('rect')
    .on('mouseenter', onMouseEnter)
    .on('mouseleave', onMouseLeave)

  const tooltip = d3.select("#tooltip")
  function onMouseEnter(datum) {
    const formatHumidity = d3.format(".2f") // 0.6000000000000001 => 0.60

    // Update #range to display the values of the bar
    tooltip.select("#range")
      // .text([datum.x0, datum.x1].join(" - ")) // 0.55 - 0.6000000000000001
      .text([formatHumidity(datum.x0), formatHumidity(datum.x1)].join(" - ")) // 0.60

    // Update #count to display the y value of the bar
    tooltip.select("#count").text(yAccessor(datum))
  }

  function onMouseLeave(datum) {

  }

}
drawBars()
