import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';

@Component({
  selector: 'app-movie-view',
  templateUrl: './movie-view.component.html',
  styleUrls: ['./movie-view.component.css']
})
export class MovieViewComponent implements OnInit {

  /**
   * Called when creating an instance of the class
   * @param fetchApiData 
   * @param movie 
   */
  constructor(
    public fetchApiData: FetchApiDataService,
    @Inject(MAT_DIALOG_DATA)
    public movie: {
      Title: string;
      Poster: any;
      Description: string;
      Genre: string;
    }
  ) { }

  /**
   * Initializes the component
   */
  ngOnInit(): void { }
}