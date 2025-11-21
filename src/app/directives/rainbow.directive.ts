import { Directive, ElementRef, HostBinding } from '@angular/core';
import { fromEvent } from 'rxjs';

@Directive({
  selector: 'input[appRainbow]',
})
export class RainbowDirective {

  private colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];

    @HostBinding('style.color') color!: string;
    @HostBinding('style.borderColor') borderColor!: string;

  constructor(private el: ElementRef<HTMLInputElement>) {
    fromEvent(el.nativeElement, 'keyup').subscribe(() => this.setRandomColor());
    this.setRandomColor();
  }

  private setRandomColor() {
    const randomColor = this.colors[Math.floor(Math.random() * this.colors.length)];
    this.color = randomColor;
    this.borderColor = randomColor;
    console.log('text and border color: ', randomColor);
  }
}
