import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError, catchError } from 'rxjs';
import { map } from 'rxjs/operators';

//Declaring the api url that will provide data for the client app
const apiUrl = 'https://myflix-moviedatabaseapp.herokuapp.com/';

@Injectable({
  providedIn: 'root',
})
export class FetchApiDataService {

  /**
 * Inject the HttpClient module to the constructor params.
 * This will provide HttpClient to the entire class, making it available via this.http
 * @param http
 */
  constructor(private http: HttpClient) { }

  /** Make api call to the user registration endpoint
   * @funtion userRegistration
   * @param userDetails
   * @returns a new user object in json format
   */
  public userRegistration(userDetails: any): Observable<any> {
    return this.http
      .post(apiUrl + 'users', userDetails)
      .pipe(catchError(this.handleError));
  }

  /**
   * Make api call to the user login endpoint
   * @param userDetails {any}
   * @returns users data in json format
   */
  public userLogin(userDetails: any): Observable<any> {
    return this.http
      .post(apiUrl + 'login', userDetails)
      .pipe(catchError(this.handleError));
  }

  /**
  * call api endpoint to get all movies
  * @function getAllMovies
  * @return array of movies object in json format
  */
  getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'movies', {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * call api endpoint to get a specific movie by title
   * @function getSingleMovie
   * @param Title
   * @returns a movie object in json format
   */
  getSingleMovie(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'movies/:Title', {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * call api endpoint to get a director data by directors name
   * @function getDirector
   * @param Name
   * @returns directors data in json format
   */
  getDirector(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + '/movies/directors/:Name', {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * call api endpoint to get genre data
   * @param Name
   * @returns genre data in json format
   */
  getGenre(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + '/movies/genre/:Name', {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
 * call api endpoint to get user information
 * @param username
 * @returns users information in json format
 */
  getUserProfile(): Observable<any> {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    return this.http
      .get(apiUrl + `users/${username}`, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
    * call api endpoint to get users list of favorite movies
    * @param username
    * @returns a list of the favorite movies of the user in json format
    */
  getFavoriteMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    return this.http
      .get(apiUrl + `users/${username}`, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * call api endpoint to add a movie to the favorite mobvielist of user
   * @param MovieID
   * @returns the favorite movielist of user in json format
   */
  addFavoriteMovies(id: string): Observable<any> {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    return this.http
      .post(apiUrl + `users/${username}/movies/${id}`, null, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
    * call api endpoint to edit user data
    * @param username
    * @param userCredentials
    * @returns updated user data in json format
    */
  editUserProfile(userData: object): Observable<any> {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    return this.http
      .put(apiUrl + `users/${username}`, userData, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
  * call api endpoint to delete the current user
  * @param username
  * @returns delete user profile
  */
  public deleteUserProfile(): Observable<any> {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    return this.http
      .delete(apiUrl + `users/delete/${username}`, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
  * call api endpoint to delete a favorite movie from the users favorite list
  * @param MovieID {any}
  * @returns updated user's information after removed a movie from the list in json format
  */
  deleteFavoriteMovies(id: string): Observable<any> {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    return this.http
      .delete(apiUrl + `users/${username}/delete/${id}`, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
  * Non-typed response extraction
  * @param res {any}
  * @returns response || empty object
  */
  private extractResponseData(data: any | Object): any {
    return data || {};
  }

  // Handle error function
  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('some error occured:', error.error.message);
    } else {
      console.error(
        `Error Status code ${error.status}, ` + `Error body is: ${error.error}`
      );
    }
    return throwError('Something went wrong; please try again later.');
  }
}