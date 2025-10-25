import { Component, inject, signal, effect } from "@angular/core";
import { Cv } from "../model/cv";
import { LoggerService } from "../../services/logger.service";
import { ToastrService } from "ngx-toastr";
import { CvService } from "../services/cv.service";
import { ListComponent } from "../list/list.component";
import { CvCardComponent } from "../cv-card/cv-card.component";
import { EmbaucheComponent } from "../embauche/embauche.component";
import { UpperCasePipe, DatePipe } from "@angular/common";
import { toSignal } from "@angular/core/rxjs-interop";
import { catchError, of } from "rxjs";

@Component({
    selector: "app-cv",
    templateUrl: "./cv.component.html",
    styleUrls: ["./cv.component.css"],
    standalone: true,
    imports: [
        ListComponent,
        CvCardComponent,
        EmbaucheComponent,
        UpperCasePipe,
        DatePipe,
    ],
})
export class CvComponent {
  private logger = inject(LoggerService);
  private toastr = inject(ToastrService);
  cvService = inject(CvService);

  // Convert to signals
  cvs = toSignal(
    this.cvService.getCvs().pipe(
      catchError(() => {
        this.toastr.error(`
          Attention!! Les données sont fictives, problème avec le serveur.
          Veuillez contacter l'admin.`);
        return of(this.cvService.getFakeCvs());
      })
    ),
    { initialValue: [] as Cv[] }
  );

  // Reference to the service's selectedCv signal
  selectedCv = this.cvService.selectedCv;
  
  date = new Date();

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {
    this.logger.logger("je suis le cvComponent");
    this.toastr.info("Bienvenu dans notre CvTech");
  }
}
