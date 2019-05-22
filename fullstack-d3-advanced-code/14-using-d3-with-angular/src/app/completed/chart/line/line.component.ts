import { Component, Input, OnChanges, SimpleChanges } from '@angular/core'
import * as d3 from "d3"

@Component({
  selector: '[appLine]',
  template: `
    <svg:path
      [ngClass]="type"
      [attr.d]="lineString"
      [style.fill]="fill">
    </svg:path>
  `,
  styleUrls: ['./line.component.css']
})
export class LineComponent implements OnChanges {
  @Input() type: "area" | "line" = "line"
  @Input() data: Object[]
  @Input() xAccessor: Function
  @Input() yAccessor: Function
  @Input() y0Accessor?: Function
  @Input() interpolation?: Function = d3.curveMonotoneX
  @Input() fill?: string
  private lineString: ""

  updateLineString(): void {
    const lineGenerator = d3[this.type]()
    .x(this.xAccessor)
    .y(this.yAccessor)
    .curve(this.interpolation)

    if (this.type == "area") {
      lineGenerator
        .y0(this.y0Accessor)
        .y1(this.yAccessor)
    }

    this.lineString = lineGenerator(this.data)
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.updateLineString()
  }

}
