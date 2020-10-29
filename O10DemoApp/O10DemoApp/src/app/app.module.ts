import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MessagesComponent } from './components/messages/messages.component';
import { IdentityProvidersComponent } from './components/identity-providers/identity-providers.component';
import { ServiceProvidersComponent } from './components/service-providers/service-providers.component';
import { UserWalletsComponent } from './components/user-wallets/user-wallets.component';
import { DemoDashboardComponent } from './components/demo-dashboard/demo-dashboard.component';
import { RegisterAccountComponent } from './components/dialogs/register-account/register-account.component';
import { UserWalletComponent } from './components/user-wallet/user-wallet.component';
import { NavMenuComponent } from './components/nav-menu/nav-menu.component';
import { RequestIdentityComponent } from './components/dialogs/request-identity/request-identity.component';
import { AuthenticatePwdComponent } from './components/dialogs/authenticate-pwd/authenticate-pwd.component';
import { ElectionCommitteeComponent } from './components/election-committee/election-committee.component';
import { InputDialogComponent } from './components/dialogs/input-dialog/input-dialog.component';
import { PollComponent } from './components/poll/poll.component';
import { UserVoteComponent } from './components/user-vote/user-vote.component';

@NgModule({
  declarations: [
    AppComponent,
    MessagesComponent,
    IdentityProvidersComponent,
    ServiceProvidersComponent,
    UserWalletsComponent,
    DemoDashboardComponent,
    RegisterAccountComponent,
    UserWalletComponent,
    NavMenuComponent,
    RequestIdentityComponent,
    AuthenticatePwdComponent,
    ElectionCommitteeComponent,
    InputDialogComponent,
    PollComponent,
    UserVoteComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatTableModule, MatIconModule, MatPaginatorModule, MatButtonModule, MatTabsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatExpansionModule, MatCardModule, MatCheckboxModule, MatDialogModule, MatDividerModule, MatToolbarModule, MatStepperModule, MatProgressBarModule, MatGridListModule, MatSlideToggleModule, MatProgressSpinnerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
