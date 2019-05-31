import React from "react"
import PropTypes from "prop-types"
import * as d3 from "d3"

import Chart from "./completed/Chart/Chart"
import Line from "./completed/Chart/Line"
import Axis from "./Chart/Axis-naive"
import Gradient from "./Chart/Gradient";
import { useChartDimensions, accessorPropsType, useUniqueId } from "./Chart/utils";

const formatDate = d3.timeFormat("%-b %-d")
const gradientColors = ["rgb(226, 222, 243)", "#f8f9fa"]

const Timeline = ({ data, xAccessor, yAccessor, label }) => {
  const [ref, dimensions] = useChartDimensions()

  const xScale = d3.scaleTime()
    .domain(d3.extent(data, xAccessor))
    .range([0, dimensions.boundedWidth])
  
  const yScale = d3.scaleLinear()
    .domain(d3.extent(data, yAccessor))
    .range([dimensions.boundedHeight, 0])
    .nice()

  const xAccessorScaled = d => xScale(xAccessor(d))
  const yAccessorScaled = d => yScale(yAccessor(d))
  // const y0AccessorScaled = yScale(yScale.domain()[0])
  
  return (
    <div className="Timeline" ref={ref}>
      <Chart dimensions={dimensions}>
        <Axis
          dimension="x"
          scale={xScale}
          formatTick={formatDate}
        />
        <Axis
          dimension="y"
          scale={yScale}
          label={label}
        />
        <Line
          data={data}
          xAccessor={xAccessorScaled}
          yAccessor={yAccessorScaled}
        />
      </Chart>
    </div>
  )
}

Timeline.propTypes = {
  data: PropTypes.array,
  xAccessor: accessorPropsType,
  yAccessor: accessorPropsType,
  label: PropTypes.string,
}

Timeline.defaultProps = {
  xAccessor: d => d.x,
  yAccessor: d => d.y,
}

export default Timeline
