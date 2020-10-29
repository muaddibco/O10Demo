import { Component, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export class DialogData {
  title: string;
  invitation: string;
  placeholder: string;
}

@Component({
  selector: 'app-input-dialog',
  templateUrl: './input-dialog.component.html',
  styleUrls: ['./input-dialog.component.scss']
})
export class InputDialogComponent {

  public inputStr: string = "";
  public inputCtrl = new FormControl('', [Validators.required]);

  constructor(
    private dialog: MatDialogRef<InputDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  onCancel() {
    this.dialog.close();
  }
}
