import { FormControl, FormGroup } from '@angular/forms';
import { cinAgeCorrelationValidator } from './cin-age.validator';

describe('cinAgeCorrelationValidator', () => {
  let formGroup: FormGroup;

  beforeEach(() => {
    formGroup = new FormGroup({
      cin: new FormControl(''),
      age: new FormControl(0)
    }, { validators: cinAgeCorrelationValidator() });
  });

  describe('Pour les personnes >= 60 ans', () => {
    it('should be valid when age >= 60 and CIN starts with 00', () => {
      formGroup.patchValue({ cin: '00123456', age: 60 });
      expect(formGroup.errors).toBeNull();
    });

    it('should be valid when age >= 60 and CIN starts with 10', () => {
      formGroup.patchValue({ cin: '10123456', age: 65 });
      expect(formGroup.errors).toBeNull();
    });

    it('should be valid when age >= 60 and CIN starts with 19', () => {
      formGroup.patchValue({ cin: '19123456', age: 70 });
      expect(formGroup.errors).toBeNull();
    });

    it('should be invalid when age >= 60 and CIN starts with 20', () => {
      formGroup.patchValue({ cin: '20123456', age: 60 });
      expect(formGroup.errors).toEqual({
        cinAgeCorrelation: {
          message: 'Pour un âge >= 60 ans, les deux premiers chiffres du CIN doivent être entre 00 et 19',
          age: 60,
          cinPrefix: 20,
          expectedRange: '00-19'
        }
      });
    });

    it('should be invalid when age >= 60 and CIN starts with 50', () => {
      formGroup.patchValue({ cin: '50123456', age: 75 });
      expect(formGroup.errors).toEqual({
        cinAgeCorrelation: {
          message: 'Pour un âge >= 60 ans, les deux premiers chiffres du CIN doivent être entre 00 et 19',
          age: 75,
          cinPrefix: 50,
          expectedRange: '00-19'
        }
      });
    });

    it('should be invalid when age >= 60 and CIN starts with 99', () => {
      formGroup.patchValue({ cin: '99123456', age: 80 });
      expect(formGroup.errors).toEqual({
        cinAgeCorrelation: {
          message: 'Pour un âge >= 60 ans, les deux premiers chiffres du CIN doivent être entre 00 et 19',
          age: 80,
          cinPrefix: 99,
          expectedRange: '00-19'
        }
      });
    });
  });

  describe('Pour les personnes < 60 ans', () => {
    it('should be valid when age < 60 and CIN starts with 20', () => {
      formGroup.patchValue({ cin: '20123456', age: 30 });
      expect(formGroup.errors).toBeNull();
    });

    it('should be valid when age < 60 and CIN starts with 50', () => {
      formGroup.patchValue({ cin: '50123456', age: 25 });
      expect(formGroup.errors).toBeNull();
    });

    it('should be valid when age < 60 and CIN starts with 99', () => {
      formGroup.patchValue({ cin: '99123456', age: 18 });
      expect(formGroup.errors).toBeNull();
    });

    it('should be invalid when age < 60 and CIN starts with 00', () => {
      formGroup.patchValue({ cin: '00123456', age: 30 });
      expect(formGroup.errors).toEqual({
        cinAgeCorrelation: {
          message: 'Pour un âge < 60 ans, les deux premiers chiffres du CIN doivent être supérieurs à 19',
          age: 30,
          cinPrefix: 0,
          expectedRange: '20-99'
        }
      });
    });

    it('should be invalid when age < 60 and CIN starts with 10', () => {
      formGroup.patchValue({ cin: '10123456', age: 40 });
      expect(formGroup.errors).toEqual({
        cinAgeCorrelation: {
          message: 'Pour un âge < 60 ans, les deux premiers chiffres du CIN doivent être supérieurs à 19',
          age: 40,
          cinPrefix: 10,
          expectedRange: '20-99'
        }
      });
    });

    it('should be invalid when age < 60 and CIN starts with 19', () => {
      formGroup.patchValue({ cin: '19123456', age: 59 });
      expect(formGroup.errors).toEqual({
        cinAgeCorrelation: {
          message: 'Pour un âge < 60 ans, les deux premiers chiffres du CIN doivent être supérieurs à 19',
          age: 59,
          cinPrefix: 19,
          expectedRange: '20-99'
        }
      });
    });
  });

  describe('Cas limites', () => {
    it('should return null when CIN is empty', () => {
      formGroup.patchValue({ cin: '', age: 30 });
      expect(formGroup.errors).toBeNull();
    });

    it('should return null when age is null', () => {
      formGroup.patchValue({ cin: '20123456', age: null });
      expect(formGroup.errors).toBeNull();
    });

    it('should return null when CIN has less than 2 characters', () => {
      formGroup.patchValue({ cin: '2', age: 30 });
      expect(formGroup.errors).toBeNull();
    });

    it('should return null when both CIN and age are empty', () => {
      formGroup.patchValue({ cin: '', age: null });
      expect(formGroup.errors).toBeNull();
    });

    it('should handle age = 0', () => {
      formGroup.patchValue({ cin: '20123456', age: 0 });
      expect(formGroup.errors).toBeNull();
    });

    it('should handle age exactly 60 with valid CIN', () => {
      formGroup.patchValue({ cin: '15123456', age: 60 });
      expect(formGroup.errors).toBeNull();
    });
  });
});
