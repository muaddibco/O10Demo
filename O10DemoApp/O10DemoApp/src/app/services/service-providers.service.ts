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
  private uriSps: string = demoConfig.baseUri + '/api/ServiceProviders';

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

  SetIdentityAttributeValidationDefinitions(accountId: number, validations: IdentityAttributeValidationDefinition[]) {
    return this.http.put(this.uriSps + '/IdentityAttributeValidationDefinitions?accountId=' + accountId, { identityAttributeValidationDefinitions: validations })
      .pipe(
        catchError(error => {
          const msg = "Failed to set identity attribute validation definitions due to the error: " + error.message;
          this.messageService.error(msg);
          return of(false);
        }),
        map(r => {
          if (typeof r === "boolean") {
            return r;
          } else {
            return true;
          }
        })
      );
  }

  GetServiceProviderActionInfo(actionType: number, publicKey: string, sessionKey: string, registrationKey: string) {
    return this.http.get<ServiceProviderActionInfo>(this.uriSpUsers + '/Action?t=' + actionType + "&pk=" + publicKey + "&sk=" + sessionKey + "&rk=" + registrationKey)
      .pipe(
        catchError(error => {
          const msg = "Failed to service provider action info due to the error: " + error.message;
          this.messageService.error(msg);
          return of(<ServiceProviderActionInfo>null);
        }),
        map(r => r)
      );
  }
}

export interface SessionInfo {
  publicKey: string;
  sessionKey: string;
}

export class IdentityAttributeValidationDefinition {
  schemeName: string;
  validationType: string;
}

export interface ServiceProviderActionInfo {
  spInfo: string;
  isRegistered: boolean;
  publicKey: string;
  publicKey2: string;
  sessionKey: string;
  isBiometryRequired: boolean;
  extraInfo: string;
  predefinedAttributeId: number;
  validations: string[];
}