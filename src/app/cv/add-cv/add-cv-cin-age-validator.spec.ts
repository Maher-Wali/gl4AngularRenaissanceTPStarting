import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { AddCvComponent } from './add-cv.component';
import { CvService } from '../services/cv.service';

describe('AddCvComponent - CIN-Age Correlation Validator Integration Tests', () => {
  let component: AddCvComponent;
  let fixture: ComponentFixture<AddCvComponent>;
  let mockCvService: jasmine.SpyObj<CvService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockToastr: jasmine.SpyObj<ToastrService>;

  beforeEach(async () => {
    mockCvService = jasmine.createSpyObj('CvService', ['checkCinExists', 'addCv']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockToastr = jasmine.createSpyObj('ToastrService', ['success', 'error']);

    await TestBed.configureTestingModule({
      declarations: [AddCvComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: CvService, useValue: mockCvService },
        { provide: Router, useValue: mockRouter },
        { provide: ToastrService, useValue: mockToastr }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddCvComponent);
    component = fixture.componentInstance;
    
    spyOn(localStorage, 'getItem').and.returnValue(null);
    spyOn(localStorage, 'setItem');
    spyOn(localStorage, 'removeItem');
    
    fixture.detectChanges();
  });

  describe('Validation pour personnes >= 60 ans', () => {
    it('should be valid when age is 60 and CIN starts with 00', () => {
      component.form.patchValue({
        name: 'Doe',
        firstname: 'John',
        job: 'Retired',
        cin: '00123456',
        age: 60
      });
      
      component.cin.markAsTouched();
      component.age.markAsTouched();
      
      expect(component.form.errors).toBeNull();
      expect(component.form.valid).toBeTruthy();
    });

    it('should be valid when age is 70 and CIN starts with 15', () => {
      component.form.patchValue({
        name: 'Doe',
        firstname: 'John',
        job: 'Retired',
        cin: '15123456',
        age: 70
      });
      
      component.cin.markAsTouched();
      component.age.markAsTouched();
      
      expect(component.form.errors).toBeNull();
      expect(component.form.valid).toBeTruthy();
    });

    it('should be valid when age is 80 and CIN starts with 19', () => {
      component.form.patchValue({
        name: 'Doe',
        firstname: 'John',
        job: 'Retired',
        cin: '19123456',
        age: 80
      });
      
      component.cin.markAsTouched();
      component.age.markAsTouched();
      
      expect(component.form.errors).toBeNull();
      expect(component.form.valid).toBeTruthy();
    });

    it('should be invalid when age is 60 and CIN starts with 20', () => {
      component.form.patchValue({
        name: 'Doe',
        firstname: 'John',
        job: 'Retired',
        cin: '20123456',
        age: 60
      });
      
      component.cin.markAsTouched();
      component.age.markAsTouched();
      
      expect(component.form.errors?.['cinAgeCorrelation']).toBeDefined();
      expect(component.form.errors?.['cinAgeCorrelation'].message).toContain('60 ans');
      expect(component.form.errors?.['cinAgeCorrelation'].expectedRange).toBe('00-19');
      expect(component.form.valid).toBeFalsy();
    });

    it('should be invalid when age is 65 and CIN starts with 50', () => {
      component.form.patchValue({
        name: 'Doe',
        firstname: 'John',
        job: 'Retired',
        cin: '50123456',
        age: 65
      });
      
      component.cin.markAsTouched();
      component.age.markAsTouched();
      
      expect(component.form.errors?.['cinAgeCorrelation']).toBeDefined();
      expect(component.form.valid).toBeFalsy();
    });

    it('should be invalid when age is 75 and CIN starts with 99', () => {
      component.form.patchValue({
        name: 'Doe',
        firstname: 'John',
        job: 'Retired',
        cin: '99123456',
        age: 75
      });
      
      component.cin.markAsTouched();
      component.age.markAsTouched();
      
      expect(component.form.errors?.['cinAgeCorrelation']).toBeDefined();
      expect(component.form.valid).toBeFalsy();
    });
  });

  describe('Validation pour personnes < 60 ans', () => {
    it('should be valid when age is 59 and CIN starts with 20', () => {
      component.form.patchValue({
        name: 'Doe',
        firstname: 'John',
        job: 'Developer',
        cin: '20123456',
        age: 59
      });
      
      component.cin.markAsTouched();
      component.age.markAsTouched();
      
      expect(component.form.errors).toBeNull();
      expect(component.form.valid).toBeTruthy();
    });

    it('should be valid when age is 30 and CIN starts with 50', () => {
      component.form.patchValue({
        name: 'Doe',
        firstname: 'John',
        job: 'Engineer',
        cin: '50123456',
        age: 30
      });
      
      component.cin.markAsTouched();
      component.age.markAsTouched();
      
      expect(component.form.errors).toBeNull();
      expect(component.form.valid).toBeTruthy();
    });

    it('should be valid when age is 18 and CIN starts with 99', () => {
      component.form.patchValue({
        name: 'Doe',
        firstname: 'John',
        job: 'Student',
        cin: '99123456',
        age: 18
      });
      
      component.cin.markAsTouched();
      component.age.markAsTouched();
      
      expect(component.form.errors).toBeNull();
      expect(component.form.valid).toBeTruthy();
    });

    it('should be invalid when age is 30 and CIN starts with 00', () => {
      component.form.patchValue({
        name: 'Doe',
        firstname: 'John',
        job: 'Developer',
        cin: '00123456',
        age: 30
      });
      
      component.cin.markAsTouched();
      component.age.markAsTouched();
      
      expect(component.form.errors?.['cinAgeCorrelation']).toBeDefined();
      expect(component.form.errors?.['cinAgeCorrelation'].message).toContain('< 60 ans');
      expect(component.form.errors?.['cinAgeCorrelation'].expectedRange).toBe('20-99');
      expect(component.form.valid).toBeFalsy();
    });

    it('should be invalid when age is 40 and CIN starts with 10', () => {
      component.form.patchValue({
        name: 'Doe',
        firstname: 'John',
        job: 'Manager',
        cin: '10123456',
        age: 40
      });
      
      component.cin.markAsTouched();
      component.age.markAsTouched();
      
      expect(component.form.errors?.['cinAgeCorrelation']).toBeDefined();
      expect(component.form.valid).toBeFalsy();
    });

    it('should be invalid when age is 59 and CIN starts with 19', () => {
      component.form.patchValue({
        name: 'Doe',
        firstname: 'John',
        job: 'Teacher',
        cin: '19123456',
        age: 59
      });
      
      component.cin.markAsTouched();
      component.age.markAsTouched();
      
      expect(component.form.errors?.['cinAgeCorrelation']).toBeDefined();
      expect(component.form.valid).toBeFalsy();
    });
  });

  describe('Réactivité du validateur', () => {
    it('should revalidate when age changes from < 60 to >= 60', () => {
      // Commence avec un CIN valide pour < 60 ans
      component.form.patchValue({
        name: 'Doe',
        firstname: 'John',
        job: 'Developer',
        cin: '20123456',
        age: 50
      });
      
      component.cin.markAsTouched();
      component.age.markAsTouched();
      
      expect(component.form.valid).toBeTruthy();
      
      // Change l'âge à >= 60
      component.age.setValue(60);
      
      // Le CIN devrait maintenant être invalide
      expect(component.form.errors?.['cinAgeCorrelation']).toBeDefined();
      expect(component.form.valid).toBeFalsy();
    });

    it('should revalidate when age changes from >= 60 to < 60', () => {
      // Commence avec un CIN valide pour >= 60 ans
      component.form.patchValue({
        name: 'Doe',
        firstname: 'John',
        job: 'Retired',
        cin: '15123456',
        age: 65
      });
      
      component.cin.markAsTouched();
      component.age.markAsTouched();
      
      expect(component.form.valid).toBeTruthy();
      
      // Change l'âge à < 60
      component.age.setValue(50);
      
      // Le CIN devrait maintenant être invalide
      expect(component.form.errors?.['cinAgeCorrelation']).toBeDefined();
      expect(component.form.valid).toBeFalsy();
    });

    it('should revalidate when CIN changes', () => {
      component.form.patchValue({
        name: 'Doe',
        firstname: 'John',
        job: 'Developer',
        cin: '20123456',
        age: 30
      });
      
      component.cin.markAsTouched();
      component.age.markAsTouched();
      
      expect(component.form.valid).toBeTruthy();
      
      // Change le CIN pour un invalide
      component.cin.setValue('10123456');
      
      expect(component.form.errors?.['cinAgeCorrelation']).toBeDefined();
      expect(component.form.valid).toBeFalsy();
    });
  });

  describe('Cas limite à la frontière (age = 60)', () => {
    it('should validate correctly at exactly age 60 with valid CIN', () => {
      component.form.patchValue({
        name: 'Doe',
        firstname: 'John',
        job: 'Manager',
        cin: '15123456',
        age: 60
      });
      
      component.cin.markAsTouched();
      component.age.markAsTouched();
      
      expect(component.form.errors).toBeNull();
      expect(component.form.valid).toBeTruthy();
    });

    it('should invalidate at exactly age 60 with invalid CIN', () => {
      component.form.patchValue({
        name: 'Doe',
        firstname: 'John',
        job: 'Manager',
        cin: '25123456',
        age: 60
      });
      
      component.cin.markAsTouched();
      component.age.markAsTouched();
      
      expect(component.form.errors?.['cinAgeCorrelation']).toBeDefined();
      expect(component.form.valid).toBeFalsy();
    });
  });
});
