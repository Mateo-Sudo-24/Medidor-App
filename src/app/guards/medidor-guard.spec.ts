import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { MedidorGuard } from './medidor-guard';

describe('MedidorGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => MedidorGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
