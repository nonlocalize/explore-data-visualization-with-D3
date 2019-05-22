import { Component, Input } from '@angular/core'

@Component({
  selector: '[appCircles]',
  template: `
    <svg:circle
      *ngFor="let circle of data; trackBy: keyAccessor"
      [attr.cx]="xAccessor(circle, $index)"
      [attr.cy]="yAccessor(circle, $index)"
      [attr.r]="radius">
    </svg:circle>
  `,
  styleUrls: ['./circles.component.css']
})
export class CirclesComponent {
  @Input() data: Object[]
  @Input() keyAccessor: Function
  @Input() xAccessor: Function
  @Input() yAccessor: Function
  @Input() radius?: number = 5
}
