import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import { JolpicaRace, JolpicaRaceResponse } from '../interface/home-race.interface';

@Injectable({
  providedIn: 'root'
})
export class HomeRaceService {
  private http = inject(HttpClient);

  private apiUrl = 'https://api.jolpi.ca/ergast/f1/2026';

  getSeasonRaces(): Observable<JolpicaRace[]> {
    return this.http
      .get<JolpicaRaceResponse>(`${this.apiUrl}.json`)
      .pipe(map(response => response.MRData.RaceTable.Races ?? []));
  }

  getRaceResults(round: number): Observable<JolpicaRace | null> {
    return this.http
      .get<JolpicaRaceResponse>(`${this.apiUrl}/${round}/results.json`)
      .pipe(map(response => response.MRData.RaceTable.Races[0] ?? null));
  }
}
