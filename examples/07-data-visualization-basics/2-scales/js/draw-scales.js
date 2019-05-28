const contents = d3.select("#contents")

// Use our d3ColorScales constant to review built-in D3 color scales
d3ColorScales.map(type => {
  const container = contents.append("div")
      .attr("class", "scale-type")

  container.append("h3")
      .text(type.title)

  type.scales.map(scaleName => {
    container.append("div")
        .text(scaleName)

    const colorScale = d3[scaleName]
    drawColorRange(container, colorScale, scaleName)
  })
})

// create custom scales group
const customScalesContainer = contents.append("div")
    .attr("class", "scale-type")

customScalesContainer.append("h3")
    .text("Custom")

// Helper function to add a custom scale to our chart
const addCustomScale = (name, scale) => {
  customScalesContainer.append("div")
      .text(name)

  drawColorRange(customScalesContainer, scale, name)
}

const interpolateWithSteps = numberOfSteps => new Array(numberOfSteps).fill(null).map((d, i) => i / (numberOfSteps - 1))

// We can create our own custom scales by supplying a starting and ending color to d3.interpolateXXX() functions
addCustomScale(
  "interpolate-rgb",
  d3.interpolateRgb("cyan", "tomato"),
)

addCustomScale(
  "interpolate-hsl",
  d3.interpolateHsl("cyan", "tomato"),
)

addCustomScale(
  "interpolate-hcl",
  d3.interpolateHcl("cyan", "tomato"),
)

addCustomScale(
  "interpolate-hcl-steps",
  interpolateWithSteps(6).map(  // Generates five colors
    d3.interpolateHcl("cyan", "tomato")
  )
)

addCustomScale(
  "interpolate-rainbow-steps",
  interpolateWithSteps(10).map( // Generates nine colors
    d3.interpolateRainbow
  )
)
