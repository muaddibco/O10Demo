import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageService } from './message.service';
import { demoConfig } from './demo-state.service';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ServiceProvidersService {

  private uriSpUsers: string = demoConfig.baseUri + '/api/SpUsers';

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  GetSessionInfo(accountId: number) {
    return this.http.get<SessionInfo>(this.uriSpUsers + '/GetSessionInfo/' + accountId)
      .pipe(
        catchError(error => {
          const msg = "Failed to obtain session info due to the error: " + error.message;
          this.messageService.error(msg);
          return of(<SessionInfo>null);
        }),
        map(r => r)
      );
  }
}

export interface SessionInfo {
  publicKey: string;
  sessionKey: string;
}