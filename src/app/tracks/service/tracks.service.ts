import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { Track } from '../interface/track.interface';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class TracksService {

  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUri}/tracks`

  getTracks(): Observable<Track[]> {
    return this.http.get<Track[]>(this.apiUrl).pipe(
      retry(3),
      catchError(this.handleError)
    )
  }

  //Gets a Track by ID
  getTrackById(id: string): Observable<Track> {
    return this.http.get<Track>(`${this.apiUrl}/${id}`);
  }

  // Update Track
  updateTrack(id: string, track: Track): Observable<Track> {
    const uri = `${this.apiUrl}/${id}`;
    return this.http.put<Track>(uri, track).pipe(
      catchError(this.handleError)
    );
  }

  // Delete Track
  deleteTrack(id: string): Observable<Track> {
    return this.http.delete<Track>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Add Track
  addTrack(track: Track): Observable<Track> {
    return this.http.post<Track>(this.apiUrl, track).pipe(
      catchError(this.handleError)
    );
  }

  //Handles the Errors from the Express response
  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

  constructor() { }
}
