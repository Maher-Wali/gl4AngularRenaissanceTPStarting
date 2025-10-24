import { Component, inject } from '@angular/core';
import { EmbaucheService } from '../services/embauche.service';

import { ItemComponent } from '../item/item.component';

@Component({
    selector: 'app-embauche',
    templateUrl: './embauche.component.html',
    styleUrls: ['./embauche.component.css'],
    standalone: true,
    imports: [
    ItemComponent
],
})
export class EmbaucheComponent {
  private embaucheService = inject(EmbaucheService);

  // Reference to the service's signal (readonly)
  embauchees = this.embaucheService.getEmbauchees();

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);
  constructor() {}
}
