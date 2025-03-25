import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { ChooseRoleComponent } from './registration/choose-role/choose-role.component';
import { RegistrationComponent } from './registration/registration/registration.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
  {
    path: '',
    component: AppComponent,
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
    path: '**',
    redirectTo: ''
  }
];
