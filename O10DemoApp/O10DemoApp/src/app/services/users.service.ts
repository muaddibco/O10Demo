import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { demoConfig } from './demo-state.service';
import { MessageService } from './message.service';
import { AttributeDefinition } from './scheme-resolution.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private uri: string = demoConfig.baseUri + '/api/User';

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  requestAttributesIssuance(accountId: number, request: AttributesIssuanceRequest) {
    return this.http.post<AttributeValue[]>(this.uri + '/AttributesIssuance?accountId=' + accountId, request)
      .pipe(
        catchError(error => {
          const msg = "Failed to request attributes issuance due to the error: " + error.message;
          this.messageService.error(msg);
          return of(<AttributeValue[]>[]);
        }),
        map(r => r)
      );
  }

  getUserAttributes(accountId: number) {
    return this.http.get<UserAttributeScheme[]>(this.uri + '/UserAttributes?accountId=' + accountId)
      .pipe(
        catchError(error => {
          const msg = "Failed to fetch user attributes due to the error: " + error.message;
          this.messageService.error(msg);
          return of(<UserAttributeScheme[]>[]);
        }),
        map(r => r)
      );
  }

  castVote(accountId: number, pollId: number, assetIds: string[], selectedAssetId: string) {
    return this.http.post(this.uri + '/Vote?accountId=' + accountId, { pollId: pollId, candidateAssetIds: assetIds, selectedAssetId: selectedAssetId })
      .pipe(
        catchError(error => {
          const msg = "Failed to cast vote due to the error: " + error.message;
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

  sendUniversalProofs(accountId: number, target: string, sessionKey: string, spInfo: string, rootAttributeId: number) {
    return this.http.post(this.uri + '/UniversalProofs?accountId=' + accountId, {
      target: target,
      sessionKey: sessionKey,
      serviceProviderInfo: spInfo,
      rootAttributeId: rootAttributeId
    })
      .pipe(
        catchError(error => {
          const msg = "Failed to send universal proofs due to the error: " + error.message;
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
}

export class AttributesIssuanceRequest {
  masterRootAttributeId: number | null;
  issuer: string;
  attributeValues: { [key: string]: string; };
}

export interface AttributeValue {
  value: string;
  definition: AttributeDefinition;
}

export interface UserAttribute {
  userAttributeId: number;
  schemeName: string;
  source: string;
  issuerName: string;
  validated: boolean;
  content: string;
  state: number;
  isOverriden: boolean;
}

export interface UserAssociatedAttribute {
  attributeName: string;
  alias: string;
  content: string;
  valueType: string;
}

export interface UserAttributeScheme {
  state: number;
  issuer: string;
  issuerName: string;
  rootAttributeContent: string;
  rootAssetId: string;
  schemeName: string;
  rootAttributes: UserAttribute[];
  associatedSchemes: UserAssociatedAttributes[];
}

export interface UserAssociatedAttributes {
  issuer: string;
  issuerName: string;
  attributes: UserAssociatedAttribute[];
}