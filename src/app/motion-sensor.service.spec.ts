import { TestBed } from '@angular/core/testing';

import { MotionSensorService } from './motion-sensor.service';

describe('MotionSensorService', () => {
  let service: MotionSensorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MotionSensorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
