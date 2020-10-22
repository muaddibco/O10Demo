import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
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
  public displayedAssociatedAttrColumns = ["alias", "content"]

  constructor(
    private router: Router,
    private userService: UsersService,
    private accountsService: AccountsService,
    private messagesSerivce: MessageService,
    private dialog: MatDialog
  ) {
    this.accountId = parseInt(sessionStorage.getItem("accountId"));
  }

  ngOnInit(): void {
    const that = this;

    const authSubject = new Subject<boolean>();
    authSubject.subscribe(_b => {
      const dialogAuthRef = this.dialog.open(AuthenticatePwdComponent, { width: '500px' });
      dialogAuthRef.afterClosed().subscribe(p => {
        if (p) {
          this.accountsService.initiateBindingKey(this.accountId, p.password).subscribe(b => {
            if (!b) {
              authSubject.next(true);
            }
          });
        } else {
          that.router.navigate(['/dashboard']);
        }
      });
    })

    this.accountsService.startAccount(this.accountId).subscribe(r => {
      if (r) {
        that.accountsService.isBindingKeySet(that.accountId).subscribe(r1 => {
          if (!r1) {
            authSubject.next(true);
          }
        })
      }
    });
    this.userService.getUserAttributes(this.accountId).subscribe(r => {
      this.userAttributeSchemes = r;
    });
  }

  requestRootIdentity() {

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

  requestAssociatedIdentity(rootScheme: UserAttributeScheme) {
    const rootAttr = rootScheme.rootAttributes.find(r => !r.isOverriden);

    const dialogRef = this.dialog.open(RequestIdentityComponent, {
      width: '800px', data: {}
    })

    dialogRef.afterClosed().subscribe(r => {
      console.info("Requesting attributes:", r);
      const res: RequestIdentityOutput = <RequestIdentityOutput>r;
      console.info("Requesting attributes2:", res);
      const req: AttributesIssuanceRequest = {
        masterRootAttributeId: rootAttr.userAttributeId,
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
}
