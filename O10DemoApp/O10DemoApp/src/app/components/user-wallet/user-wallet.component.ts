import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AccountsService } from 'src/app/services/accounts.service';
import { demoConfig, DemoSpAccount } from 'src/app/services/demo-state.service';
import { ElectionCommitteeService, Poll } from 'src/app/services/election-committee.service';
import { MessageService } from 'src/app/services/message.service';
import { AttributesIssuanceRequest, UserAttributeScheme, UsersService } from 'src/app/services/users.service';
import { AuthenticatePwdComponent } from '../dialogs/authenticate-pwd/authenticate-pwd.component';
import { RequestIdentityComponent, RequestIdentityOutput } from "../dialogs/request-identity/request-identity.component";
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@aspnet/signalr';

@Component({
  selector: 'app-user-wallet',
  templateUrl: './user-wallet.component.html',
  styleUrls: ['./user-wallet.component.scss']
})
export class UserWalletComponent implements OnInit {

  public hubConnection: HubConnection;
  private accountId: number;
  public userAttributeSchemes: UserAttributeScheme[] = [];
  public displayedAssociatedAttrColumns = ["alias", "content"]

  public serviceProviders: DemoSpAccount[];
  public displayedSpColumns = ["accountName"]

  public polls: Poll[] = [];

  public updating = false;

  constructor(
    private router: Router,
    private userService: UsersService,
    private accountsService: AccountsService,
    private ecService: ElectionCommitteeService,
    private messagesSerivce: MessageService,
    private dialog: MatDialog
  ) {
    this.accountId = parseInt(sessionStorage.getItem("accountId"));
    this.serviceProviders = demoConfig.spAccounts;
  }

  ngOnInit(): void {
    const that = this;

    this.initializeHub();

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

    this.getAttributes();

    this.getPolls();
  }

  private getPolls() {
    this.ecService.getPollsByState(2).subscribe(p => {
      this.polls = p;
    });
  }

  private getAttributes() {
    this.updating = true;
    this.userService.getUserAttributes(this.accountId).subscribe(r => {
      this.userAttributeSchemes = r;
      this.updating = false;
    });
  }

  private initializeHub() {
    this.hubConnection = new HubConnectionBuilder().withUrl(demoConfig.baseUri + "/identitiesHub").build();
    this.hubConnection.on("PushAttribute", (i) => {
      this.getAttributes();
      this.getPolls();
    });

    this.hubConnection.onclose(e => {
      console.log("hubConnection.onclose: [" + e.name + "] " + e.message);
      this.startHubConnection();
    });

    this.startHubConnection();
  }

  private startHubConnection() {
    console.log("starting hub connection...");
    this.hubConnection.start()
      .then(() => {
        console.log("Hub started");
        this.hubConnection.invoke("AddToGroup", this.accountId.toString());
      })
      .catch(err => {
        console.log("starting hub connection failed");
        console.error(err);
        setTimeout(() => this.startHubConnection(), 1000);
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

  onParticipateInPoll(poll: Poll) {
    sessionStorage.setItem("pollId", poll.pollId.toString());
    this.router.navigate(['/user-vote']);
  }
}
