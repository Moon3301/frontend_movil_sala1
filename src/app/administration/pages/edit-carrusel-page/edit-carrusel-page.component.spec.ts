import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCarruselPageComponent } from './edit-carrusel-page.component';

describe('EditCarruselPageComponent', () => {
  let component: EditCarruselPageComponent;
  let fixture: ComponentFixture<EditCarruselPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditCarruselPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditCarruselPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
