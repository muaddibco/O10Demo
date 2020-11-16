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

  sendUniversalProofs(accountId: number, target: string, sessionKey: string, spInfo: string, rootAttributeId: number, identityPools: IdentityPool[]) {
    return this.http.post(this.uri + '/UniversalProofs?accountId=' + accountId, {
      target: target,
      sessionKey: sessionKey,
      serviceProviderInfo: spInfo,
      rootAttributeId: rootAttributeId,
      identityPools: identityPools
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

  getServiceProviderActionInfo(accountId: number, actionInfo: string, attributeId: number) {
    return this.http.get<ServiceProviderActionAndValidations>(this.uri + '/ServiceProviderActionInfo?accountId=' + accountId + '&actionInfo=' + actionInfo + '&attributeId=' + attributeId)
    .pipe(
      catchError(error => {
        const msg = "Failed to get service provider action info due to the error: " + error.message;
        this.messageService.error(msg);
        return of(<ServiceProviderActionAndValidations>null);
      }),
      map(r => r)
    );
}

  getFirstSuitableRoot(userAttributeScheme: UserAttributeScheme) {
    let rootAttribute = userAttributeScheme.rootAttributes.find(r => !r.isOverriden);
    if (!rootAttribute) {
      rootAttribute = userAttributeScheme.rootAttributes[0];
    }

    return rootAttribute;
  }
}

export class IdentityPool {
  rootAttributeId: number;
  associatedAttributes: number[];
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
  schemeName: string;
  alias: string;
  content: string;
  valueType: string;
  attributeId: number;
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

export interface ServiceProviderActionAndValidations {
	isRegistered: boolean;
	publicKey: string;
	publicKey2: string;
	sessionKey: string;
	isBiomteryRequired: boolean;
	extraInfo: string;
	predefinedAttributeId: number;
	validations: string[];
}