import { Component, inject } from '@angular/core';
import { Cv } from '../cv/model/cv';
import { catchError, Observable, of } from 'rxjs';
import { CvService } from '../cv/services/cv.service';
import { ToastrService } from 'ngx-toastr';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ItemComponent } from '../cv/item/item.component';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-master-detail-cv',
  standalone: true,
  imports: [RouterOutlet, RouterLinkActive, CommonModule, RouterLink, ItemComponent],
  templateUrl: './master-detail-cv.component.html',
  styleUrl: './master-detail-cv.component.css',
})
export class MasterDetailCvComponent {
  private cvService = inject(CvService);
  private toastr = inject(ToastrService);

  cvs = toSignal(this.cvService.getCvs(), { initialValue: []});
}
