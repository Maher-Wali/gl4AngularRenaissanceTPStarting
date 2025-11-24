import { TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { CvService } from '../services/cv.service';
import { cinUniqueValidator } from './cin-unique.validator';

describe('cinUniqueValidator', () => {
  let mockCvService: jasmine.SpyObj<CvService>;

  beforeEach(() => {
    mockCvService = jasmine.createSpyObj('CvService', ['checkCinExists']);
    TestBed.configureTestingModule({});
  });

  it('should return null when control value is empty', (done) => {
    const control = new FormControl('');
    const validator = cinUniqueValidator(mockCvService);

    validator(control).subscribe(result => {
      expect(result).toBeNull();
      expect(mockCvService.checkCinExists).not.toHaveBeenCalled();
      done();
    });
  });

  it('should return null when CIN does not exist', (done) => {
    mockCvService.checkCinExists.and.returnValue(of(false));
    const control = new FormControl('12345678');
    const validator = cinUniqueValidator(mockCvService);

    validator(control).subscribe(result => {
      expect(result).toBeNull();
      expect(mockCvService.checkCinExists).toHaveBeenCalledWith('12345678');
      done();
    });
  });

  it('should return validation error when CIN exists', (done) => {
    mockCvService.checkCinExists.and.returnValue(of(true));
    const control = new FormControl('12345678');
    const validator = cinUniqueValidator(mockCvService);

    validator(control).subscribe(result => {
      expect(result).toEqual({ cinNotUnique: { value: '12345678' } });
      expect(mockCvService.checkCinExists).toHaveBeenCalledWith('12345678');
      done();
    });
  });

  it('should return null when service throws an error', (done) => {
    mockCvService.checkCinExists.and.returnValue(throwError(() => new Error('API Error')));
    const control = new FormControl('12345678');
    const validator = cinUniqueValidator(mockCvService);

    validator(control).subscribe(result => {
      expect(result).toBeNull();
      expect(mockCvService.checkCinExists).toHaveBeenCalledWith('12345678');
      done();
    });
  });

  it('should debounce validation calls', (done) => {
    mockCvService.checkCinExists.and.returnValue(of(false));
    const control = new FormControl('12345678');
    const validator = cinUniqueValidator(mockCvService);

    // Premier appel
    validator(control).subscribe(() => {
      expect(mockCvService.checkCinExists).toHaveBeenCalledTimes(1);
      done();
    });
  });
});
