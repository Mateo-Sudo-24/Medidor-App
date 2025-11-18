import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MedidorPage } from './medidor.page';

describe('MedidorPage', () => {
  let component: MedidorPage;
  let fixture: ComponentFixture<MedidorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MedidorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
