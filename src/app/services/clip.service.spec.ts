/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ClipService } from './clip.service';

describe('Service: Clip', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ClipService]
    });
  });

  it('should ...', inject([ClipService], (service: ClipService) => {
    expect(service).toBeTruthy();
  }));
});
