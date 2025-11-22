import { Component, inject, OnInit } from "@angular/core";
import { FormBuilder, AbstractControl } from "@angular/forms";
import { debounceTime, distinctUntilChanged, switchMap, tap, filter, Observable, of, startWith } from "rxjs";
import { CvService } from "../services/cv.service";
import { Cv } from "../model/cv";

@Component({
  selector: "app-autocomplete",
  templateUrl: "./autocomplete.component.html",
  styleUrls: ["./autocomplete.component.css"],
})
export class AutocompleteComponent implements OnInit {
  formBuilder = inject(FormBuilder);
  cvService = inject(CvService);
  
  // Observable pour les résultats de recherche
  cvs$!: Observable<Cv[]>;
  showResults = true;
  
  get search(): AbstractControl {
    return this.form.get("search")!;
  }
  
  form = this.formBuilder.group({ search: [""] });

  ngOnInit(): void {
    // Pipeline réactif optimisé pour l'autocomplete
    this.cvs$ = this.search.valueChanges.pipe(
      // Attend 300ms après la dernière frappe pour éviter trop de requêtes HTTP
      debounceTime(300),
      
      // Évite les recherches en double pour la même valeur
      distinctUntilChanged(),
      
      // Log pour le debug (optionnel)
      tap((term: string) => console.log('Searching for:', term)),
      
      // Affiche les résultats quand l'utilisateur tape
      tap(() => this.showResults = true),
      
      // Filtre: recherche seulement si au moins 2 caractères
      filter((term: string) => term !== null && term.trim().length >= 2),
      
      // switchMap annule les requêtes précédentes si l'utilisateur continue de taper
      // C'est crucial pour éviter les race conditions et optimiser les appels HTTP
      switchMap((term: string) => this.cvService.selectByName(term.trim()))
    );
  }

  // Sélectionne un CV et l'affiche dans le composant principal
  selectCv(cv: Cv): void {
    // Utilise le service pour notifier tous les composants du CV sélectionné
    this.cvService.selectCv(cv);
    
    // Cache les résultats
    this.showResults = false;
    
    // Réinitialise le champ de recherche (emitEvent: false évite de déclencher valueChanges)
    this.search.setValue('', { emitEvent: false });
  }
}
