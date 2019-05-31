# Welcome

This project was inspired by work from the book [Fullstack D3 and Data Visualization](https://www.fullstack.io/fullstack-d3).

## Example 01: Display the maximum temperature per day in Seattle over the past year

![screenshots/example-01.png](screenshots/example-01.png)

## Example 02: Display a scatterplot comparing relative humidity to the dew point

![screenshots/example-02.png](screenshots/example-02.png)

## Example 03: Display a histogram for humidity levels in Seattle

### Simple histogram

![screenshots/example-03a.png](screenshots/example-03a.png)

### Generalize our histogram to display graphs for a variety of Seattle weather metrics

![screenshots/example-03b.gif](screenshots/example-03b.gif)

### Accessibility enhancements for our histogram charts

Once the user has loaded this example and has a screen reader active, they immediately will hear the page title - “Example oh-three - making a bar chart.”

When they tab into a component, they hear - “Histogram looking at the distribution of ${metric} in Seattle over the past year.”

![screenshots/example-03c.png](screenshots/example-03c.png)

When they tab into a group of bars, they hear - "Histogram bars. List with sixteen items."

If an item is selected with a tab or by interacting with it directly, the user will hear something like “There were thirty-three days between point five and one WindSpeed levels.”

![screenshots/example-03d.png](screenshots/example-03d.png)

## Example 04: Animations and Transitions

### Demo 1: SVG animate

Quick demo on using the `<animate>` element within an SVG. This is a crude animation technique, and requires static start and end details for the target SVG.

![screenshots/example-4a.gif](screenshots/example-04a.gif)

### Demo 2: CSS transition playground

Simple demo to animate an SVG asset with CSS transitions.

![screenshots/example-4b.gif](screenshots/example-04b.gif)

### Demo 3a: Draw bars with CSS transition

Example using CSS transitions for animating our bars and the mean line.

![screenshots/example-4c.gif](screenshots/example-04c.gif)

### Demo 3b: Draw bars with D3 transition

This example demonstrates how we can color new bars that need to be added to the chart in green as well as color bars in red that are ready to be removed.

One thing that we can do with D3 transitions that we could not do with CSS transitions is smoothly animate our axis and its related tick marks.

![screenshots/example-4d.gif](screenshots/example-04d.gif)

### Demo 4: Draw line

This uses a dataset that is constantly updating over time - including applying advanced techniques such as using a `clip-path` to make sure we are not drawing data outside of domain.

![screenshots/example-4e.gif](screenshots/example-04e.gif)

### Demo 5: Draw scatter

This example was not in the book, but the code sample was worth incorporating to see how we might look at animating a scatterplot when data is updated.

![screenshots/example-4f.gif](screenshots/example-04f.gif)

## Example 05: Interactions

### Demo 1: Events

This example uses D3 to add `mouseenter` and `mouseout` events to SVG elements - and removes them 3 seconds later.

![screenshots/example-5a.gif](screenshots/example-05a.gif)

One optimization here was to make sure our rectangles were not left in a hovered state by dispatching a `mouseout` event before removing the event listeners.

### Demo 2: Bars

Adding a tooltip to our histogram bar chart.

![screenshots/example-5b.gif](screenshots/example-05b.gif)

### Demo 3: Scatter

Instead of forcing the user to hover on a small target dot for a tooltip, this example employs the use of a [Voronoi diagram](https://en.wikipedia.org/wiki/Voronoi_diagram) to create polygons users can hover over to display the tooltip - as well as drawing a larger dot to emphasize the specific data point being viewed.

Here is an example with the generated [Voronoi diagram](https://en.wikipedia.org/wiki/Voronoi_diagram) visible to the user:

![screenshots/example-5c.gif](screenshots/example-05c.gif)

Here is an example with the generated [Voronoi diagram](https://en.wikipedia.org/wiki/Voronoi_diagram) that is not visible to the user:

![screenshots/example-5d.gif](screenshots/example-05d.gif)

### Demo 4: Line

Instead of forcing the user to hover on specific points on the line graph, this example draws a transparent `rect` over the entire chart; allowing the user to have a tooltip displayed when they hover anywhere on the graph.

![screenshots/example-5e.gif](screenshots/example-05e.gif)

## Example 06: Making a map

### Introduction to GeoJSON

This section starts off with an overview of [GeoJSON](https://tools.ietf.org/html/rfc7946) - a format used to represent geographic structures.

Start off using [Natural Earth](https://www.naturalearthdata.com) - which is a great source for public domain map data. Download the [Admin 0 - Countries](https://www.naturalearthdata.com/downloads/50m-cultural-vectors/50m-admin-0-countries-2/) dataset.

This download will contain various formats. We are interested in the shapefiles - extensions `shp` and `shx`. We can use a tool such as [GDAL](http://trac.osgeo.org/gdal/wiki/DownloadingGdalBinaries) - Geographic Data Abstraction Library - to convert our shapefile into a JSON file.

#### Geographic Data Abstraction Library (GDAL)

##### Installation on macOS

If you're on a computer running macOS Mojave, the first thing you should do is ensure you have the latest `homebrew` installed:

```sh
$ /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

Next, install gdal. This will take a few minutes to build, so take a moment and treat yourself to a beverage of your choosing:

```sh
$ brew install gdal
```

##### Convert shapefile to JSON

To convert a shapefile to a JSON file containing GeoJSON data:

```sh
$ ogr2ogr -f GeoJSON ./path/to/target.json ./path/to/source.shp
```

In this example, we are going to run the following commands:

```sh
$ cd examples/06-making-a-map/data/
$ ogr2ogr -f GeoJSON ./world-geojson.json ./ne_50m_admin_0_countries.shp
```

### Draw map

I have downloaded a dataset from [The World Bank](https://databank.worldbank.org/data/source/world-development-indicators#) as a CSV file to view the population growth metric - available at `examples/06-making-a-map/data/world_bank_data.csv`

Here is an example of drawing a map using a `geoEqualEarth` projection without any custom fill.

![screenshots/example-06a.png](screenshots/example-06a.png)

Here is an example of drawing a map using a `geoEqualEarth` projection and coloring countries according to the rate of population growth in 2017 from The World Bank.

![screenshots/example-06b.png](screenshots/example-06b.png)

This is the finished example which includes drawing an animated circle for the user's location (if they give permission), creating a legend with a gradient, and tooltip that appears over the center of the country the user has hovered over.

![screenshots/example-6c.gif](screenshots/example-06c.gif)

## Example 07: Data visualization basics

### Demo 1: Redesign humidity chart

This design revamp displays relative humidity with the following enhancements:

+ Improve readability of our chart
  - Simplified Y axis with a reduced number of tick marks
  - Display of an inline Y axis label instead of creating a hard to read rotate text label on the left side of our chart
  - Smooth, curved lines for the data points instead of a jagged line
  - Use of dots to indicate original data point values
  - Drawing rectangles for seasons corresponding to our data
  - Drawing a season mean line to quickly compare relative humidity for each season in our data set
  - Simplfied X axis to display season and year details

![screenshots/example-07a.png](screenshots/example-07a.png)

### Demo 2: Color scales

This example contains a number of quick and easy references for generating color scales using D3.

![screenshots/example-07b.png](screenshots/example-07b.png)

## Example 08: Common charts

### Demo 1: Timeline

![screenshots/example-08a.png](screenshots/example-08a.png)

### Demo 2: Heatmap

![screenshots/example-08b.gif](screenshots/example-08b.gif)

### Demo 3: Radar

![screenshots/example-08c.png](screenshots/example-08c.png)

### Demo 4: Scatter

![screenshots/example-08d.png](screenshots/example-08d.png)

### Demo 5: Pie

![screenshots/example-08e.png](screenshots/example-08e.png)

### Demo 6: Histogram

![screenshots/example-08f.png](screenshots/example-08f.png)

### Demo 7: Box plot

The box plot is quite an advanced visualization.

> The middle line represents the median (the middle value) and the box covers values from the 25th percentile (25% of values are lower) to the 75th percentile (75% of values are lower). The “whiskers” extend 1.5 times the inter-quartile range (IQR) from the median in either direction. By IQR, we mean the difference between the 25th and 75th percentiles. Any outliers that lie outside of the whiskers are shown as dots.

Excerpt From: Nate Murray. “Fullstack Data Visualization with D3.” Apple Books.

![screenshots/example-08g.png](screenshots/example-08g.png)

## Example 09: Dashboard design

This example focused on effectively formatting and styling a table for an optimal user experience including:

+ Easy to read numbers
+ Equally spaced characters for our custom font
+ Using symbols to indicate
  - The UV index
  - Whether it snowed or not on a particular day
+ Color scales to indicate
  - Temperature (blue to red)
  - Wind speed (white to slate gray)
+ A visual indicator of approximately what point in the day the maximum temperature was recorded

![screenshots/example-09a.png](screenshots/example-09a.png)

## Example 10: Marginal histogram

This example enhances our original scatterplot with:

+ Generating an appropriate color scale to display our dots
+ Adding histograms to the top and right of the chart indicating where a value falls in the overall distribution of our dataset
+ Breaking our color scale into segments that only show the relevant dots

![screenshots/example-10.gif](screenshots/example-10.gif)

## Example 11: Radar weather chart
