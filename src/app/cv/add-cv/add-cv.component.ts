import { Component } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  Validators,
} from "@angular/forms";
import { CvService } from "../services/cv.service";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { APP_ROUTES } from "src/config/routes.config";
import { Cv } from "../model/cv";

@Component({
  selector: "app-add-cv",
  templateUrl: "./add-cv.component.html",
  styleUrls: ["./add-cv.component.css"],
})
export class AddCvComponent {
  constructor(
    private cvService: CvService,
    private router: Router,
    private toastr: ToastrService,
    private formBuilder: FormBuilder
  ) { }
  draftRestored = false;
  form = this.formBuilder.group(
    {
      name: ["", Validators.required],
      firstname: ["", Validators.required],
      path: [""],
      job: ["", Validators.required],
      cin: [
        "",
        {
          validators: [Validators.required, Validators.pattern("[0-9]{8}")],
        },
      ],
      age: [
        0,
        {
          validators: [Validators.required],
        },
      ],
    },
  );

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
  ngOnInit() {
    const saved = localStorage.getItem("cvDraft");
    if (saved) {

      //setValue oblige que tous les champs soient présents → sinon erreur 
      //patchValue remplit le formulaire avec cet objet sans exiger que tous les champs soient présents

      this.form.patchValue(JSON.parse(saved));
      this.draftRestored = true;
    }

    // this.form.valueChanges: c’est un Observable d’Angular
    // Il émet un nouvel événement chaque fois qu’un champ du formulaire change.
    // Dès que l’utilisateur modifie quoi que ce soit → valueChanges est déclenché.
    //.subscribe : On s’abonne à ces changements.
    this.form.valueChanges.subscribe(value => {
      localStorage.setItem("cvDraft", JSON.stringify(value));
    });

    // désactiver path si age < 18
    this.age.valueChanges.subscribe(ageValue => {

      const pathControl = this.form.get("path");

      if (!pathControl) return;

      if (ageValue < 18) {
        pathControl.disable();
        pathControl.setValue(""); // on nettoie si une valeur existe déjà
      } else {
        pathControl.enable();
      }
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