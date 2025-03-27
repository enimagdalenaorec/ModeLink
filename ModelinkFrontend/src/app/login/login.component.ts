import { Component } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { environment } from '../../environments/environment';
import {  HttpClient, HttpClientModule  }  from  '@angular/common/http';
import { LoginDto } from '../_Models/loginDto';
import { AuthService } from '../_Services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [DividerModule, ButtonModule, CommonModule, InputTextModule, FormsModule, ToastModule, HttpClientModule],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  backendUrl = environment.apiUrl;
  //login info
  email: string = '';
  password: string = '';
  //error message
  formInvalidMessageVisible: boolean = false;

  constructor(private authService: AuthService, private router: Router, private messageService: MessageService, private http: HttpClient) { }

  showToast(severity: string, summary: string, detail: string) {
    this.messageService.add({ severity: severity, summary: summary, detail: detail });
  }

  navigateToRegistration() {
    this.router.navigate(['/registration-choose-role']);
  }

  isFormValid() {
    return this.email !== '' && this.password !== '';
  }

  login() {
    if (!this.isFormValid()) {
      this.formInvalidMessageVisible = true;
      return;
    } else {
      //call be api
      const loginDto: LoginDto = {
        email: this.email,
        password: this.password
      };
      this.http.post(this.backendUrl + 'Auth/login', loginDto).subscribe((response: any) => {
        this.showToast('success', 'Success', 'Login successful!');
        this.authService.saveToken(response.token); // store token in localstorage
        setTimeout(() => {
          this.resetForm();
          this.router.navigate(['/home']);
        }, 1000);
      }, (error) => {
        this.showToast('error', 'Error', 'Login failed!');
      });
    }
  }

  resetForm() {
    this.email = '';
    this.password = '';
    this.formInvalidMessageVisible = false;
  }
}
