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

  movies: any[] = [];
  user: any = localStorage.getItem('user');
  FavMovie: any[] = [];


  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public router: Router,
    public snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.getMovies();
    this.showFavMovie();
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      return this.movies;
    });
  }

  showFavMovie(): void {
    this.fetchApiData.getUserProfile().subscribe((resp: any) => {
      this.FavMovie = resp.FavouriteMovies;
      return this.FavMovie;
    });
  }

  addFavMovie(MovieID: string, Title: string): void {
    this.fetchApiData.addFavoriteMovies(MovieID).subscribe((response: any) => {
      this.snackBar.open(`${Title} is added to your favourites.`, 'OK', {
        duration: 3000,
      });
      this.showFavMovie();
    });
  }

  deleteFavMovie(MovieID: string, Title: string): void {
    this.fetchApiData.deleteFavoriteMovies(MovieID).subscribe((response: any) => {
      this.snackBar.open(`${Title} is removed from favourites.`, 'OK', {
        duration: 3000,
      });
      this.showFavMovie();
    });
  }

  isFav(MovieID: string): boolean {
    return this.FavMovie.some((id) => id === MovieID);
  }

  setFavStatus(movie: any): void {
    this.isFav(movie._id)
      ? this.deleteFavMovie(movie._id, movie.Title)
      : this.addFavMovie(movie._id, movie.Title);
  }

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

  openGenreDialog(name: string, description: string): void {
    this.dialog.open(GenreViewComponent, {
      data: {
        name,
        description,
      },
      width: '500px',
    });
  }

  openDirectorDialog(name: string, bio: string, birthdate: Date): void {
    this.dialog.open(DirectorViewComponent, {
      data: { name, bio, birthdate },
      width: '500px',
    });
  }

  logOut(): void {
    localStorage.clear();
    this.snackBar.open('You have been successfully logged out', 'Ok', {
      duration: 2000,
    });
    this.router.navigate(['welcome']);
  }

  goToMoviesPage(): void {
    this.router.navigate(['movies']);
  }

  toProfile(): void {
    this.router.navigate(['users']);
  }

  toHome(): void {
    this.router.navigate(['movies']);
  }
}
