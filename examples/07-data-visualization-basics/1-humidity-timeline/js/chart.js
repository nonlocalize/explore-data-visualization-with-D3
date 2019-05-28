async function drawLineChart() {

  // 1. Access data
  const pathToJSON = "./../../data/seattle_wa_weather_data.json"
  let dataset = await d3.json(pathToJSON)

  const yAccessor = d => d.humidity
  const dateParser = d3.timeParse("%Y-%m-%d")
  const dateFormatter = d3.timeFormat("%Y-%m-%d")
  const xAccessor = d => dateParser(d.date)
  dataset = dataset.sort((a,b) => xAccessor(a) - xAccessor(b))
  const downsampledData = downsampleData(dataset, xAccessor, yAccessor)
  const weeks = d3.timeWeeks(xAccessor(dataset[0]), xAccessor(dataset[dataset.length - 1]))

  // 2. Create chart dimensions

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

  // 3. Draw canvas

  const wrapper = d3.select("#wrapper")
    .append("svg")
      .attr("width", dimensions.width)
      .attr("height", dimensions.height)

  const bounds = wrapper.append("g")
      .style("transform", `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`)

  const defs = bounds.append("defs")

  // 4. Create scales

  const yScale = d3.scaleLinear()
    .domain(d3.extent(dataset, yAccessor))
    .range([dimensions.boundedHeight, 0])
    .nice()

  const xScale = d3.scaleTime()
    .domain(d3.extent(dataset, xAccessor))
    .range([0, dimensions.boundedWidth])

  // create grid marks
  const yAxisGeneratorGridMarks = d3.axisLeft(yScale)
      .ticks()
      .tickSize(-dimensions.boundedWidth)
      .tickFormat("")

  // 5. Draw data
  const seasonBoundaries = [
    "3-20", // Spring starts on March 20th of every year
    "6-21", // Summer starts on June 21st of every year
    "9-21", // Fall starts on September 21st of every year
    "12-21",  // Winter starts on December 21st of every year
  ]

  // Season name here correlates to the appropriate start date in seasonBoundaries
  const seasonNames = ["Spring", "Summer", "Fall", "Winter"]
  let seasonsData = []

  // Identify the start and end dates of our dataset
  const startDate = xAccessor(dataset[0])
  // Mon May 21 2018 00:00:00 GMT-0700 (Pacific Daylight Time)

  const endDate = xAccessor(dataset[dataset.length - 1])
  // Mon May 20 2019 00:00:00 GMT-0700 (Pacific Daylight Time)

  // Identify specific years contained within our dataset
  const years = d3.timeYears(d3.timeMonth.offset(startDate, -13), endDate)
  // Mon Jan 01 2018 00:00:00 GMT-0800 (Pacific Standard Time),Tue Jan 01 2019 00:00:00 GMT-0800 (Pacific Standard Time)

  years.forEach(yearDate => { // For each year in our dataset
    const year = +d3.timeFormat("%Y")(yearDate) // 2019

    // For each of our defined season boundaries
    seasonBoundaries.forEach((boundary, index) => {
      // Identify the start and end of our season for the year
      const seasonStart = dateParser(`${year}-${boundary}`)
      // Tue Mar 20 2018 00:00:00 GMT-0700 (Pacific Daylight Time)

      const seasonEnd = seasonBoundaries[index + 1] ?
        dateParser(`${year}-${seasonBoundaries[index + 1]}`) :
        dateParser(`${year + 1}-${seasonBoundaries[0]}`)
      // Thu Jun 21 2018 00:00:00 GMT-0700 (Pacific Daylight Time)

      // Which is greater? Our dataset start date, or the start of the season for the year?
      const boundaryStart = d3.max([startDate, seasonStart])
      // Mon May 21 2018 00:00:00 GMT-0700 (Pacific Daylight Time)

      // Which is greater? Our dataset end date, or the end of the season for the year?
      const boundaryEnd = d3.min([endDate, seasonEnd])
      // Thu Jun 21 2018 00:00:00 GMT-0700 (Pacific Daylight Time)

      // Identify the days in our dataset that match this season's boundary
      const days = dataset.filter(d => xAccessor(d) > boundaryStart && xAccessor(d) <= boundaryEnd)
      if (!days.length) return
      seasonsData.push({
        start: boundaryStart,
        end: boundaryEnd,
        name: seasonNames[index],
        mean: d3.mean(days, yAccessor),
      })
    })
  })

  const seasonOffset = 10
  const seasons = bounds.selectAll(".season")
      .data(seasonsData)
    .enter().append("rect")
      .attr("x", d => xScale(d.start))
      .attr("width", d => xScale(d.end) - xScale(d.start))
      .attr("y", seasonOffset)
      .attr("height", dimensions.boundedHeight - seasonOffset)
      .attr("class", d => `season ${d.name}`)

  // draw the line
  const areaGenerator = d3.area()
    .x(d => xScale(xAccessor(d)))
    .y0(dimensions.boundedHeight / 2)
    .y1(d => yScale(yAccessor(d)))
    .curve(d3.curveBasis)

  // Even though we're drawing a smooth line, let's add the original data points in as small dots
  const dots = bounds.selectAll(".dot")
    .data(dataset)
    .enter().append("circle")
      .attr("cx", d => xScale(xAccessor(d)))
      .attr("cy", d => yScale(yAccessor(d)))
      .attr("r", 2)
      .attr("class", "dot")

  const lineGenerator = d3.area()
    .x(d => xScale(xAccessor(d)))
    .y(d => yScale(yAccessor(d)))
    // Let's create a smoother curved line instead of a jagged one
    .curve(d3.curveBasis)

  const line = bounds.append("path")
      .attr("class", "line")
      .attr("d", lineGenerator(dataset))


  // 6. Draw peripherals
  const seasonLabels = bounds.selectAll(".season-label")
      .data(seasonsData)
    .enter().append("text")
      .filter(d => xScale(d.end) - xScale(d.start) > 60)
      .attr("x", d => xScale(d.start) + ((xScale(d.end) - xScale(d.start)) / 2))
      .attr("y", dimensions.boundedHeight + 30)
      .text(d => `${d.name} ${d3.timeFormat("%Y")(d.end)}`) // Season name with year (e.g. "Spring 2018")
      .attr("class", "season-label")

  const yAxisGenerator = d3.axisLeft()
    .scale(yScale)
    // Simply our y axis so that we only see three tick marks for simplicity
    .ticks(3)

  const yAxis = bounds.append("g")
      .attr("class", "y-axis")
    .call(yAxisGenerator)

  const yAxisLabel = yAxis.append("text")
      .attr("y", -dimensions.margin.left + 10)
      .attr("x", -dimensions.boundedHeight / 2)
      .attr("class", "y-axis-label")
      .text("relative humidity")

  // Remove x axis tick marks so we can just display our season names
  // const xAxisGenerator = d3.axisBottom()
  //   .scale(xScale)
  //   .ticks()

  // const xAxis = bounds.append("g")
  //     .attr("class", "x-axis")
  //     .style("transform", `translateY(${dimensions.boundedHeight}px)`)
  //   .call(xAxisGenerator)
}
drawLineChart()

// Let's cut down on the noisiness of our daily data points. This function allows us to pass in our dataset, xAccessor, and yAccessors so that we can receive a downsampled dataset with weekly values instead of daily values.
function downsampleData(data, xAccessor, yAccessor) {
  const weeks = d3.timeWeeks(xAccessor(data[0]), xAccessor(data[data.length - 1]))

  return weeks.map((week, index) => {
    const weekEnd = weeks[index + 1] || new Date()
    const days = data.filter(d => xAccessor(d) > week && xAccessor(d) <= weekEnd)
    return {
      date: d3.timeFormat("%Y-%m-%d")(week),
      humidity: d3.mean(days, yAccessor),
    }
  })
}