import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AccountDTO } from './accounts.service';
import { NewAttributeDefinition } from './scheme-resolution.service';

@Injectable({
  providedIn: 'root'
})
export class DemoStateService {

  public identityProviders: DemoIdpAccount[];
  public serviceProviders: DemoSpAccount[];

  constructor() { }
}

export class DemoAccount {
  accountType: number;
  accountName: string;
  account: AccountDTO;
  rskAddress: string;
  activated: boolean;
  activationFinished: boolean;
  currentState: string;
  isInErrorState: boolean;
}

export class DemoIdpAccount extends DemoAccount {
  identityScheme: NewAttributeDefinition[];
}

export class DemoSpAccount extends DemoAccount {
  validations: RequiredValidation[];
}

export class RequiredValidation {
  name: string;
  schemeName: string;
  validationType: number; // 1 - match value, 2 - check for age, 3 - check for inclusion into group
}

export class DemoConfig {
  public baseUri: string;
  public idpAccounts: DemoIdpAccount[];
  public spAccounts: DemoSpAccount[];
}


export const demoConfig: DemoConfig = {
  baseUri: "http://localhost:5003",
  idpAccounts: [
    {
      accountName: "Ministry of Interior",
      accountType: 1,
      activated: false,
      rskAddress: "",
      activationFinished: false,
      currentState: "",
      isInErrorState: false,
      identityScheme: [
        {
          isRoot: true,
          attributeName: "IDCard",
          alias: "ID Card",
          schemeName: "IdCard",
          description: ""
        },
        {
          isRoot: false,
          attributeName: "FirstName",
          alias: "First Name",
          schemeName: "FirstName",
          description: ""
        },
        {
          isRoot: false,
          attributeName: "LastName",
          alias: "Last Name",
          schemeName: "LastName",
          description: ""
        }
      ],
      account: null,
    },
    {
      accountName: "NorthWest Hospital",
      accountType: 1,
      activated: false,
      rskAddress: "",
      activationFinished: false,
      currentState: "",
      isInErrorState: false,
      identityScheme: [
        {
          isRoot: true,
          schemeName: "DrivingLicense",
          attributeName: "CertificateNumber",
          alias: "Certificate Number",
          description: ""
        }
      ],
      account: null,
    }
  ],
  spAccounts: [
    {
      accountName: "Municipality",
      accountType: 2,
      activated: false,
      rskAddress: "",
      activationFinished: false,
      currentState: "",
      isInErrorState: false,
      validations: [],
      account: null,
    },
    {
      accountName: "Border Control",
      accountType: 2,
      activated: false,
      rskAddress: "",
      activationFinished: false,
      currentState: "",
      isInErrorState: false,
      validations: [
        {
          name: "First Name",
          schemeName: "FirstName",
          validationType: 1
        },
        {
          name: "Last Name",
          schemeName: "LastName",
          validationType: 1
        }
      ],
      account: null,
    }
  ]
}