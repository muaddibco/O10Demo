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

  constructor(private route: ActivatedRoute) { 
    this.accountId = parseInt(this.route.snapshot.queryParamMap.get("accountId"));
    this.sessionKey = this.route.snapshot.queryParamMap.get("sessionKey");
  }

  ngOnInit(): void {
    this.initializeHub();
  }

  private initializeHub() {
    this.hubConnection = new HubConnectionBuilder().withUrl(demoConfig.baseUri + "/identitiesHub").build();
		this.hubConnection.on("PushUserRegistration", (i) => {
			console.log("PushUserRegistration");
		});

		this.hubConnection.on("PushSpAuthorizationSucceeded", (i) => {
			console.log("PushSpAuthorizationSucceeded");
		});

    this.hubConnection.on("EligibilityCheckFailed", (i) => {
			console.log("EligibilityCheckFailed");
		});

		this.hubConnection.on("PushSpAuthorizationFailed", (i) => {
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
