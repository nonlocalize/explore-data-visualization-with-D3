async function drawLineChart() {
  // 1. Access data
  let dataset = await d3.json('./../../data/seattle_wa_weather_data.json')

  // 2. Create chart dimensions

  const yAccessor = d => d.temperatureMax
  const dateParser = d3.timeParse('%Y-%m-%d')
  const xAccessor = d => dateParser(d.date)
  dataset = dataset.sort((a, b) => xAccessor(a) - xAccessor(b)).slice(0, 100)

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
  bounds.append('rect').attr('class', 'freezing')
  bounds.append('path').attr('class', 'line')
  bounds
    .append('g')
    .attr('class', 'x-axis')
    .style('transform', `translateY(${dimensions.boundedHeight}px)`)
  bounds.append('g').attr('class', 'y-axis')

  const drawLine = dataset => {
    // 4. Create scales

    const yScale = d3
      .scaleLinear()
      .domain(d3.extent(dataset, yAccessor))
      .range([dimensions.boundedHeight, 0])

    // const freezingTemperaturePlacement = yScale(32)
    // TWEAK: Let's define a custom temperature as freezing for Seattle WA to avoid errors in the console
    const freezingTemperaturePlacement = yScale(65)

    const freezingTemperatures = bounds
      .select('.freezing')
      .attr('x', 0)
      .attr('width', dimensions.boundedWidth)
      .attr('y', freezingTemperaturePlacement)
      .attr('height', dimensions.boundedHeight - freezingTemperaturePlacement)

    const xScale = d3
      .scaleTime()
      .domain(d3.extent(dataset, xAccessor))
      .range([0, dimensions.boundedWidth])

    // 5. Draw data

    const lineGenerator = d3
      .line()
      .x(d => xScale(xAccessor(d)))
      .y(d => yScale(yAccessor(d)))

    // // CHALLENGE: This will result in a jerky line animation
    // const line = bounds.select('.line').attr('d', lineGenerator(dataset))

    // // Remove the jerky axis transitions by making them nice and slow
    // const line = bounds
    //   .select('.line')
    //   .transition()
    //   .duration(1000)
    //   .attr('d', lineGenerator(dataset))
    // // ...except now we have a line wriggling around instead of adding a new point at the end. Why? Remember how path d attributes are a string of draw to values? D3 is transitioning each point to the next point at the same index. Our transition's .attr() function has no idea that we've just shifted our points down one index.

    // OK...How do we shift it to the left instead?
    const lastTwoPoints = dataset.slice(-2) // Grab the last two points in our dataset
    const pixelsBetweenLastPoints = xScale(xAccessor(lastTwoPoints[1])) - xScale(xAccessor(lastTwoPoints[0]))

    // Now when we update our line, we can instantly shift it to the right to match the old line
    const line = bounds.select(".line")
      .attr("d", lineGenerator(dataset))
      // Note how the shift to the right is effectively invisible because we are shifting our x scale to the left by the same amount
      .style("transform", `translateX(${pixelsBetweenLastPoints}px)`)
      // Now we can animate un-shifting the line to the left, to its normal position on the x axis
      .transition().duration(1000).style("transform", "none") // Without this, our line animation is jagged

    // 6. Draw peripherals

    const yAxisGenerator = d3.axisLeft().scale(yScale)

    const yAxis = bounds.select('.y-axis').call(yAxisGenerator)

    const xAxisGenerator = d3.axisBottom().scale(xScale)

    // // CHALLENGE: This will result in a jerky x axis animation
    // const xAxis = bounds
    //   .select('.x-axis')
    //   .call(xAxisGenerator)

    // Remove the jerky axis transitions by making them nice and slow
    const xAxis = bounds
      .select('.x-axis')
      .transition()
      .duration(1000)
      .call(xAxisGenerator)
  }
  drawLine(dataset)

  // update the line every 1.5 seconds
  setInterval(addNewDay, 1500)
  function addNewDay() {
    dataset = [
      ...dataset.slice(1), // Spread the current dataset (minus the first point) in place
      generateNewDataPoint(dataset),
    ]
    drawLine(dataset)
  }

  function generateNewDataPoint(dataset) {
    const lastDataPoint = dataset[dataset.length - 1]
    const nextDay = d3.timeDay.offset(xAccessor(lastDataPoint), 1)

    return {
      date: d3.timeFormat('%Y-%m-%d')(nextDay),
      temperatureMax: yAccessor(lastDataPoint) + (Math.random() * 6 - 3),
    }
  }
}
drawLineChart()
