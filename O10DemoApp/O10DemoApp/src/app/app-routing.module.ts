import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DemoDashboardComponent } from './components/demo-dashboard/demo-dashboard.component';
import { PollComponent } from './components/poll/poll.component';
import { UserVoteComponent } from './components/user-vote/user-vote.component';
import { UserWalletComponent } from './components/user-wallet/user-wallet.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DemoDashboardComponent },
  { path: 'user-wallet', component: UserWalletComponent },
  { path: 'poll', component: PollComponent },
  { path: 'user-vote', component: UserVoteComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
