import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { demoConfig } from 'src/app/services/demo-state.service';
import { ServiceProvidersService } from 'src/app/services/service-providers.service';
import { UserAttributeScheme, UsersService } from 'src/app/services/users.service';

export class DialogData {
  userAttributeSchemes: UserAttributeScheme[];
  spPublicKey: string;
  sessionKey: string;
  accountId: number;
}

export class AttributeForValidation {
  content: string;
  issuerName: string;
  isApproved: boolean;
  attributeId: number;
  schemeName: string;
  alias: string;
}

export class IdentityConfirmationDialogOutput {
  rootAttributeId: number;
  validations: AttributeForValidation[];
}

@Component({
  selector: 'app-identity-confirmation',
  templateUrl: './identity-confirmation.component.html',
  styleUrls: ['./identity-confirmation.component.scss']
})
export class IdentityConfirmationComponent implements OnInit {

  public dialogOutput: IdentityConfirmationDialogOutput = {
    rootAttributeId: 0,
    validations: []
  };

  public showValidations: boolean = false;

  constructor(
    private spService: ServiceProvidersService,
    private userService: UsersService,
    private dialogRef: MatDialogRef<IdentityConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  ngOnInit(): void {
  }

  onCancel() {
    this.dialogRef.close();
  }

  onRootSelectionChanged(evt: MatSelectChange) {
    var selectedScheme: UserAttributeScheme = evt.value as UserAttributeScheme;
    let rootAttribute = this.userService.getFirstSuitableRoot(selectedScheme);
    this.dialogOutput.rootAttributeId = rootAttribute.userAttributeId;
    const actionInfo = btoa("spp://" + demoConfig.baseUri + "/api/SpUsers/Action?t=0&pk=" + this.data.spPublicKey + "&sk=" + this.data.sessionKey);
    this.userService.getServiceProviderActionInfo(this.data.accountId, actionInfo, rootAttribute.userAttributeId).subscribe(r => {
      this.dialogOutput.validations = [];
      if (r) {
        for (const v of r.validations) {
          const schemeName = v.split(':')[0];
          const pool = selectedScheme.associatedSchemes.find(s => s.attributes.find(a => a.schemeName === schemeName));
          const attr = pool.attributes.find(a => a.schemeName === schemeName);
          if (attr) {
            this.dialogOutput.validations.push({
              attributeId: attr.attributeId,
              content: attr.content,
              issuerName: pool.issuerName,
              schemeName: schemeName,
              alias: attr.alias,
              isApproved: true
            });
          } else {
            this.dialogOutput.validations.push({
              attributeId: 0,
              content: null,
              isApproved: false,
              issuerName: null,
              schemeName: schemeName,
              alias: null
            });
          }
        }

        this.showValidations = this.dialogOutput.validations.length > 0;
      }
    });
  }

  onValidationApproveChange(evt: MatSlideToggleChange) {
    for (const validation of this.dialogOutput.validations) {
      if (validation.attributeId.toString() == evt.source.id.toString()) {
        validation.isApproved = evt.checked;
      }
    }
  }
}
