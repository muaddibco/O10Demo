import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { demoConfig } from 'src/app/services/demo-state.service';

@Component({
  selector: 'app-sp-frontend',
  templateUrl: './sp-frontend.component.html',
  styleUrls: ['./sp-frontend.component.scss']
})
export class SpFrontendComponent implements OnInit {

  private accountId: number;
  private sessionKey: string;
  private hubConnection: HubConnection;
  public phase: number = 0;
  public errorType: number = 0;

  constructor(private route: ActivatedRoute) { 
    this.accountId = parseInt(this.route.snapshot.queryParamMap.get("accountId"));
    this.sessionKey = this.route.snapshot.queryParamMap.get("sessionKey");
  }

  ngOnInit(): void {
    const phase = sessionStorage.getItem("phase");
    if(phase) {
      this.phase = parseInt(phase);
    }

    const errorType = sessionStorage.getItem("errorType");
    if(errorType) {
      this.errorType = parseInt(errorType);
    }

    this.initializeHub();
  }

  private initializeHub() {
    this.hubConnection = new HubConnectionBuilder().withUrl(demoConfig.baseUri + "/identitiesHub").build();
		this.hubConnection.on("PushUserRegistration", (i) => {
      console.log("PushUserRegistration");
      this.phase = 1;
      sessionStorage.setItem("phase", this.phase.toString());
		});

		this.hubConnection.on("PushSpAuthorizationSucceeded", (i) => {
			console.log("PushSpAuthorizationSucceeded");
      this.phase = 1;
      sessionStorage.setItem("phase", this.phase.toString());
		});

    this.hubConnection.on("EligibilityCheckFailed", (i) => {
      this.phase = 2;
      this.errorType = 1;
      sessionStorage.setItem("phase", this.phase.toString());
      sessionStorage.setItem("errorType", this.errorType.toString());
			console.log("EligibilityCheckFailed");
		});

		this.hubConnection.on("ProtectionCheckFailed", (i) => {
      this.phase = 2;
      this.errorType = 2;
      sessionStorage.setItem("phase", this.phase.toString());
      sessionStorage.setItem("errorType", this.errorType.toString());
			console.log("ProtectionCheckFailed");
    });
    
		this.hubConnection.on("PushSpAuthorizationFailed", (i) => {
      this.phase = 2;
      this.errorType = 3;
      sessionStorage.setItem("phase", this.phase.toString());
      sessionStorage.setItem("errorType", this.errorType.toString());
			console.log("PushSpAuthorizationFailed");
		});

    this.hubConnection.onclose(e => {
      console.log("hubConnection.onclose: [" + e.name + "] " + e.message);
      this.startHubConnection();
    });

    this.startHubConnection();
  }

  private startHubConnection() {
    console.log("starting hub connection...");
    this.hubConnection.start()
      .then(() => {
        console.log("Hub started");
        this.hubConnection.invoke("AddToGroup", this.sessionKey);
      })
      .catch(err => {
        console.log("starting hub connection failed");
        console.error(err);
        setTimeout(() => this.startHubConnection(), 1000);
      });
  }
}
