import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { TracksService } from '../service/tracks.service';
import { Track } from '../interface/track.interface';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button'
import { Router } from '@angular/router';


@Component({
  selector: 'app-track',
  imports: [AsyncPipe, MatCardModule, MatButtonModule],
  templateUrl: './track.component.html',
  styleUrl: './track.component.scss'
})
export class TrackComponent {

  private trackService = inject(TracksService);
  tracks$: Observable<Track[]> = this.trackService.getTracks();

  private router = inject(Router);

  deleteTrack(id: string) {
    this.trackService.deleteTrack(id).subscribe({
      next: () => {
        console.log("Track deleted");
        this.tracks$ = this.trackService.getTracks();   // refresh list
      },
      error: (err) => console.error(err)
    });
  }

  goToAddTracks() {
    this.router.navigate(['/tracks/form']);
  }

  updateExisting(id: string) {
    this.router.navigate(['/tracks', id, 'edit']);
  }

}
