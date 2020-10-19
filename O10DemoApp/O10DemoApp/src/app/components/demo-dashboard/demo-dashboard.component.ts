import { Component, OnInit } from '@angular/core';
import { DemoConfig, demoConfig, DemoIdpAccount } from 'src/app/services/demo-state.service';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-demo-dashboard',
  templateUrl: './demo-dashboard.component.html',
  styleUrls: ['./demo-dashboard.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class DemoDashboardComponent implements OnInit {
  public demoConfig: DemoConfig;
  public displayedColumnsIdP: string[] = ['accountName', 'rskAddress', 'activated']
  public displayedColumnsScheme: string[] = ['isRoot', 'schemeName', 'attributeName', 'alias']
  expandedElementIdP: DemoIdpAccount | null;

  constructor() { 
    this.demoConfig = demoConfig;
  }

  ngOnInit(): void {
  }

}
