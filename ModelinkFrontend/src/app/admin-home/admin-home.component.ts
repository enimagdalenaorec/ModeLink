import { Component } from '@angular/core';
import { AuthService } from '../_Services/auth.service';
import { Router } from '@angular/router';
import { StepperModule } from 'primeng/stepper';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [StepperModule, TableModule, ButtonModule, InputTextModule, FormsModule, CommonModule],
  providers: [AuthService],
  templateUrl: './admin-home.component.html',
  styleUrl: './admin-home.component.css'
})
export class AdminHomeComponent {
  userRole: string = '';        // this should be admin to acces this page
  // products = [{
  //   name: 'test name',
  // },
  // {
  //   name: 'test name 2',
  // }];

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.userRole = this.authService.getUserRole() || '';
    // this is already checked in auth guard, but we can check here too
    if (this.userRole !== 'admin') {
      // redirect to home
      this.router.navigate(['/home']);
    }
  }

}
