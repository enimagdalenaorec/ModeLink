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
import { DividerModule } from 'primeng/divider';
import { EventCardDto } from '../_Models/event';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgIf, NgFor, HttpClientModule, DividerModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {
  apiUrl = environment.apiUrl;
  role: string | null = null; // user role
  modelInfo = {
    status: '', // model status (signed, freelancer, agency)
    agencyId: null, // agency id (if model is signed)
  } // only if logged in user is model
  userId: number | null = null; // user id
  // for search results
  models: ModelSearchResultDto[] = [];
  agencies: AgencySearchResultDto[] = [];
  modelsNotFound = false;
  agenciesNotFound = false;
  searchQuery = '';
  // for suggested models & agencies (for a guest)
  suggestedModels: SuggestedModelDto[] = [];
  suggestedAgencies: SuggestedAgencyDto[] = [];
  // all models by one agency and models from other agencies, signed and freelancers (for agency profile)
  modelsByAgency: SuggestedModelDto[] = [];
  outsideSignedModels: SuggestedModelDto[] = [];
  outsideFreelancerModels: SuggestedModelDto[] = [];
  eventsByMotherAgency: EventCardDto[] = []; // events by mother agency (for signed logged in model)

  private subscriptions: Subscription[] = []; // destroy on OnDestroy

  constructor(private searchService: SearchService, private authService: AuthService, private router: Router, private http: HttpClient) { }

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
    // get user role
    this.role = this.authService.getUserRole();
    // get user id
    this.userId = this.authService.getUserId();
    // fetch suggested models & agencies
    this.getSuggestedModels();
    this.getSuggestedAgencies();
    // fetch models by agency and outside the agency, both signed and freelancers (if user is agency)
    if (this.role === 'agency') {
      this.getModelsByAgency();
      this.getModelsOutsideAgency();
    }
    if (this.role === 'model') {
      this.getModelStatusAnAgencyId();
    }
  }

  ngOnDestroy() {
    // unsubscribe from all subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  // for agency and models profiles
  select(id: number) {
    this.searchService.setSearchQuery(''); // clear search query
    // navigate to model's profile
    this.router.navigate(['/profile', id]);
  }

  // for event details page
  selectEvent(id: number) {
    this.searchService.setSearchQuery(''); // clear search query
    this.router.navigate(['/event-details', id]);
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

  getModelsByAgency() {
    this.http.get<SuggestedModelDto[]>(`${this.apiUrl}Agency/models/${this.userId}`)
      .subscribe((data: SuggestedModelDto[]) => {
        this.modelsByAgency = data;
      }, (error: any) => {
        console.error('Error fetching models by agency:', error);
      }
      );
  }

  getModelsOutsideAgency() {
    this.http.get<SuggestedModelDto[]>(`${this.apiUrl}Agency/outsideSignedModels/${this.userId}`)
      .subscribe((data: SuggestedModelDto[]) => {
        this.outsideSignedModels = data;
      }, (error: any) => {
        console.error('Error fetching models outside agency:', error);
      }
      );

    this.http.get<SuggestedModelDto[]>(`${this.apiUrl}Agency/outsideFreelanceModels/${this.userId}`)
      .subscribe((data: SuggestedModelDto[]) => {
        this.outsideFreelancerModels = data;
      }, (error: any) => {
        console.error('Error fetching outside freelancer models:', error);
      }
      );
  }

  getModelStatusAnAgencyId() {
    this.http.get<{ status: string, agencyId: number }>(`${this.apiUrl}Model/getStatusAndAgencyId/${this.userId}`).subscribe(
      (data: any) => {
        this.modelInfo.status = data.status;
        this.modelInfo.agencyId = data.agencyId;
        if (this.modelInfo.status == 'signed') {
          this.getEventsByMotherAgency(this.modelInfo.agencyId);
        }
        if (this.modelInfo.status == 'freelancer') {
          this.getSuggestedAgencies();
        }
      }, (error: any) => {
        console.error('Error fetching model status:', error);
      }
    );
  }

  getEventsByMotherAgency(agencyId: number | null) {
      this.http.get<EventCardDto[]>(`${this.apiUrl}Agency/activeEvents/${agencyId}`)
        .subscribe((data: EventCardDto[]) => {
          this.eventsByMotherAgency = data;
          this.eventsByMotherAgency = this.eventsByMotherAgency.map(event => ({
            ...event,
            startDate: this.parseCustomDateString(event.startDate).toISOString() // Convert Date back to string
          }));
        }, (error: any) => {
            console.error('Error fetching events by mother agency:', error);
          }
        );
  }

  parseCustomDateString(dateStr: string): Date {
    const [day, month, year] = dateStr.split('-');
    return new Date(Number(year), Number(month) - 1, Number(day)); // months are 0-indexed
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}
