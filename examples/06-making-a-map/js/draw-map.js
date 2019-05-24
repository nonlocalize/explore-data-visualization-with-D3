async function drawMap() {
  // Access data
  const countryShapes = await d3.json("./data/world-geojson.json")
  const countryNameAccessor = d => d.properties["NAME"]
  const countryIdAccessor = d => d.properties["ADM0_A3_IS"]

  const dataset = await d3.csv("./data/world_bank_data.csv")
  const metric = "Population growth (annual %)"

  // We want an easy way to look up the population growth using a country name
  let metricDataByCountry = {}
  dataset.forEach(d => {
    if (d["Series Name"] != metric) return
    metricDataByCountry[d["Country Code"]] = d["2017 [YR2017]"] || 0
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
  dimensions.boundedWidth = dimensions.width

  // Define our globe using a mock GeoJSON object
  const sphere = ({ type: "Sphere" })
  const projection = d3.geoEqualEarth() // Each projection function has its own default size (think: range)
    .fitWidth(dimensions.boundedWidth, sphere)  // Define our projection to be the same width as our bounds
  const pathGenerator = d3.geoPath(projection)  // Generator function to help create our geographical shapes

  // Test
  // console.log(pathGenerator(sphere))  // Gives us a <path> d string

  // // How do we find out how tall that path is? Use the .bounds() method of the pathGenerator
  // console.log(pathGenerator.bounds(sphere))
  // // Returns an array of [x, y] coordinates describing a bounding box for the specified GeoJSON object

  const [[x0, y0], [x1, y1]] = pathGenerator.bounds(sphere)

  // We want the entire Earth to fit without our bounds, so define our boundedHeight to just cover the sphere
  dimensions.boundedHeight = y1
  dimensions.height = dimensions.boundedHeight

  // Draw canvas
  const wrapper = d3.select("#wrapper")
    .append("svg")
      .attr("width", dimensions.width)
      .attr("height", dimensions.height)

  const bounds = wrapper.append("g")
    .style("transform", `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`)

  // Create scales - The x and y scales are handled by our map projection; we just need a scale to turn metric values into colors
  const metricValues = Object.values(metricDataByCountry) // Grab all of the population growth values
  const metricValueExtent = d3.extent(metricValues) // Extract the smallest and largest values
  // console.log(metricValueExtent)  // ["-0.0267006062623867", "4.669194641437"]

  // Our extent starts below zero, meaning that at least one country experienced negative population growth. Let's represent decline on a red color scale, growth on a green color scale, and neutral as white - a "diverging" color scale. All we need to do is add a middle value to the domain and range.
  const maxChange = d3.max([-metricValueExtent[0], metricValueExtent[1]])
  const colorScale = d3.scaleLinear()
    // We are creating a scale which scales evenly on both sides
    .domain([-maxChange, 0, maxChange])
    // ACCESSIBILITY FTW: Why did we choose indigo and darkgreen? Common color blindness is red-green color blindness; this will allow those users to see differences in our color scale
    .range(["indigo", "white", "darkgreen"])

  // Draw data

  // Draw the outline of the Earth first (all other elements will cover this outline)
  const earth = bounds.append("path")
    .attr("class", "earth")
    .attr("d", pathGenerator(sphere))

  // Draw a graticule - a grid of latitudinal and longitudinal lines
  const graticuleJson = d3.geoGraticule10() // Generates a classic graticule with lines every 10 degrees
  const graticule = bounds.append("path")   // pathGenerator() knows how to handle any GeoJSON type
    .attr("class", "graticule")
    .attr("d", pathGenerator(graticuleJson))

  // Draw our countries
  const countries = bounds.selectAll(".country")
    .data(countryShapes.features) // D3 will create one element per item in the dataset we pass in here
    .enter().append("path")       // Create a new <path> for each item in our list of countries
      .attr("class", "country")
      // REMEMBER: .attr("d", pathGenerator) is the same as .attr("d", d => pathGenerator(d))
      .attr("d", pathGenerator)
      .attr("fill", d => {
        const metricValue = metricDataByCountry[countryIdAccessor(d)] // Get the country's ID
        if (typeof metricValue === undefined) return "#e2e6e9"  // If we are missing data, return white
        return colorScale(metricValue)  // Fill with the value from our colorScale
      })

  // Draw peripherals

  // Set up interactions

}
drawMap()