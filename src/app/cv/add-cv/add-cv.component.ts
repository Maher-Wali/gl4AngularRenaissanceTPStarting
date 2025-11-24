import { Component, EventEmitter, Output } from "@angular/core";
import { AbstractControl, FormBuilder, Validators } from "@angular/forms";
import { CvService } from "../services/cv.service";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { APP_ROUTES } from "src/config/routes.config";
import { Cv } from "../model/cv";
import { cinUniqueValidator } from "../validators/cin-unique.validator";
import { cinAgeCorrelationValidator } from "../validators/cin-age.validator";

@Component({
  selector: "app-add-cv",
  templateUrl: "./add-cv.component.html",
  styleUrls: ["./add-cv.component.css"],
})
export class AddCvComponent {
  draftRestored = false;
  disableImageUpload = false;

  form = this.formBuilder.group({
    name: ["", Validators.required],
    firstname: ["", Validators.required],
    path: [""],
    job: ["", Validators.required],
    cin: ["", [Validators.required, Validators.pattern("[0-9]{8}")]],
    age: [0, Validators.required],
  });

  constructor(
    private cvService: CvService,
    private router: Router,
    private toastr: ToastrService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    // Restaurer brouillon
    const saved = localStorage.getItem("cvDraft");
    if (saved) {
      //setValue oblige que tous les champs soient présents , sinon erreur 
      //patchValue remplit le formulaire avec cet objet sans exiger que tous les champs soient présents
      this.form.patchValue(JSON.parse(saved));
      this.draftRestored = true;

      // Masquer le message après 3 secondes
      setTimeout(() => {
        this.draftRestored = false;
      }, 3000);
    }

    // Sauvegarde automatique
    // this.form.valueChanges: c’est un Observable d’Angular
    // Il émet un nouvel événement chaque fois qu’un champ du formulaire change.
    // Dès que l’utilisateur modifie quoi que ce soit → valueChanges est déclenché.
    //.subscribe : On s’abonne à ces changements.
    // valueChanges() = Cold Observable

    // Le formulaire existe déjà, mais les événements de changement ne sont pas émis dans le vide.

    // Les événements(input, change, etc.) ne sont capturés que lorsqu’un abonnement est actif →
    //  donc c’est bien cold.

    // Si tu t’abonnes après un changement, tu ne reçois pas les anciennes valeurs,
    // ce qui est normal pour un cold stream.
    
    this.form.valueChanges.subscribe((value) => {
      localStorage.setItem("cvDraft", JSON.stringify(value));
    });

    // Bloquer path si âge < 18
    this.age.valueChanges.subscribe((ageValue) => {
      if (ageValue < 18) {
        this.disableImageUpload = true;
        this.path?.disable(); // équivalent à this.path.disable({ emitEvent: true });
        this.path?.setValue("");
      } else {
        this.disableImageUpload = false;
        this.path?.enable();
      }
    });

    // Vérifier l’état initial si brouillon contient un âge < 18
    const initialAge = this.form.get("age")?.value;
    if (!initialAge) return

    if (initialAge < 18) {
      this.disableImageUpload = true;
      this.path?.disable();
    }
  }

  addCv() {
    this.cvService.addCv(this.form.value as Cv).subscribe({
      next: (cv) => {
        localStorage.removeItem("cvDraft");
        this.router.navigate([APP_ROUTES.cv]);
        this.toastr.success(`Le cv ${cv.firstname} ${cv.name}`);
      },
      error: (err) => {
        this.toastr.error(
          `Une erreur s'est produite, Veuillez contacter l'admin`
        );
      },
    });
  }
  get name(): AbstractControl {
    return this.form.get("name")!;
  }
  get firstname() {
    return this.form.get("firstname");
  }
  get age(): AbstractControl {
    return this.form.get("age")!;
  }
  get job() {
    return this.form.get("job");
  }
  get path() {
    return this.form.get("path");
  }
  get cin(): AbstractControl {
    return this.form.get("cin")!;
  }
}
