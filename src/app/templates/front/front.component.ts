import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RainbowDirective } from '../../directives/rainbow.directive';

@Component({
    selector: 'app-front',
    templateUrl: './front.component.html',
    styleUrls: ['./front.component.css'],
    standalone: true,
    imports: [RouterOutlet, RainbowDirective]
})
export class FrontComponent {

}
