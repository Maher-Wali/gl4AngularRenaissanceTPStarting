import { Directive, ElementRef, HostBinding, signal, effect } from '@angular/core';
@Directive({
  selector: 'input[appRainbow]',
  standalone: true
})
export class RainbowDirective {

  private colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];

  @HostBinding('style.color') color!: string;
  @HostBinding('style.borderColor') borderColor!: string;

  colorSignal = signal('black');

  constructor(private el: ElementRef<HTMLInputElement>) {
    effect(() => {
      this.color = this.colorSignal();
      this.borderColor = this.colorSignal();
    });
    el.nativeElement.addEventListener('keyup', () => {
      this.colorSignal.set(this.colors[Math.floor(Math.random() * this.colors.length)]);
    });
  }

}
