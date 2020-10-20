import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

export class PwdData {
  password: string;
}

@Component({
  selector: 'app-authenticate-pwd',
  templateUrl: './authenticate-pwd.component.html',
  styleUrls: ['./authenticate-pwd.component.scss']
})
export class AuthenticatePwdComponent implements OnInit {
  public data: PwdData = new PwdData();
  public password = new FormControl('', [Validators.required]);
  public hidePassword = true;

  constructor(
    private dialog: MatDialogRef<AuthenticatePwdComponent>
  ) { }

  ngOnInit(): void {
  }

  onCancel() {
    this.dialog.close();
  }
}
