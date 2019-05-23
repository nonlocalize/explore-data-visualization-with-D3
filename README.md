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



### Demo 2: Bars



### Demo 3: Scatter



### Demo 4: Line


