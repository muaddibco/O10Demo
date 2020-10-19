import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { MessageService } from './message.service';
import { demoConfig } from './demo-state.service';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {

  constructor(
    private http: HttpClient,
    private messageService: MessageService){ }

  getAll() {
    return this.http.get<AccountDTO[]>(demoConfig.baseUri + '/api/accounts')
    .pipe(
      catchError(error => {
        this.messageService.error(error.message);
        return of(<AccountDTO[]>[]);
      })
    );
  }

  get(accountType: number) {
    return this.http.get<AccountDTO[]>(demoConfig.baseUri + '/api/accounts?ofTypeOnly=' + accountType)
    .pipe(
      catchError(error => {
        const msg = "Failed to receive accounts due to the error: " + error.message;
        this.messageService.error(msg);
        return of(<AccountDTO[]>[]);
      })
    );
  }

  register(accountType: number, accountInfo: string, password: string) {
    return this.http.post<AccountDTO>(demoConfig.baseUri + "/api/accounts/register", {accountType, accountInfo, password})
    .pipe(
      catchError(error => {
        const msg = "Failed to register the account due to the error: " + error.message;
        this.messageService.error(msg);
        return of(<AccountDTO>null);
      })
    );
  }

  getRskKey(accountId: number) {
    return this.http.get<Map<string, string>>(demoConfig.baseUri + "/api/accounts/KeyValues?accountId=" + accountId)
    .pipe(
      catchError(error => {
        const msg = "Failed to key-values of the account due to the error: " + error.message;
        this.messageService.error(msg);
        return of(<Map<string, string>>null);
      }),
      map(a => { 
        if(!a || !a.has("rskSecretKey")) {
          return <string>null;
        }

        return a.get("rskSecretKey")
      })
    )
  }

  setRskIntegration(accountId: number) {
    return this.http.put(demoConfig.baseUri + "/api/accounts/Integration?accountId=" + accountId + "&integrationKey=RSK", {})
    .pipe(
      catchError(error => {
        const msg = "Failed to set RSK integration of the account due to the error: " + error.message;
        this.messageService.error(msg);
        return of(false);
      }),
      map(r => true)
    );
  }
}

export interface AccountDTO {
  accountId: number, 
  accountType: number, 
  accountInfo: string, 
  password: string, 
  publicViewKey: string, 
  publicSpendKey: string
}