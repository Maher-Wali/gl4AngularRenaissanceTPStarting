import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { AddCvComponent } from './add-cv.component';
import { CvService } from '../services/cv.service';
import { Cv } from '../model/cv';

describe('AddCvComponent - CIN Async Validator Integration Tests', () => {
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
    
    // Mock localStorage
    spyOn(localStorage, 'getItem').and.returnValue(null);
    spyOn(localStorage, 'setItem');
    spyOn(localStorage, 'removeItem');
    
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should validate CIN asynchronously when a unique CIN is entered', fakeAsync(() => {
    // Setup: CIN n'existe pas
    mockCvService.checkCinExists.and.returnValue(of(false).pipe(delay(100)));

    // Remplir le formulaire avec un CIN unique
    component.form.patchValue({
      name: 'Doe',
      firstname: 'John',
      job: 'Developer',
      cin: '12345678',
      age: 30
    });

    // Marquer le champ comme touché pour déclencher la validation
    component.cin.markAsTouched();
    component.cin.updateValueAndValidity();

    // Le contrôle devrait être en cours de validation
    expect(component.cin.pending).toBeTruthy();

    // Avancer le temps pour que la validation asynchrone se termine
    tick(600); // debounceTime(500) + delay(100)

    // Le contrôle ne devrait plus être en attente
    expect(component.cin.pending).toBeFalsy();
    
    // Le CIN devrait être valide
    expect(component.cin.errors).toBeNull();
    expect(component.form.valid).toBeTruthy();
    expect(mockCvService.checkCinExists).toHaveBeenCalledWith('12345678');
  }));

  it('should invalidate form when CIN already exists', fakeAsync(() => {
    // Setup: CIN existe déjà
    mockCvService.checkCinExists.and.returnValue(of(true).pipe(delay(100)));

    // Remplir le formulaire avec un CIN existant
    component.form.patchValue({
      name: 'Doe',
      firstname: 'John',
      job: 'Developer',
      cin: '87654321',
      age: 30
    });

    // Marquer le champ comme touché
    component.cin.markAsTouched();
    component.cin.updateValueAndValidity();

    // Avancer le temps
    tick(600);

    // Le CIN devrait être invalide
    expect(component.cin.errors).toEqual({ cinNotUnique: { value: '87654321' } });
    expect(component.form.valid).toBeFalsy();
    expect(mockCvService.checkCinExists).toHaveBeenCalledWith('87654321');
  }));

  it('should not call checkCinExists when CIN is empty', fakeAsync(() => {
    component.form.patchValue({
      cin: ''
    });

    component.cin.markAsTouched();
    component.cin.updateValueAndValidity();

    tick(600);

    expect(mockCvService.checkCinExists).not.toHaveBeenCalled();
  }));

  it('should handle API error gracefully during CIN validation', fakeAsync(() => {
    // Setup: L'API retourne une erreur
    mockCvService.checkCinExists.and.returnValue(
      throwError(() => new Error('API Error')).pipe(delay(100))
    );

    component.form.patchValue({
      name: 'Doe',
      firstname: 'John',
      job: 'Developer',
      cin: '11111111',
      age: 30
    });

    component.cin.markAsTouched();
    component.cin.updateValueAndValidity();

    tick(600);

    // En cas d'erreur, le validateur retourne null (considéré comme valide)
    expect(component.cin.errors?.['cinNotUnique']).toBeUndefined();
  }));

  it('should debounce multiple CIN changes', fakeAsync(() => {
    mockCvService.checkCinExists.and.returnValue(of(false));

    // Simuler plusieurs changements rapides
    component.cin.setValue('12345678');
    tick(200);
    component.cin.setValue('12345679');
    tick(200);
    component.cin.setValue('12345680');
    
    // Attendre la fin du debounce
    tick(500);

    // L'API ne devrait être appelée qu'une seule fois avec la dernière valeur
    expect(mockCvService.checkCinExists).toHaveBeenCalledTimes(1);
    expect(mockCvService.checkCinExists).toHaveBeenCalledWith('12345680');
  }));

  it('should not submit form when CIN is not unique', fakeAsync(() => {
    mockCvService.checkCinExists.and.returnValue(of(true));
    mockCvService.addCv.and.returnValue(of(new Cv()));

    component.form.patchValue({
      name: 'Doe',
      firstname: 'John',
      job: 'Developer',
      cin: '87654321',
      age: 30
    });

    component.cin.markAsTouched();
    component.cin.updateValueAndValidity();

    tick(600);

    expect(component.form.invalid).toBeTruthy();
    
    // Tenter de soumettre le formulaire
    component.addCv();

    // Le service ne devrait pas être appelé car le formulaire est invalide
    expect(mockCvService.addCv).not.toHaveBeenCalled();
  }));

  it('should successfully submit form when CIN is unique and all fields are valid', fakeAsync(() => {
    mockCvService.checkCinExists.and.returnValue(of(false));
    const mockCv = new Cv(1, 'John', 'Doe', 'Developer', '', '12345678', 30);
    mockCvService.addCv.and.returnValue(of(mockCv));

    component.form.patchValue({
      name: 'Doe',
      firstname: 'John',
      job: 'Developer',
      cin: '12345678',
      age: 30,
      path: ''
    });

    component.cin.markAsTouched();
    component.cin.updateValueAndValidity();

    tick(600);

    expect(component.form.valid).toBeTruthy();

    // Soumettre le formulaire
    component.addCv();

    expect(mockCvService.addCv).toHaveBeenCalled();
    expect(mockToastr.success).toHaveBeenCalled();
    expect(localStorage.removeItem).toHaveBeenCalledWith('cvDraft');
  }));
});
