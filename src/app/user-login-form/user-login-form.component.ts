import { Component, OnInit, Input } from '@angular/core';

// You'll use this import to close the dialog on success
import { MatDialogRef } from '@angular/material/dialog';

// This import brings in the API calls we created in 6.2
import { FetchApiDataService } from '../fetch-api-data.service';

// This import is used to display notifications back to the user
import { MatSnackBar } from '@angular/material/snack-bar';

import { Router } from '@angular/router';

@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrls: ['./user-login-form.component.css']
})
export class UserLoginFormComponent implements OnInit {

  /**
 * Binds input values to userCredentials object
 */
  @Input() userCredentials = { Username: '', Password: '' };

  /**
   * Called when creating an instance of the class
   * @param fetchApiData 
   * @param dialogRef 
   * @param snackBar 
   * @param router 
   */
  constructor(public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  // This is the function responsible for sending the form inputs to the backend
  /**
   * Function for sending the form inputs to the backend to login user
   * @returns alert indicating a successful login or an error
   */
  loginUser(): void {
    this.fetchApiData.userLogin(this.userCredentials).subscribe(
      (response) => {
        this.dialogRef.close();// close modal on success 
        // set user and token to local storage
        localStorage.setItem('username', response.user.Username);
        localStorage.setItem('token', response.token);
        // logic for successful user registration
        this.snackBar.open('User has logged in', 'OK', {
          duration: 2000,
        });
        this.router.navigate(['movies']);
      },
      (response) => {
        this.snackBar.open("Incorrect information, please try again", 'OK', {
          duration: 2000,
        });
      }
    );
  }
}
