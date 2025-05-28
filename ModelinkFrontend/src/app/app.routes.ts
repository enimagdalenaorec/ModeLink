import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { ChooseRoleComponent } from './registration/choose-role/choose-role.component';
import { RegistrationComponent } from './registration/registration/registration.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { EventDetailsComponent } from './event-details/event-details.component';
import { ModelProfileComponent } from './profile/model-profile/model-profile.component';
import { AgencyProfileComponent } from './profile/agency-profile/agency-profile.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { adminGuard, nonAdminGuard } from './_Services/admin.guard';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [nonAdminGuard]
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [nonAdminGuard]
  },
  {
    path: 'registration-choose-role',
    component: ChooseRoleComponent,
    canActivate: [nonAdminGuard]
  },
  {
    path: 'registration/:role',
    component: RegistrationComponent,
    canActivate: [nonAdminGuard]
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [nonAdminGuard]
  },
  {
    path: 'event-details/:id',
    component: EventDetailsComponent,
    canActivate: [nonAdminGuard]
  },
  {
    path: 'model-profile/:id',
    component: ModelProfileComponent,
    canActivate: [nonAdminGuard]
  },
  {
    path: 'agency-profile/:id',
    component: AgencyProfileComponent,
    canActivate: [nonAdminGuard]
  },
  {
    path: 'admin',
    component: AdminHomeComponent,
    canActivate: [adminGuard]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
