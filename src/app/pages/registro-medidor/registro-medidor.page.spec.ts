import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistroMedidorPage } from './registro-medidor.page';

describe('RegistroMedidorPage', () => {
  let component: RegistroMedidorPage;
  let fixture: ComponentFixture<RegistroMedidorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroMedidorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
