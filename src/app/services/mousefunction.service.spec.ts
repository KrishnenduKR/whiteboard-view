import { TestBed } from '@angular/core/testing';

import { MousefunctionService } from './mousefunction.service';

describe('MousefunctionService', () => {
  let service: MousefunctionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MousefunctionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
