import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountDTO, AccountsService } from "../../../services/accounts.service";
import { IdentityAttributesScheme, IdentityProvidersService } from 'src/app/services/identity-providers.service';
import { StepperSelectionEvent, STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { KeyValue } from '@angular/common';

export class AttributeValue {
  name: string;
  alias: string;
  value: string;
}
export class RequestIdentityOutput {
  issuer: string;
  attributeValues: AttributeValue[];
}

@Component({
  selector: 'app-request-identity',
  templateUrl: './request-identity.component.html',
  styleUrls: ['./request-identity.component.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: { showError: true }
  }]
})
export class RequestIdentityComponent implements OnInit {

  public output: RequestIdentityOutput;
  public idps: AccountDTO[] = [];
  public selectedIdP: AccountDTO;
  public attributesScheme: IdentityAttributesScheme;
  public attributesFetching: boolean;
  public displayedColumns = ["attributeAlias", "attributeValue"];

  public accountsStepFormGroup: FormGroup;
  public attributesStepFormGroup: FormGroup;

  constructor(
    private dialog: MatDialogRef<RequestIdentityComponent>,
    private accountsService: AccountsService,
    private identityProvidersService: IdentityProvidersService,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.accountsStepFormGroup = this.formBuilder.group({
      idpsSelect: ['', Validators.required]
    });

    this.accountsService.get(1).subscribe(r => {
      this.idps = r;
    });
  }

  onCancel() {
    this.dialog.close();
  }

  selectionChange(evt: StepperSelectionEvent) {
    if (evt.selectedIndex == 1) {
      this.output = null;
      this.attributesFetching = true;

      this.identityProvidersService.getAttributesScheme(this.selectedIdP.accountId).subscribe(r => {
        const rootControl: FormControl = new FormControl('', Validators.required);
        this.attributesStepFormGroup = this.formBuilder.group({});
        this.attributesStepFormGroup.addControl(r.rootAttribute.attributeName, rootControl);

        for (const it of r.associatedAttributes) {
          let associatedCtrl = this.formBuilder.control('', Validators.required);
          this.attributesStepFormGroup.addControl(it.attributeName, associatedCtrl);
        }

        this.attributesScheme = r;
        this.attributesFetching = false;
      });
    } else if (evt.selectedIndex == 2) {
      const attributeValues = <AttributeValue[]>[];
      attributeValues.push({ name: this.attributesScheme.rootAttribute.attributeName, alias: this.attributesScheme.rootAttribute.alias, value: this.attributesStepFormGroup.get(this.attributesScheme.rootAttribute.attributeName).value });
      for (const attr of this.attributesScheme.associatedAttributes) {
        attributeValues.push({ name: attr.attributeName, alias: attr.alias, value: this.attributesStepFormGroup.get(attr.attributeName).value });
      }
      this.output = new RequestIdentityOutput();
      this.output.issuer = this.selectedIdP.publicSpendKey;
      this.output.attributeValues = attributeValues;
    }
  }
}
