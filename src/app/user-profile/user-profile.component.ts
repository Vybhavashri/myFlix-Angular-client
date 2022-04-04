import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserEditComponent } from '../user-edit/user-edit.component';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MovieViewComponent } from '../movie-view/movie-view.component';
import { GenreViewComponent } from '../genre-view/genre-view.component';
import { DirectorViewComponent } from '../director-view/director-view.component';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  //Setting the initial values to null
  user: any = {};
  movies: any[] = [];
  FavMovie: any = [];

  /**
   * Called when creating an instance of the class
   * @param fetchApiData 
   * @param snackBar 
   * @param dialog 
   * @param router 
   */
  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    public router: Router
  ) { }

  /**
 * Initializes the component
 */
  ngOnInit(): void {
    this.getCurrentUser();
    this.getFavMovie();
  }

  /**
   * calls API endpoint to get user info
   * @function getUserProfile
   * @return user data in JSON format
   */
  getCurrentUser(): void {
    this.fetchApiData.getUserProfile().subscribe((response: any) => {
      this.user = response;
      return (this.user);
    });
  }

  /**
 * function to let the user display their favorited movies 
 * @function getAllMovies
 */
  getFavMovie(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      this.movies.forEach((movie: any) => {
        if (this.user.FavouriteMovies.includes(movie._id)) {
          this.FavMovie.push(movie);
        }
      });
    });
  }

  /**
   * @function deleteFavoriteMovies
   * @param MovieID 
   * calls api endpoint to remove movie fron favourite list
   */
  removeFavMovie(MovieID: string, Title: string): void {
    this.fetchApiData.deleteFavoriteMovies(MovieID).subscribe((resp) => {
      this.snackBar.open(
        `${Title} is no longer favorited`,
        'OK',
        {
          duration: 1000,
        }
      );
      setTimeout(function () {
        window.location.reload();
      }, 1000);
    });
  }

  /**
   * Open user-edit component
   */
  openEditUserProfile(): void {
    this.dialog.open(UserEditComponent, {
      width: '500px'
    });
  }

  /**
   * @function deleteProfile
   * calls api endpoint to delete user profile + clear local storage
   */
  deleteProfile(): void {
    if (confirm('Are you sure? This cannot be undone.')) {
      this.router.navigate(['welcome']).then(() => {
        this.snackBar.open('Your account was deleted', 'OK', { duration: 6000 });
        localStorage.clear();
      });
      this.router.navigate(['welcome'])
      this.fetchApiData.deleteUserProfile().subscribe(() => {
        localStorage.clear();
      });
    }
  }

  /**
   * Logsout user + clear local storage
   */
  logOut(): void {
    localStorage.clear();
    this.snackBar.open('You have been successfully logged out', 'Ok', {
      duration: 2000,
    });
    this.router.navigate(['welcome']);
  }

  /**
   * Opens movie detail dialog
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
   * Opens genre view dialog
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
   * Opens director view dialog
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
   * Navigate to profile page
   */
  toProfile(): void {
    this.router.navigate(['users']);
  }

  /**
   * Navigate to home page
   */
  toHome(): void {
    this.router.navigate(['movies']);
  }

}