import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModelSearchResultDto, SuggestedModelDto } from '../_Models/model';
import { AgencySearchResultDto, SuggestedAgencyDto } from '../_Models/agency';
import { SearchService } from '../_Services/search.service';
import { Subscription } from 'rxjs';
import { NgIf, NgFor } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthService } from '../_Services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgIf, NgFor, HttpClientModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {
  apiUrl = environment.apiUrl;
  models: ModelSearchResultDto[] = [];
  agencies: AgencySearchResultDto[] = [];
  modelsNotFound = false;
  agenciesNotFound = false;
  searchQuery = '';
  suggestedModels: SuggestedModelDto[] = []; // for suggested models
  suggestedAgencies: SuggestedAgencyDto[] = []; // for suggested agencies

  private subscriptions: Subscription[] = []; // destroy on OnDestroy

  constructor(private searchService: SearchService, private authService: AuthService, private router: Router, private http: HttpClient) {}

  ngOnInit() {
    // subscribe to the observables from the SearchService
    this.subscriptions.push(
      this.searchService.models$.subscribe(models => {
        this.models = models;
      })
    );
    this.subscriptions.push(
      this.searchService.agencies$.subscribe(agencies => {
        this.agencies = agencies;
      })
    );
    this.subscriptions.push(
      this.searchService.modelsNotFound$.subscribe(notFound => {
        this.modelsNotFound = notFound;
      })
    );
    this.subscriptions.push(
      this.searchService.agenciesNotFound$.subscribe(notFound => {
        this.agenciesNotFound = notFound;
      })
    );
    this.subscriptions.push(
      this.searchService.searchQuery$.subscribe(query => {
        this.searchQuery = query;
      })
    );

    // fetch suggested models & agencies
    this.getSuggestedModels();
    this.getSuggestedAgencies();
  }

  ngOnDestroy() {
    // unsubscribe from all subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  select(id: number) {
    this.searchService.setSearchQuery(''); // clear search query
    // navigate to model's profile
    this.router.navigate(['/profile', id]);
    console.log('Selected model id: ', id);
    console.log(this.models);
  }

  onImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/images/user.png';
  }

  getSuggestedModels() {
    this.http.get<SuggestedModelDto[]>(`${this.apiUrl}Model/suggestions`)
      .subscribe((data: SuggestedModelDto[]) => {
        this.suggestedModels = data;
      }, (error: any) => {
        console.error('Error fetching suggested models:', error);
      }
    );
  }

  getSuggestedAgencies() {
    this.http.get<SuggestedAgencyDto[]>(`${this.apiUrl}Agency/suggestions`)
      .subscribe((data: SuggestedAgencyDto[]) => {
        this.suggestedAgencies = data;
      }, (error: any) => {
        console.error('Error fetching suggested agencies:', error);
      }
    );
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}
