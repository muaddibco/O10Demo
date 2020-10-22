import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { AccountsService } from './services/accounts.service';
import { DemoAccount, demoConfig, DemoIdpAccount, DemoSpAccount } from './services/demo-state.service';
import { IdentityProvidersService } from './services/identity-providers.service';
import { MessageService } from "./services/message.service";
import { SchemeResolutionService } from './services/scheme-resolution.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'O10DemoApp';

  constructor(
    private messageService: MessageService,
    private accountsService: AccountsService,
    private schemeDefinitionService: SchemeResolutionService,
    private identityProviderService: IdentityProvidersService) {

  }

  ngOnInit(): void {
    const that = this;

    const accountRegisteredSubject = new Subject<DemoIdpAccount>();
    accountRegisteredSubject.subscribe(d => {
      d.currentState = "setting up identity scheme...";
      that.schemeDefinitionService.putAttributeDefinitions(d.account.publicSpendKey, d.identityScheme).subscribe(r => {
        d.activationFinished = true;
        if (!r.integrationActionStatus.actionSucceeded) {
          d.isInErrorState = true;
          d.currentState = "setting up identity scheme failed, error: " + r.integrationActionStatus.errorMsg
          this.messageService.add("Initializing of the demo account " + d.accountName + " failed");
        } else {
          d.currentState = "setting up identity scheme completed"
          this.messageService.add("Initializing of the demo account " + d.accountName + " completed");
        }
      });
    });

    const accountSubject = new Subject<DemoAccount>();
    accountSubject.subscribe(a => {
      a.currentState = "starting account...";
      that.accountsService.startAccount(a.account.accountId).subscribe(r => {
        a.currentState = "setting RSK integration...";
        that.accountsService.setRskIntegration(a.account.accountId).subscribe(r => {
          if (r) {
            if (a.accountType === 1) {
              a.currentState = "setting up smart-contract registration...";
              that.identityProviderService.activate(a.account.accountId).subscribe(r => {
                a.activated = r.actionSucceeded;
                a.rskAddress = r.integrationAddress;
                if (r.actionSucceeded) {
                  a.currentState = "smart-contract registration completed";
                  accountRegisteredSubject.next(<DemoIdpAccount>a);
                } else {
                  a.activationFinished = true;
                  a.isInErrorState = true;
                  a.currentState = "smart-contract registration failed, error: " + r.errorMsg;
                  this.messageService.add("Initializing of the demo account " + a.accountName + " failed");
                }
              });
            } else if (a.accountType === 2) {

            }
          }
        });
      });
    });

    for (const d of demoConfig.idpAccounts) {
      d.currentState = "Getting account details...";
    }

    this.accountsService.get(1).subscribe(accounts => {
      for (const account of accounts) {
        const d = demoConfig.idpAccounts.find(a => a.accountName === account.accountInfo);
        if (d) {
          d.account = account;
        }
      }

      for (const d of demoConfig.idpAccounts) {
        this.messageService.add("Initializing demo account " + d.accountName);
        if (!d.account) {
          d.currentState = "registering account on the server...";
          that.accountsService.register(d.accountType, d.accountName, "qqq").subscribe(account => {
            d.account = account;
            accountSubject.next(d);
          });
        } else {
          accountSubject.next(d);
        }
      }
    });

    this.accountsService.get(2).subscribe(accounts => {
      for (const account of accounts) {
        const demoAccount = demoConfig.spAccounts.find(a => a.accountName === account.accountInfo);
        if (demoAccount) {
          demoAccount.account = account;
        }
      }

      for (const d of demoConfig.spAccounts) {
        this.messageService.add("Initializing demo account " + d.accountName);
        if (!d.account) {
          d.currentState = "registering account on the server...";
          that.accountsService.register(d.accountType, d.accountName, "qqq").subscribe(account => {
            d.account = account;
            accountSubject.next(d);
          });
        } else {
          accountSubject.next(d);
        }
      }
    });
  }
}
