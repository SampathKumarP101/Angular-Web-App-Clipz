/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { FfmpegService } from './ffmpeg.service';

describe('Service: Ffmpeg', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FfmpegService]
    });
  });

  it('should ...', inject([FfmpegService], (service: FfmpegService) => {
    expect(service).toBeTruthy();
  }));
});
