import { Component } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-choose-role',
  standalone: true,
  imports: [DividerModule, ButtonModule],
  templateUrl: './choose-role.component.html',
  styleUrl: './choose-role.component.css'
})
export class ChooseRoleComponent {
  constructor(private router: Router) {}

  navigateToRegistration(role: string) {
    this.router.navigate(['/registration', role]);
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
