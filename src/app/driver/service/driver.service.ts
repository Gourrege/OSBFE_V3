import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse} from '@angular/common/http';
import { Observable, retry, catchError, throwError } from 'rxjs';
import { Driver } from '../interface/driver.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DriverService {

  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUri}/driver`

  getDrivers(): Observable<Driver[]> {
    return this.http.get<Driver[]>(this.apiUrl).pipe(
      retry(3),
      catchError(this.handleError)
    )
  }

  //Gets a Driver by ID
  getDriverById(id: string): Observable<Driver> {
    return this.http.get<Driver>(`${this.apiUrl}/${id}`);
  }

  // Update driver
  updateDriver(id: string, driver: Driver): Observable<Driver> {
    const uri = `${this.apiUrl}/${id}`;
    return this.http.put<Driver>(uri, driver).pipe(
      catchError(this.handleError)
    );
  }

  // Delete driver
  deleteDriver(id: string): Observable<Driver> {
    return this.http.delete<Driver>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Add driver
  addDriver(driver: Driver): Observable<Driver> {
    return this.http.post<Driver>(this.apiUrl, driver).pipe(
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
