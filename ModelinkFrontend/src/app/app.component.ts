import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { NgIf } from '@angular/common';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MenubarModule, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Modelink';

  constructor(private router: Router) {}

  shouldShowMenu(): boolean {
    const hiddenRoutes = ['/registration-choose-role', '/login', '/registration/model', '/registration/agency'];
    return !hiddenRoutes.some(route => this.router.url.startsWith(route));
  }
}
