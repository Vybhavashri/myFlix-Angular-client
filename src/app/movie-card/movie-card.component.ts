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

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public router: Router,
    public snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.getMovies();
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
      return this.movies;
    });
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
}
