import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterDetailCvComponent } from './master-detail-cv.component';

describe('MasterDetailCvComponent', () => {
  let component: MasterDetailCvComponent;
  let fixture: ComponentFixture<MasterDetailCvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MasterDetailCvComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasterDetailCvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
