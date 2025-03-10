import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateRecordsPageComponent } from './update-records-page.component';

describe('UpdateRecordsPageComponent', () => {
  let component: UpdateRecordsPageComponent;
  let fixture: ComponentFixture<UpdateRecordsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdateRecordsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateRecordsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
