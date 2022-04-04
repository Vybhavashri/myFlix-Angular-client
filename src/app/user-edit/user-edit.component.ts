import { Component, OnInit, Input } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FetchApiDataService } from '../fetch-api-data.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {
  /**
   * input values bound to userData
   */
  @Input() userData = { Username: '', Password: '', EmailID: '', Birth: '' };

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserEditComponent>,
    public snackBar: MatSnackBar,
    public router: Router
  ) { }

  ngOnInit(): void {
  }

  /**
   * function to edit user profile
   * @function editUserProfile 
   * @param this.userData
   * @returns updated user info in JSON format + storage in localStorage
   */
  editUserProfile(): void {
    this.fetchApiData.editUserProfile(this.userData).subscribe((res) => {
      this.dialogRef.close();
      window.location.reload();
      localStorage.setItem('username', res.Username)
      this.snackBar.open(this.userData.Username, 'Successfully updated user details!', {
        duration: 2000
      });
    }, (res) => {
      this.snackBar.open(res, 'OK', {
        duration: 2000
      });
    })
  }
}