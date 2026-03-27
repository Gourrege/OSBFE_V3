import { TestBed } from '@angular/core/testing';
import { creatorGuard } from './creator.guard';

describe('creatorGuard', () => {

  const executeGuard = () =>
    TestBed.runInInjectionContext(() => creatorGuard());

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
