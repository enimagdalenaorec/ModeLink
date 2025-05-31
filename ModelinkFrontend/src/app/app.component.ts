import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { NgIf, NgFor } from '@angular/common';
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
  imports: [RouterOutlet, MenubarModule, NgIf, ButtonModule, InputTextModule, FormsModule, HttpClientModule, NgFor],
  providers: [AuthService, SearchService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  backednUrl = environment.apiUrl;
  userRole: string = '';
  title = 'Modelink';
  items: MenuItem[] | undefined;
  searchQuery: string = '';   // for search by name
  modelsNotFound: boolean = false;
  agenciesNotFound: boolean = false;
  // for location search (search is by city or country)
  locationSuggestions: any[] = [];
  selectedLocation: string = '';
  cityForSearch: string = ''; // for search by location
  countryForSearch: string = '';  // for search by location
  countryCodeForSearch: string = '';

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

    this.userRole = this.authService.getUserRole() || '';

    // if user clicks on one of search results, the query should go "", so subscribe to changes
    this.searchService.searchQuery$.subscribe(query => {
      this.searchQuery = query;
    });
    this.searchService.cityQuery$.subscribe(city => {
      this.cityForSearch = city;
    });
    this.searchService.countryQuery$.subscribe(country => {
      this.countryForSearch = country;
    });

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
    if (this.searchQuery.trim() !== '' || this.selectedLocation.trim() !== '') {
      this.searchService.setSearchQuery(this.searchQuery.trim());
      this.searchService.setCityQuery(this.cityForSearch.trim());
      this.searchService.setCountryQuery(this.countryForSearch.trim());
      // if location has been erased, then set city and country to empty strings
      if (this.selectedLocation.trim() === '') {
        this.searchService.setCityQuery('');
        this.searchService.setCountryQuery('');
      }

      // call be api to get models
      this.http.get<any[]>(`${this.backednUrl}Model/search?name=${this.searchQuery}&city=${this.cityForSearch}&country=${this.countryForSearch}`).subscribe(
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
      this.http.get<any[]>(`${this.backednUrl}Agency/search?name=${this.searchQuery}&city=${this.cityForSearch}&country=${this.countryForSearch}`).subscribe(
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
    this.cityForSearch = '';
    this.countryForSearch = '';
    this.countryCodeForSearch = '';
    this.locationSuggestions = [];
    this.selectedLocation = '';
    this.searchService.setCityQuery('');
    this.searchService.setCountryQuery('');
    this.agenciesNotFound = false;
    this.modelsNotFound = false;
    this.searchService.setModels([]);
    this.searchService.setAgencies([]);
    this.searchService.setSearchQuery('');
  }

  isHomeRoute(): boolean {
    return this.router.url === '/home' || this.router.url === '/home/' || this.router.url === '' || this.router.url === '/';
  }

  onAddressSearch(event: any) {
    const query = (event.target as HTMLInputElement).value;
    if (!query || query.length < 4) {         // minimum 4 characters
      this.locationSuggestions = [];
      return;
    }

    this.http
      .get(`https://nominatim.openstreetmap.org/search`, {
        params: {
          q: query,
          format: 'json',
          addressdetails: '1',
          limit: '6'
        }
      })
      .subscribe((results: any) => {
        // make sure the suggestions only contain city or country
        this.locationSuggestions = results.filter((result: any) => {
          const address = result.address;
          return address.city || address.town || address.village;
        });
      });
  }

  selectSuggestion(suggestion: any) {
    this.selectedLocation = suggestion.display_name;
    this.cityForSearch = suggestion.address?.city || suggestion.address?.town || suggestion.address?.village || '';
    this.countryForSearch = suggestion.address?.country || '';
    this.countryCodeForSearch = suggestion.address?.country_code || '';
    this.locationSuggestions = [];
  }
}
