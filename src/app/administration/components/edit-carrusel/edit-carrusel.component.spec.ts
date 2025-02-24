import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCarruselComponent } from './edit-carrusel.component';

describe('EditCarruselComponent', () => {
  let component: EditCarruselComponent;
  let fixture: ComponentFixture<EditCarruselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditCarruselComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditCarruselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
