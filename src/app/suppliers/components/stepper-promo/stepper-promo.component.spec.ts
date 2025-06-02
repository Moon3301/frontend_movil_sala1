import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepperPromoComponent } from './stepper-promo.component';

describe('StepperPromoComponent', () => {
  let component: StepperPromoComponent;
  let fixture: ComponentFixture<StepperPromoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StepperPromoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepperPromoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
