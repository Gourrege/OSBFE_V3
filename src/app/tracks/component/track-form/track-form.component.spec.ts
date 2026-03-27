import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { of } from 'rxjs';

import { TrackFormComponent } from './track-form.component';
import { TracksService } from '../../service/tracks.service';
import { Track } from '../../interface/track.interface';

describe('TrackFormComponent', () => {
  let component: TrackFormComponent;
  let fixture: ComponentFixture<TrackFormComponent>;
  let tracksService: jasmine.SpyObj<TracksService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    tracksService = jasmine.createSpyObj('TracksService', ['addTrack', 'getTrackById', 'updateTrack']);
    router = jasmine.createSpyObj('Router', ['navigate']);

    tracksService.addTrack.and.returnValue(of({} as Track));
    tracksService.getTrackById.and.returnValue(of({} as Track));

    await TestBed.configureTestingModule({
      imports: [TrackFormComponent],
      providers: [
        { provide: TracksService, useValue: tracksService },
        { provide: Router, useValue: router },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({})
            }
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrackFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call addTrack on submit when there is no id', () => {
    component.trackForm.setValue({
      fiaTrackName: 'Silverstone',
      trackLayout: 'https://example.com/layout.png',
      circuitName: 'Silverstone Circuit',
      trackLocation: 'United Kingdom',
      numDRSZones: 2,
      trackLength: 5.891,
      qualiFL: '1:26.720',
      raceFL: '1:27.097'
    });

    const formData = component.trackForm.value as Track;

    component.onSubmit();

    expect(tracksService.addTrack).toHaveBeenCalledWith(formData);
    expect(router.navigate).toHaveBeenCalledWith(['/tracks']);
  });
});
