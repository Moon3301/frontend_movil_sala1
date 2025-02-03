import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListMoviePageComponent } from './list-movie-page.component';

describe('ListMoviePageComponent', () => {
  let component: ListMoviePageComponent;
  let fixture: ComponentFixture<ListMoviePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListMoviePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListMoviePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
