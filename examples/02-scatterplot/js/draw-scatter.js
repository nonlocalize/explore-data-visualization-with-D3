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

  // // Idea 2 - Ta-daaaaa! Here are the dots!!
  // const dots = bounds.selectAll("circle") // Returns an array of matching "circle" elements
  //     .data(dataset)  // Pass our dataset to the selection
  //     .enter()  // Grab the selection of new dots to render (contained in _enter)
  //       .append("circle") // Create a circle element for each new dot(s)
  //         .attr("cx", d => xScale(xAccessor(d)))
  //         .attr("cy", d => yScale(yAccessor(d)))
  //         .attr("r", 5)
  //         // Let's make the dots a lighter color to help them stand out
  //         .attr("fill", "cornflowerblue")

  // EXERCISE 01: Split the dataset in two and draw both parts separately (comment out Idea 2 for the moment)
  function drawDots(dataset, color) {
    const dots = bounds.selectAll("circle").data(dataset)

    // Notice how only the new dots have the supplied color when we call drawDots multiple times?
    // dots
    //   .enter().append("circle")
    //     .attr("cx", d => xScale(xAccessor(d)))
    //     .attr("cy", d => yScale(yAccessor(d)))
    //     .attr("r", 5)
    //     .attr("fill", color)

    // Want to have all of the drawn dots to have the same color?
    // Notice how this example breaks the ability to chain.
    // dots
    //   .enter().append("circle")

    // bounds.selectAll("circle")
    //     .attr("cx", d => xScale(xAccessor(d)))
    //     .attr("cy", d => yScale(yAccessor(d)))
    //     .attr("r", 5)
    //     .attr("fill", color)

    // // Let's have all of the drawn dots have the same color AND use merge() so we can create a chain
    // dots
    //   .enter().append("circle")
    //   .merge(dots)  // Merge already drawn/existing dots with the new ones AND keep our chain going
    //     .attr("cx", d => xScale(xAccessor(d)))
    //     .attr("cy", d => yScale(yAccessor(d)))
    //     .attr("r", 5)
    //     .attr("fill", color)

    // Great news! Since d3-selection version 1.4.0, we can use a join() method - which is a shortcut for running the enter(), append(), merge(), and other methods
    dots.join("circle")
      .attr("cx", d => xScale(xAccessor(d)))
      .attr("cy", d => yScale(yAccessor(d)))
      .attr("r", 5)
      .attr("fill", color)

  }
  // Now let's call this function with a subset of our data
  drawDots(dataset.slice(0, 200), "darkgrey")
  // After one second, let's call this function with our whole dataset and a blue color to distinguish our two sets of dots
  setTimeout(() => {
    drawDots(dataset, "cornflowerblue")
  }, 1000)
  // END EXERCISE 01

  // Draw peripherals

  // x axis
  const xAxisGenerator = d3.axisBottom().scale(xScale)
  // Remember to translate the x axis to move it to the bottom of the chart bounds
  const xAxis = bounds.append("g")
    .call(xAxisGenerator)
      .style("transform", `translateY(${dimensions.boundedHeight}px)`)

  // Label for the x axis
  const xAxisLabel = xAxis.append("text") // Append a text element to our SVG
    .attr("x", dimensions.boundedWidth / 2) // Position it horizontally centered
    .attr("y", dimensions.margin.bottom - 10) // Position it slightly above the bottom of the chart
    // Explicitly set fill to black because D3 sets a fill of none by default on the axis "g" element
    .attr("fill", "black")
    // Style our label
    .style("font-size", "1.4em")
    // Add text to display on label
    .html("Dew point (&deg;F)")

  // y axis
  const yAxisGenerator = d3.axisLeft()
    .scale(yScale)
    // Cut down on visual clutter and aim for a certain number (4) of ticks
    .ticks(4)
    // Note that the resulting axis won't necessarily have exactly 4 ticks. It will aim for four ticks, but also use friendly intervals to get close. You can also specify exact values of ticks with the .ticksValues() method

  const yAxis = bounds.append("g")
    .call(yAxisGenerator)

  // Label for the y axis
  const yAxisLabel = yAxis.append("text")
    // Draw this in the middle of the y axis and just inside the left side of the chart wrapper
    .attr("x", -dimensions.boundedHeight / 2)
    .attr("y", -dimensions.margin.left + 10)
    .attr("fill", "black")
    .style("font-size", "1.4em")
    .text("Relative humidity")
    // Rotate the label to find next to the y axis
    .style("transform", "rotate(-90deg)")
    // Rotate the label around its center
    .style("text-anchor", "middle")

  // Set up interactions

}

drawScatter()

/*
  Did we gain insight into our original question? Yes! We wanted to see if we were correct in guessing that high humidity would likely coincide with a high dew point.

  Looking at the plotted dots, they do seem to group around an invisible line from the bottom left to the top right of the chart.
*/