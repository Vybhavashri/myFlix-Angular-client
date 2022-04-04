import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MovieViewComponent } from '../movie-view/movie-view.component';
import { GenreViewComponent } from '../genre-view/genre-view.component';
import { DirectorViewComponent } from '../director-view/director-view.component';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.css']
})

export class MovieCardComponent {

  // empty states that gets populated in functions
  movies: any[] = [];
  user: any = localStorage.getItem('user');
  FavMovie: any[] = [];

  /**
   * Called when creating an instance of the class
   * @param fetchApiData 
   * @param dialog 
   * @param router 
   * @param snackBar 
   */
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public router: Router,
    public snackBar: MatSnackBar,
  ) { }

  /**
  * Initializes the component
  */
  ngOnInit(): void {
    this.getMovies();
    this.showFavMovie();
  }

  /**
   * Retrieves all movies from database
   * @returns the movies state which is an array including all the movies
   */
  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      return this.movies;
    });
  }

  /**
   * Retrieves all favourite movies of a user from database
   * @returns array of favourite movies
   */
  showFavMovie(): void {
    this.fetchApiData.getUserProfile().subscribe((resp: any) => {
      this.FavMovie = resp.FavouriteMovies;
      return this.FavMovie;
    });
  }

  /**
  * Adds a movie to logged in user's favorited movies
  * @param MovieID {string} Movie ID
  * @param Title {string} Title of the movie
  */
  addFavMovie(MovieID: string, Title: string): void {
    this.fetchApiData.addFavoriteMovies(MovieID).subscribe((response: any) => {
      this.snackBar.open(`${Title} is added to your favourites.`, 'OK', {
        duration: 3000,
      });
      this.showFavMovie();
    });
  }

  /**
   * Removes a movie from logged in user's favorited movies
   * @param MovieID {string}
   *  @param Title {string} Title of the movie
   */
  deleteFavMovie(MovieID: string, Title: string): void {
    this.fetchApiData.deleteFavoriteMovies(MovieID).subscribe((response: any) => {
      this.snackBar.open(`${Title} is removed from favourites.`, 'OK', {
        duration: 3000,
      });
      this.showFavMovie();
    });
  }


  /**
  * function to check if a movie is favorited
  * @param MovieID 
  * @returns boolean true or false
  */
  isFav(MovieID: string): boolean {
    return this.FavMovie.some((id) => id === MovieID);
  }

  /**
   * function to toggle favorited status
   * @function addFavMovie or 
   * @function deleteFavMovie
   * depending on fav status
   * @param movie 
   */
  setFavStatus(movie: any): void {
    this.isFav(movie._id)
      ? this.deleteFavMovie(movie._id, movie.Title)
      : this.addFavMovie(movie._id, movie.Title);
  }

  /**
   * open Movie dialog
   * @param title 
   * @param poster
   * @param description 
   */
  openMovieDialog(title: string, poster: any, description: string): void {
    this.dialog.open(MovieViewComponent, {
      data: {
        Title: title,
        Poster: poster,
        Description: description,
      },
      width: '500px',
    });
  }

  /**
  * open Genre dialog
  * @param name 
  * @param description 
  */
  openGenreDialog(name: string, description: string): void {
    this.dialog.open(GenreViewComponent, {
      data: {
        name,
        description,
      },
      width: '500px',
    });
  }

  /**
  * open Director dialog
  * @param name 
  * @param bio 
  * @param birthdate
  */
  openDirectorDialog(name: string, bio: string, birthdate: Date): void {
    this.dialog.open(DirectorViewComponent, {
      data: { name, bio, birthdate },
      width: '500px',
    });
  }

  /**
   * function to log out a user and clear localStorage
   * additional reroute to welcome page
   */
  logOut(): void {
    localStorage.clear();
    this.snackBar.open('You have been successfully logged out', 'Ok', {
      duration: 2000,
    });
    this.router.navigate(['welcome']);
  }

  /**
   * Route to Movies page
   */
  goToMoviesPage(): void {
    this.router.navigate(['movies']);
  }

  /**
   * Route to Profile page
   */
  toProfile(): void {
    this.router.navigate(['users']);
  }

  /**
   * Route to Movies page
   */
  toHome(): void {
    this.router.navigate(['movies']);
  }
}
