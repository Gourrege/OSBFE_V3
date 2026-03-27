import { DatePipe, NgClass } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { of, switchMap } from 'rxjs';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HomeRaceService } from './service/home-race.service';
import { JolpicaRace, JolpicaRaceResult } from './interface/home-race.interface';

@Component({
  selector: 'app-home',
  imports: [RouterLink, MatButtonModule, MatCardModule, MatProgressSpinnerModule, DatePipe, NgClass],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private homeRaceService = inject(HomeRaceService);

  nextRace: JolpicaRace | null = null;
  previousRace: JolpicaRace | null = null;
  isLoading = true;
  hasError = false;

  ngOnInit(): void {
    this.loadRaceCards();
  }

  get topTenResults(): JolpicaRaceResult[] {
    return this.previousRace?.Results?.slice(0, 10) ?? [];
  }

  get nextRaceDate(): Date | null {
    return this.buildRaceDate(this.nextRace);
  }

  get previousRaceDate(): Date | null {
    return this.buildRaceDate(this.previousRace);
  }

  private loadRaceCards() {
    this.isLoading = true;
    this.hasError = false;

    this.homeRaceService.getSeasonRaces().pipe(
      switchMap(races => {
        const nextRace = this.findNextRace(races);

        if (!nextRace) {
          return of({ nextRace: null, previousRace: null });
        }

        const previousRound = Number(nextRace.round) - 1;

        if (previousRound < 1) {
          return of({ nextRace, previousRace: null });
        }

        return this.homeRaceService.getRaceResults(previousRound).pipe(
          switchMap(previousRace => of({ nextRace, previousRace }))
        );
      })
    ).subscribe({
      next: response => {
        this.nextRace = response.nextRace;
        this.previousRace = response.previousRace;
        this.isLoading = false;
      },
      error: err => {
        console.error(err);
        this.hasError = true;
        this.isLoading = false;
      }
    });
  }

  private findNextRace(races: JolpicaRace[]): JolpicaRace | null {
    const now = Date.now();

    return races.find(race => {
      const raceDate = this.buildRaceDate(race);
      return raceDate ? raceDate.getTime() > now : false;
    }) ?? null;
  }

  private buildRaceDate(race: JolpicaRace | null): Date | null {
    if (!race?.date) {
      return null;
    }

    return new Date(`${race.date}T${race.time ?? '00:00:00Z'}`);
  }
}
