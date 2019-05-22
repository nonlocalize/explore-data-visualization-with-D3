async function drawScatter () {
  const pathToJSON = "./../data/seattle_wa_weather_data.json"

  // Access data
  const dataset = await d3.json(pathToJSON)
  const xAccessor = d => d.dewPoint
  const yAccessor = d => d.humidity

  // Create chart dimensions
  // REMEMBER: For scatter plots, we typically want square charts so axes do not appear squished
  //           In this example, we want to use whatever is smaller - the width or height of our chart area.
  //
  // d3.min() offers a whole host of benefits/safeguards; which is why it is preferable when creating charts
  const width = d3.min([window.innerWidth * 0.9, window.innerHeight * 0.9])

  let dimensions = {
    width: width,
    height: width,
    margin: {
      top: 10,
      right: 10,
      bottom: 50,
      left: 50,
    },
  }
  dimensions.boundedWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right
  dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom

  // Draw canvas
  const wrapper = d3.select("#wrapper")
    .append("svg")
      // Note that these width and height sizes are the size "outside" of our plot
      .attr("width", dimensions.width)
      .attr("height", dimensions.height)

  const bounds = wrapper.append("g")
    // Create a group element to move the inner part of our chart to the right and down
    .style("transform", `translate(${
      dimensions.margin.left
    }px, ${
      dimensions.margin.top
    }px)`)

  // Create scales
  const xScale = d3.scaleLinear()
    .domain(d3.extent(dataset, xAccessor))  // Find the min and max values
    .range([0, dimensions.boundedWidth])    // Display values appropriately
    // Current scale would be [8.19, 58.38] - let's use .nice() to make a friendlier scale
    .nice()
    // Now our scale is [5, 60] - offering better readability and avoiding smushing dots to the edge

  const yScale = d3.scaleLinear()
    .domain(d3.extent(dataset, yAccessor))  // Find the min and max values
    .range([dimensions.boundedHeight, 0])   // Invert the range so the axis runs bottom-to-top
    // Current scale would be [0.27, 0.93] - let's use .nice() to make a friendlier scale
    .nice()
    // Now our scale is [0.25, 0.95] - offering better readability and avoiding smushing dots to the edge

  // Draw data
  // REMEMBER: For scatter plots, we want one element per data point - not a line that covers all data points
  //  We will use the <circle> SVG element - setting x, y, and the radius (half of its width or height)

  // // Test circle
  // bounds.append("circle")
  //   .attr("cx", dimensions.boundedWidth / 2)
  //   .attr("cy", dimensions.boundedHeight / 2)
  //   .attr("r", 5)

  // // Idea 1 - Naively map over each element in the dataset and append a circle to our bounds
  // dataset.forEach(d => {
  //   bounds
  //     .append("circle")
  //     .attr("cx", xScale(xAccessor(d)))
  //     .attr("cy", yScale(yAccessor(d)))
  //     .attr("r", 5)
  // })
  // // ...so what's the problem? We are adding a level of nesting, making our code harder to follow. The bigger issue, though, is that if we run this function multiple times, we'll end up drawing multiple sets of dots. When we start updating charts, we'll want to draw and update our data with the same code to prevent repeating ourselves.

  // Let's handle the dots without using a loop.
  // const dots = bounds.selectAll("circle") // Returns an array of matching "circle" elements
  //   // ...but wait. We don't have any dots yet! Why are we doing this? We want this selection to be aware of dots that already exist
  //   .data(dataset)  // Pass our dataset to the selection
  //   // This joins our selected elements with our array of data points. The returned selection will have a list of existing elements, new elements that need to be added, and old elements that need to be removed

  /* WAIT! Let's understand what's going on here. When we join our current dots with our data, we will have
  the following keys to look at:
    Existing dots -> These will be contained in the _groups key
    New dots to render -> These will be contained in the _enter key
    Dots to remove because their data points are not in the dataset -> These will be contained in the _exit key

    // Prove this!
    let theDots = bounds.selectAll("circle")
    console.log(theDots)  // Notice how _groups is an array with an empty node list; no dots exist
    theDots = theDots.data(dataset) // Bind our dataset
    console.log(theDots)  // Notice how _enter has an array of 365 items; and _groups now has an array of 365 items
  */

  // Idea 2 - Ta-daaaaa! Here are the dots!!
  const dots = bounds.selectAll("circle") // Returns an array of matching "circle" elements
      .data(dataset)  // Pass our dataset to the selection
      .enter()  // Grab the selection of new dots to render (contained in _enter)
        .append("circle") // Create a circle element for each new dot(s)
          .attr("cx", d => xScale(xAccessor(d)))
          .attr("cy", d => yScale(yAccessor(d)))
          .attr("r", 5)
          // Let's make the dots a lighter color to help them stand out
          .attr("fill", "cornflowerblue")

  // Draw peripherals

  // Set up interactions

}

drawScatter()