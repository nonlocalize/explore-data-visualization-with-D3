import { Component, Input } from '@angular/core'
import { useAccessor } from '../utils';

@Component({
  selector: '[appBars]',
  template: `
    <svg:rect
      *ngFor="let bar of data; trackBy: keyAccessor"
      [attr.x]="useAccessor(xAccessor, bar, $index)"
      [attr.y]="useAccessor(yAccessor, bar, $index)"
      [attr.width]="max(useAccessor(widthAccessor, bar, $index), 0)"
      [attr.height]="max(useAccessor(heightAccessor, bar, $index), 0)"
      [attr.fill]="fill || '#9980FA'">
    </svg:rect>
  `,
  styleUrls: ['./bars.component.css']
})
export class BarsComponent {
  @Input() data: Object[]
  @Input() keyAccessor: Function
  @Input() xAccessor: Function
  @Input() yAccessor: Function
  @Input() widthAccessor: Function
  @Input() heightAccessor: Function
  @Input() fill?: string
  private useAccessor: Function = useAccessor
  private max = Math.max
}
