import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMoviesPagesComponent } from './edit-movies-pages.component';

describe('EditMoviesPagesComponent', () => {
  let component: EditMoviesPagesComponent;
  let fixture: ComponentFixture<EditMoviesPagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditMoviesPagesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditMoviesPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
