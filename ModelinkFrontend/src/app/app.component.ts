import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { NgIf } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { AuthService } from './_Services/auth.service';
import { MenuItem } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { SearchService } from './_Services/search.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MenubarModule, NgIf, ButtonModule, InputTextModule, FormsModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  backednUrl = environment.apiUrl;
  title = 'Modelink';
  items: MenuItem[] | undefined;
  searchQuery: string = '';
  modelsNotFound: boolean = false;
  agenciesNotFound: boolean = false;

  constructor(private router: Router, private authService: AuthService, private searchService: SearchService, private http: HttpClient) { }

  ngOnInit(): void {
    this.items = [
      {
        label: 'Home',
        icon: 'pi pi-home',
        command: () => this.navigateTo('/home')
      },
      {
        label: 'Profile',
        icon: 'pi pi-user',
        command: () => this.navigateToProfile('/profile')
      }
    ];

    // if user clicks on one of search results, the query should go "", so subscribe to changes
    this.searchService.searchQuery$.subscribe(query => {
      this.searchQuery = query;
    })
  }

  shouldShowMenu(): boolean {
    const hiddenRoutes = ['/registration-choose-role', '/login', '/registration/model', '/registration/agency'];
    return !hiddenRoutes.some(route => this.router.url.startsWith(route));
  }

  isLoggedIn(): boolean {
    const ret = this.authService.isLoggedIn()
    return ret;
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  navigateToProfile(route: string): void {
    if (this.authService.isLoggedIn()) {
      const role = this.authService.getUserRole();
      const userId = this.authService.getUserId();
      if (role === 'model') {
        this.router.navigate(['/model-profile', userId]);
      } else if (role === 'agency') {
        this.router.navigate(['/agency-profile', userId]);
      }
    } else {
      this.router.navigate(['/login']);
    }
  }


  logout(): void {
    this.authService.clearToken();
    this.router.navigate(['/login']);
  }

  search(): void {
    if (this.searchQuery.trim() !== '') {
      this.searchService.setSearchQuery(this.searchQuery.trim());

      // call be api to get models
      this.http.get<any[]>(`${this.backednUrl}Model/search?query=${this.searchQuery}`).subscribe(
        (response) => {
          // save to service
          if (response.length === 0) {
            this.modelsNotFound = true;
            this.searchService.setModelsNotFound(true);
            this.searchService.setModels([]);
          } else {
            this.modelsNotFound = false;
            this.searchService.setModelsNotFound(false);
            this.searchService.setModels(response);
          }
        },
        (error) => {
          // todo
          console.error('Error fetching search results:', error);
          this.searchService.setModels([]);
          this.searchService.setAgencies([]);
          this.modelsNotFound = true;
          this.searchService.setModelsNotFound(true);
        }
      );

      //call api to get agencies
      this.http.get<any[]>(`${this.backednUrl}Agency/search?query=${this.searchQuery}`).subscribe(
        (response) => {
          // save to service
          if (response.length === 0) {
            this.agenciesNotFound = true;
            this.searchService.setAgenciesNotFound(true);
            this.searchService.setAgencies([]);
          } else {
            this.agenciesNotFound = false;
            this.searchService.setAgenciesNotFound(false);
            this.searchService.setAgencies(response);
          }
        },
        (error) => {
          // todo
          console.error('Error fetching search results:', error);
          this.searchService.setModels([]);
          this.searchService.setAgencies([]);
          this.agenciesNotFound = true;
          this.searchService.setAgenciesNotFound(true);
        }
      );
    }
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.agenciesNotFound = false;
    this.modelsNotFound = false;
    this.searchService.setModels([]);
    this.searchService.setAgencies([]);
    this.searchService.setSearchQuery('');
  }

  isHomeRoute(): boolean {
    return this.router.url === '/home' || this.router.url === '/home/' || this.router.url === '' || this.router.url === '/';
  }
}
