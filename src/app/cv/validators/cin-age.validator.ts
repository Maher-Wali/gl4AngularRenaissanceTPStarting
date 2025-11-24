import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validateur personnalisé pour vérifier la corrélation entre l'âge et les deux premiers caractères du CIN
 * 
 * Règles:
 * - Si âge >= 60 ans : les 2 premiers chiffres du CIN doivent être entre 00 et 19
 * - Si âge < 60 ans : les 2 premiers chiffres du CIN doivent être > 19
 * 
 * @returns ValidatorFn
 */
export function cinAgeCorrelationValidator(): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const cinControl = formGroup.get('cin');
    const ageControl = formGroup.get('age');

    // Si les contrôles n'existent pas, on ne valide pas
    if (!cinControl || !ageControl) {
      return null;
    }

    const cin = cinControl.value;
    const age = ageControl.value;

    // Si le CIN ou l'âge est vide, on ne valide pas (géré par d'autres validateurs)
    if (!cin || age === null || age === undefined) {
      return null;
    }

    // Vérifier que le CIN a au moins 2 caractères
    if (cin.length < 2) {
      return null;
    }

    // Extraire les deux premiers caractères du CIN et les convertir en nombre
    const firstTwoDigits = parseInt(cin.substring(0, 2), 10);

    // Vérifier si c'est un nombre valide
    if (isNaN(firstTwoDigits)) {
      return null; // Le format sera géré par le validateur de pattern
    }

    // Appliquer les règles de corrélation
    if (age >= 60) {
      // Pour les personnes de 60 ans ou plus, les 2 premiers chiffres doivent être entre 00 et 19
      if (firstTwoDigits < 0 || firstTwoDigits > 19) {
        return {
          cinAgeCorrelation: {
            message: 'Pour un âge >= 60 ans, les deux premiers chiffres du CIN doivent être entre 00 et 19',
            age: age,
            cinPrefix: firstTwoDigits,
            expectedRange: '00-19'
          }
        };
      }
    } else {
      // Pour les personnes de moins de 60 ans, les 2 premiers chiffres doivent être > 19
      if (firstTwoDigits <= 19) {
        return {
          cinAgeCorrelation: {
            message: 'Pour un âge < 60 ans, les deux premiers chiffres du CIN doivent être supérieurs à 19',
            age: age,
            cinPrefix: firstTwoDigits,
            expectedRange: '20-99'
          }
        };
      }
    }

    // Validation réussie
    return null;
  };
}
