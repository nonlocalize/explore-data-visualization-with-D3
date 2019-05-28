// These default D3 scales have been carefully designed to have enough contrast between colors for us
const d3ColorScales = [{
  // Useful for representing binary or nominal data (e.g. no wind, light wind, breeze, windy, etc)
  title: "Categorical",
  scales: [
      "schemeCategory10",
      "schemeAccent",
      "schemeDark2",
      "schemePaired",
      "schemePastel1",
      "schemePastel2",
      "schemeSet1",
      "schemeSet2",
      "schemeSet3",
  ]
},{
  // Useful for representing continuous data (e.g. temperature, speed) for basic charts or charts with multiple color scales
  title: "Sequential (Single Hue)",
  scales: [
      // To get a color, supply a value between 0 and 1 to d3.interpolateBlues()
      "interpolateBlues",
      // ...or thought of another way, interpolateBlues is a scale with a domain of [0, 1] and a range of [light gray, dark blue]
      "interpolateGreens",
      "interpolateGreys",
      "interpolateOranges",
      "interpolatePurples",
      "interpolateReds",
  ]
},{
  // Useful for representing continuous data (e.g. temperature, speed) where steps in between color values are too small and hard to distinguish
  title: "Sequential (Multi-Hue)",
  scales: [
      "interpolateBuGn",
      "interpolateBuPu",
      "interpolateGnBu",
      "interpolateOrRd",
      "interpolatePuBuGn",
      "interpolatePuBu",
      "interpolatePuRd",
      "interpolateRdPu",
      "interpolateYlGnBu",
      "interpolateYlGn",
      "interpolateYlOrBr",
      "interpolateYlOrRd",
  ]
},{
  // Useful for highlighting both the lowest and highest metric values (e.g. lowest temperature and highest temperature). Diverging scales start and end with very saturated/dark color and run through a less intense middle range.
  title: "Diverging",
  scales: [
      "interpolateBrBG",
      "interpolatePRGn",
      "interpolatePiYG",
      "interpolatePuOr",
      "interpolateRdBu",
      "interpolateRdGy",
      "interpolateRdYlBu",
      "interpolateRdYlGn",
      "interpolateSpectral",
  ]
  },{
  // Useful for creating discrete color schemes with many colors
  title: "Cyclical",
  scales: [
      "interpolateRainbow",
      "interpolateSinebow",
  ]
}]
