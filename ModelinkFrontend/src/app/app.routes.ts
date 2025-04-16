import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { ChooseRoleComponent } from './registration/choose-role/choose-role.component';
import { RegistrationComponent } from './registration/registration/registration.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { EventDetailsComponent } from './event-details/event-details.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'registration-choose-role',
    component: ChooseRoleComponent
  },
  {
    path: 'registration/:role',
    component: RegistrationComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'event-details/:id',
    component: EventDetailsComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];
