import { TestBed } from '@angular/core/testing';

import { Mediciones } from './mediciones';

describe('Mediciones', () => {
  let service: Mediciones;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Mediciones);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
