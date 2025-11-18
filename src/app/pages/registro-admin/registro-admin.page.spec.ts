import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistroAdminPage } from './registro-admin.page';

describe('RegistroAdminPage', () => {
  let component: RegistroAdminPage;
  let fixture: ComponentFixture<RegistroAdminPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroAdminPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
