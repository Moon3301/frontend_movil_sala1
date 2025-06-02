import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountSupplierComponent } from './account-supplier.component';

describe('AccountSupplierComponent', () => {
  let component: AccountSupplierComponent;
  let fixture: ComponentFixture<AccountSupplierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountSupplierComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountSupplierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
