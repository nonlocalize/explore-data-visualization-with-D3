async function drawMap() {
  // Access data
  const countryShapes = await d3.json('./data/world-geojson.json')
  const countryNameAccessor = d => d.properties['NAME']
  const countryIdAccessor = d => d.properties['ADM0_A3_IS']

  const dataset = await d3.csv('./data/world_bank_data.csv')
  const metric = 'Population growth (annual %)'

  // We want an easy way to look up the population growth using a country name
  let metricDataByCountry = {}
  dataset.forEach(d => {
    if (d['Series Name'] != metric) return
    metricDataByCountry[d['Country Code']] = d['2017 [YR2017]'] || 0
  })

  // Create chart dimensions
  // Height will depend on our projection - which will use a combonation of distortion (stretching parts of the map) and slicing to approximate the Earth's actual shape
  let dimensions = {
    width: window.innerWidth * 0.9,
    margin: {
      top: 10,
      right: 10,
      bottom: 10,
      left: 10,
    },
  }
  dimensions.boundedWidth =
    dimensions.width - dimensions.margin.left - dimensions.margin.right

  // Define our globe using a mock GeoJSON object
  const sphere = { type: 'Sphere' }
  const projection = d3
    .geoEqualEarth() // Each projection function has its own default size (think: range)
    .fitWidth(dimensions.boundedWidth, sphere) // Define our projection to be the same width as our bounds
  const pathGenerator = d3.geoPath(projection) // Generator function to help create our geographical shapes

  // Test
  // console.log(pathGenerator(sphere))  // Gives us a <path> d string

  // // How do we find out how tall that path is? Use the .bounds() method of the pathGenerator
  // console.log(pathGenerator.bounds(sphere))
  // // Returns an array of [x, y] coordinates describing a bounding box for the specified GeoJSON object

  const [[x0, y0], [x1, y1]] = pathGenerator.bounds(sphere)

  // We want the entire Earth to fit without our bounds, so define our boundedHeight to just cover the sphere
  dimensions.boundedHeight = y1
  dimensions.height =
    dimensions.boundedHeight + dimensions.margin.top + dimensions.margin.bottom

  // Draw canvas
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

  // Create scales - The x and y scales are handled by our map projection; we just need a scale to turn metric values into colors
  const metricValues = Object.values(metricDataByCountry) // Grab all of the population growth values
  const metricValueExtent = d3.extent(metricValues) // Extract the smallest and largest values
  // console.log(metricValueExtent)  // ["-0.0267006062623867", "4.669194641437"]

  // Our extent starts below zero, meaning that at least one country experienced negative population growth. Let's represent decline on a red color scale, growth on a green color scale, and neutral as white - a "diverging" color scale. All we need to do is add a middle value to the domain and range.
  const maxChange = d3.max([-metricValueExtent[0], metricValueExtent[1]])
  const colorScale = d3
    .scaleLinear()
    // We are creating a scale which scales evenly on both sides
    .domain([-maxChange, 0, maxChange])
    // ACCESSIBILITY FTW: Why did we choose indigo and darkgreen? Common color blindness is red-green color blindness; this will allow those users to see differences in our color scale
    .range(['indigo', 'white', 'darkgreen'])

  // Draw data

  // Draw the outline of the Earth first (all other elements will cover this outline)
  const earth = bounds
    .append('path')
    .attr('class', 'earth')
    .attr('d', pathGenerator(sphere))

  // Draw a graticule - a grid of latitudinal and longitudinal lines
  const graticuleJson = d3.geoGraticule10() // Generates a classic graticule with lines every 10 degrees
  const graticule = bounds
    .append('path') // pathGenerator() knows how to handle any GeoJSON type
    .attr('class', 'graticule')
    .attr('d', pathGenerator(graticuleJson))

  // Draw our countries
  const countries = bounds
    .selectAll('.country')
    .data(countryShapes.features) // D3 will create one element per item in the dataset we pass in here
    .enter()
    .append('path') // Create a new <path> for each item in our list of countries
    .attr('class', 'country')
    // REMEMBER: .attr("d", pathGenerator) is the same as .attr("d", d => pathGenerator(d))
    .attr('d', pathGenerator)
    .attr('fill', d => {
      const metricValue = metricDataByCountry[countryIdAccessor(d)] // Get the country's ID
      if (typeof metricValue === undefined) return '#e2e6e9' // If we are missing data, return white
      return colorScale(metricValue) // Fill with the value from our colorScale
    })

  // Draw peripherals

  // Map legend
  const legendGroup = wrapper
    .append('g')
    .attr(
      'transform',
      `translate(${120},${
        dimensions.width < 800
          ? dimensions.boundedHeight - 30
          : dimensions.boundedHeight * 0.5
      })`
    )

  const legendTitle = legendGroup
    .append('text')
    .attr('y', -23)
    .attr('class', 'legend-title')
    .text('Population growth')

  const legendByline = legendGroup
    .append('text')
    .attr('y', -9)
    .attr('class', 'legend-byline')
    .text('Percent change in 2017')

  const defs = wrapper.append('defs')
  const legendGradientId = 'legend-gradient'
  const gradient = defs
    .append('linearGradient')
    .attr('id', legendGradientId)
    .selectAll('stop')
    .data(colorScale.range())
    .enter()
    .append('stop')
    .attr('stop-color', d => d)
    .attr(
      'offset',
      (d, i) =>
        `${
          (i * 100) / 2 // 2 is one less than the number of items in our array (3 - 1)
        }%`
    )

  const legendWidth = 120
  const legendHeight = 16
  const legendGradient = legendGroup
    .append('rect')
    .attr('x', -legendWidth / 2)
    .attr('height', legendHeight)
    .attr('width', legendWidth)
    .style('fill', `url(#${legendGradientId})`)

  const legendValueRight = legendGroup
    .append('text')
    .attr('class', 'legend-value')
    .attr('x', legendWidth / 2 + 10)
    .attr('y', legendHeight / 2)
    .text(`${d3.format('.1f')(maxChange)}%`)

  const legendValueLeft = legendGroup
    .append('text')
    .attr('class', 'legend-value')
    .attr('x', -legendWidth / 2 - 10)
    .attr('y', legendHeight / 2)
    .text(`${d3.format('.1f')(-maxChange)}%`)
    .style('text-anchor', 'end')

  // Mark the user's current location
  navigator.geolocation.getCurrentPosition(myPosition => {
    console.log(myPosition)
    // Use our projection to turn our location into a set of x, y coordinates
    const [x, y] = projection([
      myPosition.coords.longitude,
      myPosition.coords.latitude
    ])

    // Draw a circle in that location with an animated radius to attract the user's attention
    const myLocation = bounds.append("circle")
      .attr("class", "my-location")
      .attr("cx", x)
      .attr("cy", y)
      .attr("r", 0)
      .transition().duration(500)
        .attr("r", 10)
  })

  // Set up interactions
  countries
    .on("mouseenter", onMouseEnter)
    .on("mouseleave", onMouseLeave)

  const tooltip = d3.select("#tooltip")

  function onMouseEnter(datum) {  // REMEMBER: datum contains data bound to the hovered element
    tooltip.style("opacity", 1) // Display tooltip

    // Build our tooltip
    const metricValue = metricDataByCountry[countryIdAccessor(datum)]
    tooltip.select("#country").text(countryNameAccessor(datum))
    tooltip.select("#value").text(`${d3.format(",.2f")(metricValue || 0)}`)
  }
  function onMouseLeave() {
    tooltip.style("opacity", 0) // Hide tooltip
  }


}
drawMap()
