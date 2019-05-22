import { Component, Input, ViewChild, ElementRef, AfterContentInit, OnChanges, SimpleChanges } from '@angular/core'
import * as d3 from "d3"
import { getUniqueId } from '../chart/utils'
import { DimensionsType, ScaleType } from '../../utils/types'

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css'],
  host: {
    '(window:resize)': 'onResize($event)'
  }
})
export class TimelineComponent implements AfterContentInit, OnChanges {
  @Input() data: Array<Object>
  @Input() label: string
  @Input() xAccessor: Function
  @Input() yAccessor: Function
  private dimensions: DimensionsType
  private xScale: ScaleType
  private yScale: ScaleType
  private xAccessorScaled: Function
  private yAccessorScaled: Function
  private y0AccessorScaled: Function
  private formatDate: Function = d3.timeFormat("%-b %-d")
  private gradientId: string = getUniqueId("Timeline-gradient")
  private gradientColors: string[] = ["rgb(226, 222, 243)", "#f8f9fa"]
  @ViewChild('container') container: ElementRef

  constructor() {
    this.dimensions = {
      marginTop: 40,
      marginRight: 30,
      marginBottom: 75,
      marginLeft: 75,
      height: 300,
      width: 600,
    }
    this.dimensions = {
      ...this.dimensions,
      boundedHeight: Math.max(this.dimensions.height
        - this.dimensions.marginTop
        - this.dimensions.marginBottom, 0),
      boundedWidth: Math.max(this.dimensions.width
        - this.dimensions.marginLeft
        - this.dimensions.marginRight, 0),
    }
  }

  updateDimensions() {
    const width = this.container.nativeElement.offsetWidth
    this.dimensions.width = this.container.nativeElement.offsetWidth
    this.dimensions.boundedWidth = Math.max(
      this.dimensions.width
        - this.dimensions.marginLeft
        - this.dimensions.marginRight,
      0
    )
    this.updateScales()
  }

  ngAfterContentInit() {
    this.updateDimensions()
  }

  onResize() {
    this.updateDimensions()
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.updateScales()
  }

  updateScales() {
    this.xScale = d3.scaleTime()
      .domain(d3.extent(this.data, this.xAccessor))
      .range([0, this.dimensions.boundedWidth])

    this.yScale = d3.scaleLinear()
      .domain(d3.extent(this.data, this.yAccessor))
      .range([this.dimensions.boundedHeight, 0])
      .nice()

    this.xAccessorScaled = d => this.xScale(this.xAccessor(d))
    this.yAccessorScaled = d => this.yScale(this.yAccessor(d))
    this.y0AccessorScaled = this.yScale(this.yScale.domain()[0])
  }

}
