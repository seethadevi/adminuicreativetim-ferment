import { TestBed, inject } from '@angular/core/testing';

import { ProducersubService } from './producersub.service';

describe('ProducersubService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProducersubService]
    });
  });

  it('should be created', inject([ProducersubService], (service: ProducersubService) => {
    expect(service).toBeTruthy();
  }));
});
