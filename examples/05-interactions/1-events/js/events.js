async function createEvent() {
  const rectColors = [
    "yellowgreen",
    "cornflowerblue",
    "seagreen",
    "slateblue",
  ]

  // create and bind data to our rects
  const rects = d3.select("#svg")
    .selectAll(".rect")
    .data(rectColors)
    // For all new data points, append a rect
    .enter().append("rect")
      .attr("height", 100)
      .attr("width", 100)
      .attr("x", (d,i) => i * 110)
      .attr("fill", "lightgrey")

  // Let's inspect a D3 event listener
  rects.on("mouseenter", function(datum, index, nodes) {
    // Use ES6 object property shorthand for logging multiple variables
    console.log({datum, index, nodes})
    /*
      {"datum":"yellowgreen","index":0,"nodes":Array(4)}
      {"datum":"cornflowerblue","index":1,"nodes":Array(4)}
      {"datum":"seagreen","index":2,"nodes":Array(4)}
      {"datum":"slateblue","index":3,"nodes":Array(4)}
    */

    // Aha! this automatically points at the DOM element that triggered the event; no need to find its index
    console.log(this) // <rect height="100" width="100" x="220" fill="lightgrey"></rect>
  })

}
createEvent()