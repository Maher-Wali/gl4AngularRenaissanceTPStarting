import { Component, input, inject } from '@angular/core';
import { Cv } from '../model/cv';
import { EmbaucheService } from '../services/embauche.service';
import { ToastrService } from 'ngx-toastr';

import { RouterLink } from '@angular/router';
import { DefaultImagePipe } from '../pipes/default-image.pipe';

@Component({
    selector: 'app-cv-card',
    templateUrl: './cv-card.component.html',
    styleUrls: ['./cv-card.component.css'],
    standalone: true,
    imports: [
    RouterLink,
    DefaultImagePipe
],
})
export class CvCardComponent {
  private embaucheService = inject(EmbaucheService);
  private toastr = inject(ToastrService);

  // Using signal-based input (Angular 18+)
  cv = input<Cv | null>(null);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  embaucher() {
    const currentCv = this.cv();
    if (currentCv) {
      if (this.embaucheService.embauche(currentCv)) {
        this.toastr.success(
          `${currentCv.firstname} ${currentCv.name} a été pré embauché`
        );
      } else {
        this.toastr.warning(
          `${currentCv.firstname} ${currentCv.name} est déjà pré embauché`
        );
      }
    }
  }
}
