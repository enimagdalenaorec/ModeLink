import { Component } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [DividerModule, ButtonModule, CommonModule, InputTextModule, FormsModule, ToastModule],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  //login info
  email: string = '';
  password: string = '';
  //error message
  formInvalidMessageVisible: boolean = false;

  constructor(private router: Router, private messageService: MessageService) { }

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
      // if (this.loginSucceded) {
        this.showToast('success', 'Success', 'Login successful!');
        setTimeout(() => {
          this.resetForm();
          this.router.navigate(['/home']);
        }, 1000);
      // } else {
      //   this.showToast('error', 'Error', 'Login failed!');
      // }
    }
  }

  resetForm() {
    this.email = '';
    this.password = '';
    this.formInvalidMessageVisible = false;
  }
}
