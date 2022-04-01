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

  user: any = localStorage.getItem('user');
  favs: any = null;

  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.getCurrentUser();
  }

  getCurrentUser(): void {
    this.fetchApiData.getUserProfile().subscribe((resp: any) => {
      this.user = resp;
      this.favs = resp.FavouriteMovies;
      console.log('this.favs', this.favs)
      return (this.user, this.favs);
    });
  }

  openMovieDialog(title: string, poster: any, description: string): void {
    this.dialog.open(MovieViewComponent, {
      data: {
        Title: title,
        Poster: poster,
        Description: description,
      },
      width: '500px'
    });
  }
  openGenre(name: string, description: string): void {
    this.dialog.open(GenreViewComponent, {
      data: {
        Name: name,
        Description: description,
      },
      width: '500px'
    });
  }
  openDirector(name: string, bio: string, birth: string): void {
    this.dialog.open(DirectorViewComponent, {
      data: {
        Name: name,
        Bio: bio,
        Birth: birth,
      },
      width: '500px'
    });
  }

  openEditUserProfile(): void {
    this.dialog.open(UserEditComponent, {
      width: '500px'
    });
  }

  // filter out the movies that aren't favs
  getFavs(): void {
    let movies: any[] = [];
    this.fetchApiData.getAllMovies().subscribe((res: any) => {
      movies = res;
      movies.forEach((movie: any) => {
        if (this.user.favorites.includes(movie._id)) {
          this.favs.push(movie);
        }
      });
    });
    return this.favs;
  }

  removeFav(id: string): void {
    this.fetchApiData.deleteFavoriteMovies(id).subscribe((res: any) => {
      this.snackBar.open('Successfully removed from favorite movies.', 'OK', {
        duration: 2000,
      });
      this.ngOnInit();
      return this.favs;
    })
  }

  deleteProfile(): void {
    if (confirm('Are you sure? This cannot be undone.')) {
      this.router.navigate(['welcome']).then(() => {
        this.snackBar.open('Your account was deleted', 'OK', { duration: 6000 });
      });
      this.router.navigate(['welcome'])
      this.fetchApiData.deleteUserProfile().subscribe(() => {
        localStorage.clear();
      });
    }
  }

}