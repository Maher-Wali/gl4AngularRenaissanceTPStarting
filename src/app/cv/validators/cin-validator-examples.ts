import { Component } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { CvService } from "../services/cv.service";
import { cinUniqueValidator } from "../validators/cin-unique.validator";

/**
 * EXEMPLE D'UTILISATION DU VALIDATEUR ASYNCHRONE CIN
 * 
 * Ce fichier montre comment utiliser le validateur cinUniqueValidator
 * dans différents contextes et configurations.
 */

@Component({
  selector: "app-example-cin-validator",
  template: `<!-- Template simplifié pour l'exemple -->`,
})
export class ExampleCinValidatorComponent {
  
  constructor(
    private fb: FormBuilder,
    private cvService: CvService
  ) {}

  // ========================================
  // EXEMPLE 1 : Configuration de base
  // ========================================
  basicForm = this.fb.group({
    cin: [
      '',
      {
        validators: [Validators.required, Validators.pattern('[0-9]{8}')],
        asyncValidators: [cinUniqueValidator(this.cvService)]
      }
    ]
  });

  // ========================================
  // EXEMPLE 2 : Avec updateOn 'blur'
  // Validation déclenchée uniquement à la perte de focus
  // ========================================
  blurForm = this.fb.group({
    cin: [
      '',
      {
        validators: [Validators.required, Validators.pattern('[0-9]{8}')],
        asyncValidators: [cinUniqueValidator(this.cvService)],
        updateOn: 'blur' // ⭐ Recommandé pour réduire les appels API
      }
    ]
  });

  // ========================================
  // EXEMPLE 3 : Avec updateOn 'submit'
  // Validation déclenchée uniquement à la soumission
  // ========================================
  submitForm = this.fb.group({
    cin: [
      '',
      {
        validators: [Validators.required, Validators.pattern('[0-9]{8}')],
        asyncValidators: [cinUniqueValidator(this.cvService)],
        updateOn: 'submit' // Validation seulement lors de la soumission
      }
    ]
  });

  // ========================================
  // EXEMPLE 4 : Formulaire complet avec CIN
  // ========================================
  fullForm = this.fb.group({
    name: ['', Validators.required],
    firstname: ['', Validators.required],
    age: [0, [Validators.required, Validators.min(18), Validators.max(99)]],
    cin: [
      '',
      {
        validators: [Validators.required, Validators.pattern('[0-9]{8}')],
        asyncValidators: [cinUniqueValidator(this.cvService)],
        updateOn: 'blur'
      }
    ],
    email: ['', [Validators.required, Validators.email]]
  });

  // ========================================
  // EXEMPLE 5 : Vérification manuelle de l'état du CIN
  // ========================================
  checkCinState() {
    const cinControl = this.fullForm.get('cin');
    
    if (cinControl) {
      // Vérifier si la validation est en cours
      if (cinControl.pending) {
        console.log('⏳ Validation du CIN en cours...');
      }
      
      // Vérifier les erreurs
      if (cinControl.errors) {
        if (cinControl.errors['required']) {
          console.log('❌ CIN requis');
        }
        if (cinControl.errors['pattern']) {
          console.log('❌ Format CIN invalide (8 chiffres requis)');
        }
        if (cinControl.errors['cinNotUnique']) {
          console.log('❌ CIN déjà existant:', cinControl.errors['cinNotUnique'].value);
        }
      }
      
      // Vérifier si valide
      if (cinControl.valid) {
        console.log('✅ CIN valide et unique');
      }
    }
  }

  // ========================================
  // EXEMPLE 6 : Déclencher la validation manuellement
  // ========================================
  triggerCinValidation() {
    const cinControl = this.fullForm.get('cin');
    if (cinControl) {
      cinControl.markAsTouched();
      cinControl.updateValueAndValidity(); // Force la validation
    }
  }

  // ========================================
  // EXEMPLE 7 : Écouter les changements de statut
  // ========================================
  listenToCinStatus() {
    const cinControl = this.fullForm.get('cin');
    if (cinControl) {
      cinControl.statusChanges.subscribe(status => {
        console.log('📊 Statut du CIN:', status);
        // Valeurs possibles: 'VALID', 'INVALID', 'PENDING', 'DISABLED'
        
        switch(status) {
          case 'PENDING':
            console.log('⏳ Vérification en cours...');
            break;
          case 'VALID':
            console.log('✅ CIN valide');
            break;
          case 'INVALID':
            console.log('❌ CIN invalide');
            break;
        }
      });
    }
  }

  // ========================================
  // EXEMPLE 8 : Soumettre le formulaire avec gestion du pending
  // ========================================
  async submitFormWithPendingCheck() {
    const cinControl = this.fullForm.get('cin');
    
    // Attendre que la validation asynchrone se termine
    if (cinControl && cinControl.pending) {
      console.log('⏳ Attente de la validation du CIN...');
      
      // Attendre que le statut ne soit plus PENDING
      await new Promise<void>((resolve) => {
        const subscription = cinControl.statusChanges.subscribe(status => {
          if (status !== 'PENDING') {
            subscription.unsubscribe();
            resolve();
          }
        });
      });
    }
    
    // Vérifier la validité du formulaire
    if (this.fullForm.valid) {
      console.log('✅ Formulaire valide, soumission en cours...');
      // Soumettre le formulaire
    } else {
      console.log('❌ Formulaire invalide');
      // Marquer tous les champs comme touchés pour afficher les erreurs
      Object.keys(this.fullForm.controls).forEach(key => {
        this.fullForm.get(key)?.markAsTouched();
      });
    }
  }

  // ========================================
  // EXEMPLE 9 : Désactiver/Activer le validateur dynamiquement
  // ========================================
  toggleCinValidation(enable: boolean) {
    const cinControl = this.fullForm.get('cin');
    if (cinControl) {
      if (enable) {
        // Réactiver le validateur asynchrone
        cinControl.setAsyncValidators([cinUniqueValidator(this.cvService)]);
      } else {
        // Désactiver le validateur asynchrone
        cinControl.clearAsyncValidators();
      }
      cinControl.updateValueAndValidity();
    }
  }

  // ========================================
  // EXEMPLE 10 : Modifier le CIN avec validation
  // Pour éditer un CV existant, on doit ignorer son propre CIN
  // Note: Cette fonctionnalité nécessiterait une modification du validateur
  // ========================================
  editForm = this.fb.group({
    id: [0], // ID du CV en cours d'édition
    cin: [
      '',
      {
        validators: [Validators.required, Validators.pattern('[0-9]{8}')],
        asyncValidators: [cinUniqueValidator(this.cvService)],
        // TODO: Passer l'ID à exclure au validateur
        // asyncValidators: [cinUniqueValidator(this.cvService, this.editForm.get('id')?.value)],
        updateOn: 'blur'
      }
    ]
  });
}

/**
 * TEMPLATE HTML CORRESPONDANT
 * 
 * Voici un exemple de template pour afficher les différents états :
 * 
 * <form [formGroup]="fullForm">
 *   <label for="cin">CIN (8 chiffres)</label>
 *   <input 
 *     type="text" 
 *     id="cin"
 *     formControlName="cin" 
 *     class="form-control"
 *     placeholder="12345678"
 *   />
 *   
 *   <!-- Erreur : Champ requis -->
 *   <div *ngIf="fullForm.get('cin')?.hasError('required') && fullForm.get('cin')?.touched" 
 *        class="alert alert-danger">
 *     Le CIN est obligatoire
 *   </div>
 *   
 *   <!-- Erreur : Format invalide -->
 *   <div *ngIf="fullForm.get('cin')?.hasError('pattern') && fullForm.get('cin')?.touched" 
 *        class="alert alert-danger">
 *     Le CIN doit contenir exactement 8 chiffres
 *   </div>
 *   
 *   <!-- Erreur : CIN non unique -->
 *   <div *ngIf="fullForm.get('cin')?.hasError('cinNotUnique') && fullForm.get('cin')?.touched" 
 *        class="alert alert-danger">
 *     Ce CIN existe déjà. Veuillez en saisir un autre.
 *   </div>
 *   
 *   <!-- État : Validation en cours -->
 *   <div *ngIf="fullForm.get('cin')?.pending" 
 *        class="alert alert-info">
 *     <span class="spinner-border spinner-border-sm"></span>
 *     Vérification du CIN en cours...
 *   </div>
 *   
 *   <!-- État : Valide -->
 *   <div *ngIf="fullForm.get('cin')?.valid && fullForm.get('cin')?.touched" 
 *        class="alert alert-success">
 *     ✅ CIN valide
 *   </div>
 *   
 *   <button 
 *     type="submit" 
 *     [disabled]="fullForm.invalid || fullForm.get('cin')?.pending"
 *     class="btn btn-primary">
 *     Soumettre
 *   </button>
 * </form>
 */

/**
 * NOTES IMPORTANTES :
 * 
 * 1. UpdateOn Options:
 *    - 'change' (défaut) : Validation à chaque modification
 *    - 'blur' : Validation à la perte de focus (RECOMMANDÉ pour async)
 *    - 'submit' : Validation uniquement à la soumission
 * 
 * 2. Debouncing:
 *    Le validateur inclut déjà un debounceTime(500) pour limiter les appels API
 * 
 * 3. Gestion d'erreur:
 *    En cas d'erreur API, le validateur retourne null (considéré comme valide)
 *    pour ne pas bloquer l'utilisateur
 * 
 * 4. Performance:
 *    Utiliser updateOn: 'blur' réduit significativement le nombre d'appels API
 * 
 * 5. États du contrôle:
 *    - VALID : Toutes les validations passent
 *    - INVALID : Au moins une validation échoue
 *    - PENDING : Validation asynchrone en cours
 *    - DISABLED : Contrôle désactivé
 */
