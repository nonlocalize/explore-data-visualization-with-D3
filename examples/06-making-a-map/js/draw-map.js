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
  // WORK IN PROGRESS: Hold off on height for now; it will depend on our projection - which will use a combonation of distortion (stretching parts of the map) and slicing to approximate the Earth's actual shape
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

  // Draw canvas

  // Create scales

  // Draw data

  // Draw peripherals

  // Set up interactions

}
drawMap()