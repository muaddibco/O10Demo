import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { MessageService } from './message.service';
import { demoConfig } from "./demo-state.service";

@Injectable({
  providedIn: 'root'
})
export class IdentityProvidersService {

  constructor(
    private http: HttpClient,
    private messageService: MessageService){ }
  
  activate(accountId: number) {
    return this.http.post<ActionStatus>(demoConfig.baseUri + '/api/IdentityProvider/Activate?accountId=' + accountId, {})
    .pipe(
      catchError(error => {
        const msg = "Failed to activate IdP due to the error: " + error.message;
        this.messageService.error(msg);
        return of(<ActionStatus>{actionSucceeded: false});
      }),
      map(r => r)
    );
  }
}

export interface ActionStatus {
  integrationType: string,
  integrationAction: string,
  integrationAddress: string,
  actionSucceeded: boolean,
  errorMsg: string
}