import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Track } from '../../interface/track.interface';
import { TracksService } from '../../service/tracks.service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-track-form',
  standalone: true,
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './track-form.component.html',
  styleUrl: './track-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackFormComponent implements OnInit {

  private fb = inject(FormBuilder);
  private trackService = inject(TracksService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  id: string = "";
  trackData?: Track;

  trackForm: FormGroup = this.fb.group({
    fiaTrackName: ['', Validators.required],
    trackLayout: ['', Validators.required],// URL or image path
    circuitName: ['', Validators.required],
    trackLocation: ['', Validators.required],
    numDRSZones: ['', Validators.required],
    trackLength: ['', Validators.required],
    qualiFL: ['', Validators.required],
    raceFL: ['', Validators.required]
  });

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || "";

    if (this.id) {
      this.trackService.getTrackById(this.id).subscribe(track => {
        this.trackData = track;

        this.trackForm.patchValue({
          fiaTrackName: track.fiaTrackName,
          trackLayout: track.trackLayout,
          circuitName: track.circuitName,
          trackLocation: track.trackLocation,
          numDRSZones: track.numDRSZones,
          trackLength: track.trackLength,
          qualiFL: track.qualiFL,
          raceFL: track.raceFL
        });
      });
    }
  }

  onSubmit() {
    const formData = this.trackForm.value as Track;

    if (!this.id) {
      // CREATE a Track
      this.trackService.addTrack(formData).subscribe({
        next: () => this.router.navigate(['/tracks']),
        error: (err: Error) => console.log(err.message),
      });

    } else {
      // UPDATE
      this.trackService.updateTrack(this.id, formData).subscribe({
        next: () => this.router.navigate(['/tracks']),
        error: (err: Error) => console.log(err.message),
      });
    }
  }

  goToTracks() {
    this.router.navigate(['/tracks']);
  }

  // Getters for the template
  get fiaTrackName() { return this.trackForm.get('fiaTrackName'); }
  get trackLayout() { return this.trackForm.get('trackLayout'); }
  get circuitName() { return this.trackForm.get('circuitName'); }
  get trackLocation() { return this.trackForm.get('trackLocation'); }
  get numDRSZones() { return this.trackForm.get('numDRSZones'); }
  get trackLength() { return this.trackForm.get('trackLength'); }
  get qualiFL() { return this.trackForm.get('qualiFL'); }
  get raceFL() { return this.trackForm.get('raceFL'); }
}

