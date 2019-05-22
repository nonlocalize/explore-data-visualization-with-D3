import { Component, Input, ViewChild, ElementRef, AfterContentInit, OnChanges, SimpleChanges } from '@angular/core'
import * as d3 from "d3"
import { DimensionsType, ScaleType } from '../utils/types';

@Component({
  selector: 'app-scatter',
  templateUrl: './scatter.component.html',
  styleUrls: ['./scatter.component.css']
})
export class ScatterComponent {
  @Input() data: Array<Object>
  @Input() xLabel: string
  @Input() yLabel: string
  @Input() xAccessor: Function
  @Input() yAccessor: Function
}
