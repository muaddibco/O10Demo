import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IssuerDetailsListComponent } from "./components/issuer-details-list/issuer-details-list.component";
import { IssuerRegisterComponent } from "./components/issuer-register/issuer-register.component";

const routes: Routes = [
  { path: 'issuers', component: IssuerDetailsListComponent},
  { path: 'registerIssuer', component: IssuerRegisterComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
