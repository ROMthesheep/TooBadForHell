import { TestBed } from '@angular/core/testing';

import { PlayerServService } from './player-serv.service';

describe('PlayerServService', () => {
  let service: PlayerServService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlayerServService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
