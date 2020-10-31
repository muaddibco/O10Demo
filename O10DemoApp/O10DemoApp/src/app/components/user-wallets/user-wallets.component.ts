import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AccountDTO, AccountsService } from 'src/app/services/accounts.service';
import { MessageService } from 'src/app/services/message.service';
import { RegisterAccountComponent } from "../dialogs/register-account/register-account.component";

@Component({
  selector: 'app-user-wallets',
  templateUrl: './user-wallets.component.html',
  styleUrls: ['./user-wallets.component.scss']
})
export class UserWalletsComponent implements OnInit {

  public accounts: AccountDTO[] = [];
  public accountsDataSource: MatTableDataSource<AccountDTO>;
  public displayedColumns: string[] = ['accountId', 'accountInfo'];

  constructor(
    private accountsService: AccountsService,
    private messagesSerivce: MessageService,
    private router: Router,
    private dialog: MatDialog) { 
      this.accountsDataSource = new MatTableDataSource<AccountDTO>();
    }

  ngOnInit(): void {
    console.info("user-wallet :: ngOnInit()")
    this.getAccounts();
  }

  private getAccounts() {
    this.accountsService.get(3).subscribe(r => {
      console.info("user-wallet :: obtained " + r.length + " accounts");
      this.accounts = r;
      this.accountsDataSource.data = r;
    });
  }

  onAddAccount() {
    const dialogRef = this.dialog.open(RegisterAccountComponent, {
      width: '250px', data: {}
    })

    dialogRef.afterClosed().subscribe(res => {
      this.accountsService.register(3, res.alias, res.password).subscribe(r => {
        this.accounts = [...this.accounts, r];
        this.accountsDataSource.data = this.accounts;
        this.messagesSerivce.add("Account " + res.alias + " registered successfully");
      })
    });
  }

  onOpenWallet(accountId: number) {
    sessionStorage.setItem("accountId", accountId.toString());
    this.router.navigate(['/user-wallet']);
  }
}
