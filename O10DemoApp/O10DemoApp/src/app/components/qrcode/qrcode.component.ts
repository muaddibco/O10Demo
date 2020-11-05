import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-qrcode',
  templateUrl: './qrcode.component.html',
  styleUrls: ['./qrcode.component.scss']
})
export class QrcodeComponent {

  @Input() public stringContent: string = '';
  @Input() public size: number = 256;
  @Input() public level: string = "Q";
  @Input() public showTip: boolean = true;
  @Output() public copiedEvent = new EventEmitter();

  constructor() { }

  copyQR() {
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.stringContent;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);

    this.copiedEvent.emit(null);
  }

}
