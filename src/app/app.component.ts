import { Component } from '@angular/core';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RouterOutlet } from '@angular/router';
import { RainbowDirective } from './directives/rainbow.directive';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: true,
    imports: [NavbarComponent, RouterOutlet, RainbowDirective]
})
export class AppComponent {
  title = 'Starting Advanced Topics';
}
