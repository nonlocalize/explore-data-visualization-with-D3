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

  // Draw canvas

  // Create scales

  // Draw data

  // Draw peripherals

  // Set up interactions

}
drawMap()