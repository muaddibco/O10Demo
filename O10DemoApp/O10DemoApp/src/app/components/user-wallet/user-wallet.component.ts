import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { AccountsService } from 'src/app/services/accounts.service';
import { MessageService } from 'src/app/services/message.service';
import { AttributesIssuanceRequest, UserAttributeScheme, UsersService } from 'src/app/services/users.service';
import { AuthenticatePwdComponent } from '../dialogs/authenticate-pwd/authenticate-pwd.component';
import { RequestIdentityComponent, RequestIdentityOutput } from "../dialogs/request-identity/request-identity.component";

@Component({
  selector: 'app-user-wallet',
  templateUrl: './user-wallet.component.html',
  styleUrls: ['./user-wallet.component.scss']
})
export class UserWalletComponent implements OnInit {

  private accountId: number;
  public userAttributeSchemes: UserAttributeScheme[] = [];

  constructor(
    private userService: UsersService,
    private accountsService: AccountsService,
    private messagesSerivce: MessageService,
    private dialog: MatDialog
  ) {
    this.accountId = parseInt(sessionStorage.getItem("accountId"));
  }

  ngOnInit(): void {
    this.accountsService.startAccount(this.accountId).subscribe(r => {});
    this.userService.getUserAttributes(this.accountId).subscribe(r => {
      this.userAttributeSchemes = r;
    });
  }

  requestRootIdentity() {

    const authSubj = new Subject<boolean>();
    authSubj.subscribe(b => {
      if (b) {
        const dialogRef = this.dialog.open(RequestIdentityComponent, {
          width: '800px', data: {}
        })

        dialogRef.afterClosed().subscribe(r => {
          console.info("Requesting attributes:", r);
          const res: RequestIdentityOutput = <RequestIdentityOutput>r;
          console.info("Requesting attributes2:", res);
          const req: AttributesIssuanceRequest = {
            masterRootAttributeId: null,
            issuer: res.issuer,
            attributeValues: {}
          }
          for (const attr of res.attributeValues) {
            req.attributeValues[attr.name] = attr.value;
          }
          console.info("Requesting attributes2:", req);
          this.userService.requestAttributesIssuance(this.accountId, req).subscribe(r => {
            this.messagesSerivce.add("Attributes from the issuer " + req.issuer + " were requested successfully");
          })
        });
      }
    });

    const dialogAuthRef = this.dialog.open(AuthenticatePwdComponent, { width: '500px' });
    dialogAuthRef.afterClosed().subscribe(p => {
      this.accountsService.initiateBindingKey(this.accountId, p.password).subscribe(b => authSubj.next(b));
    });
  }

}
