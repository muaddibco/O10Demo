import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';

export interface RegistrationData {
  alias: string;
  password: string;
}

@Component({
  selector: 'app-register-account',
  templateUrl: './register-account.component.html',
  styleUrls: ['./register-account.component.scss']
})
export class RegisterAccountComponent {
  public alias = new FormControl('', [Validators.required]);
  public password = new FormControl('', [Validators.required]);
  public hidePassword = true;

  constructor(
    private dialog: MatDialogRef<RegisterAccountComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RegistrationData) {
  }

  onCancelRegistration() {
    this.dialog.close();
  }
}
