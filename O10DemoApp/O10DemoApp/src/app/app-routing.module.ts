import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DemoDashboardComponent } from './components/demo-dashboard/demo-dashboard.component';
import { UserWalletComponent } from './components/user-wallet/user-wallet.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DemoDashboardComponent },
  { path: 'user-wallet', component: UserWalletComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
