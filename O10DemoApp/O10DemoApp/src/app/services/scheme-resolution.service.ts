import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { ActionStatus } from './identity-providers.service';
import { MessageService } from './message.service';
import { demoConfig } from './demo-state.service';

@Injectable({
  providedIn: 'root'
})
export class SchemeResolutionService {

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

    putAttributeDefinitions(issuer: string, attributeDefinitions: NewAttributeDefinition[]) {
      return this.http.put<AttributeDefinitionsResponse>(demoConfig.baseUri + "/api/SchemeResolution/AttributeDefinitions?issuer=" + issuer, attributeDefinitions)
      .pipe(
        catchError(error => {
          const msg = "Failed to put attribute definitions: " + error.message;
          this.messageService.error(msg);
          return of(<AttributeDefinitionsResponse>null);
        })
      );
    }
  }

export interface AttributeDefinitionsResponse {
  attributeDefinitions: AttributeDefinition[];
  integrationActionStatus: ActionStatus
}

export class NewAttributeDefinition {
  attributeName: string;
  schemeName: string;
  alias: string;
  description: string;
  isRoot: boolean;
}

export interface AttributeDefinition {
  schemeId: number;
  attributeName: string;
  schemeName: string;
  alias: string;
  description: string;
  isRoot: boolean;
  isActive: boolean;
}