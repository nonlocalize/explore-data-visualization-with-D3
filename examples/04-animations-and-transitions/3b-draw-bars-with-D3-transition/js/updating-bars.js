async function updatingBars() {
  // 1. Access data
  const dataset = await d3.json('./../../data/seattle_wa_weather_data.json')

  // 2. Create chart dimensions

  const width = 500
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
    .attr('x', dimensions.boundedWidth / 2)
    .attr('y', dimensions.margin.bottom - 10)

  const drawHistogram = metric => {
    const metricAccessor = d => d[metric]
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

    // // IMPROVEMENT: Define a custom transition that we can reference later on
    // const updateTransition = d3.transition()
    //   .duration(600)
    //   /*
    //     NOTE: Some transitions will cause our bars to bounce below the x axis when they animate; which will appear as errors in the JavaScript console along the lines of:

    //       Error: <rect> attribute height: A negative value is not valid.

    //     This is expected behavior.

    //     See https://github.com/d3/d3-ease/blob/v1.0.5/README.md for visualizations and D3 easing functions
    //   */
    //   .ease(d3.easeCircleInOut)

    // // IMPROVEMENT: Let's animate elements entering AND exiting
    // const exitTransition = d3.transition().duration(600)
    // const updateTransition = d3.transition().duration(600)

    // IMPROVEMENT: Our bars are moving to their new positions while bars are exiting and displaying intermediate states...Let's fix that by delaying the update transition until the exit transition has finished
    const exitTransition = d3.transition().duration(600)
    const updateTransition = exitTransition.transition().duration(600)
    // Alternatively, we could use the .delay() method - see https://github.com/d3/d3-transition#transition_delay

    let binGroups = bounds.select('.bins').selectAll('.bin').data(bins)

    // IMPROVEMENT: Let's animate elements entering and exiting
    const oldBinGroups = binGroups.exit()

    // Select all of the rect elements to remove
    oldBinGroups.selectAll("rect")
      .style("fill", "red") // Color them red
      .transition(exitTransition) // Use our new exit transition
        // Shrink the bars into the x axis
        .attr("y", dimensions.boundedHeight)
        .attr("height", 0)

    // Transition our text
    oldBinGroups.selectAll("text")
      .transition(exitTransition)
        .attr("y", dimensions.boundedHeight)

    // Actually remove our bars from the DOM once the transition has completed
    oldBinGroups
      .transition(exitTransition)
        .remove()

    const newBinGroups = binGroups.enter().append('g').attr('class', 'bin')

    newBinGroups
      .append('rect')
      // IMPROVEMENT: Start in the right horizontal location and be 0 pixels tall to prevent bars from flying in from the left
      .attr('height', 0)
      .attr('x', d => xScale(d.x0) + barPadding)
      .attr('y', dimensions.boundedHeight)
      .attr('width', d => d3.max([0, xScale(d.x1) - xScale(d.x0) - barPadding]))
      // IMPROVEMENT: We need fill to be an inline style so that we can override it in our CSS file; otherwise this would just be an SVG attribute
      .style('fill', 'yellowgreen')

    newBinGroups.append('text')
      // IMPROVEMENT: Set our labels' initial position to prevent them from flying in from the left
      .attr("x", d => xScale(d.x0) + (xScale(d.x1) - xScale(d.x0)) / 2)
      .attr("y", dimensions.boundedHeight)

    // update binGroups to include new points
    binGroups = newBinGroups.merge(binGroups)

    const barRects = binGroups
      .select('rect')
      // Transform our selection object into a D3 transition object
      .transition(updateTransition) // IMPROVEMENT: Use our custom transition from above
        .attr('x', d => xScale(d.x0) + barPadding)
        .attr('y', d => yScale(yAccessor(d)))
        .attr('height', d => dimensions.boundedHeight - yScale(yAccessor(d)))
        .attr('width', d => d3.max([0, xScale(d.x1) - xScale(d.x0) - barPadding]))
      // Add a second transition to make sure our new bars are blue instead of the green color
      .transition()
        .style("fill", "cornflowerblue")

    const barText = binGroups.select('text')
      // Let's add a transition so that our text transitions with our bars
      .transition(updateTransition) // IMPROVEMENT: Use our custom transition from above
        .attr('x', d => xScale(d.x0) + (xScale(d.x1) - xScale(d.x0)) / 2)
        .attr('y', d => yScale(yAccessor(d)) - 5)
        .text(d => yAccessor(d) || '')

    const mean = d3.mean(dataset, metricAccessor)

    const meanLine = bounds.selectAll('.mean')
      .transition(updateTransition) // IMPROVEMENT: Use our custom transition from above
        .attr('x1', xScale(mean))
        .attr('x2', xScale(mean))
        .attr('y1', -20)
        .attr('y2', dimensions.boundedHeight)

    // 6. Draw peripherals

    const xAxisGenerator = d3.axisBottom().scale(xScale)

    const xAxis = bounds.select('.x-axis')
      .transition(updateTransition) // IMPROVEMENT: Use our custom transition from above
      //We can now see our tick marks move to fit the new domain before the new tick marks are drawn
      .call(xAxisGenerator)

    const xAxisLabel = xAxis.select('.x-axis-label').text(metric)
  }

  const metrics = [
    'windSpeed',
    'moonPhase',
    'dewPoint',
    'humidity',
    'uvIndex',
    'windBearing',
    'temperatureMin',
    'temperatureMax',
  ]
  let selectedMetricIndex = 0
  drawHistogram(metrics[selectedMetricIndex])

  const button = d3.select('body').append('button').text('Change metric')

  button.node().addEventListener('click', onClick)

  function onClick() {
    selectedMetricIndex = (selectedMetricIndex + 1) % (metrics.length - 1)
    drawHistogram(metrics[selectedMetricIndex])
  }
}
updatingBars()
