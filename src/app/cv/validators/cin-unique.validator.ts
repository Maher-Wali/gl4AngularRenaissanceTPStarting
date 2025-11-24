import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, catchError, debounceTime, switchMap, take } from 'rxjs/operators';
import { CvService } from '../services/cv.service';

/**
 * Validateur asynchrone pour vérifier l'unicité du CIN
 * 
 * @param cvService - Le service CV pour vérifier l'existence du CIN
 * @returns AsyncValidatorFn
 */
export function cinUniqueValidator(cvService: CvService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) {
      return of(null);
    }

    return of(control.value).pipe(
      debounceTime(500), // Attendre 500ms après la dernière saisie
      switchMap(cin => 
        cvService.checkCinExists(cin).pipe(
          map(exists => exists ? { cinNotUnique: { value: control.value } } : null),
          catchError(() => of(null)) // En cas d'erreur, on considère que le CIN est valide
        )
      ),
      take(1)
    );
  };
}
