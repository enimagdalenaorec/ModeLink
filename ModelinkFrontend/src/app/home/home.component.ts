import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModelSearchResultDto, SuggestedModelDto, EyeColors, SkinColors, HairColors } from '../_Models/model';
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
import { CheckboxModule } from 'primeng/checkbox';
import { SliderModule } from 'primeng/slider';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgIf, NgFor, HttpClientModule, DividerModule, CommonModule, CheckboxModule, SliderModule, MultiSelectModule, FormsModule, ButtonModule],
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
  searchModelsNotFiltered: ModelSearchResultDto[] = [];
  searchedModelsCount = 8;
  agencies: AgencySearchResultDto[] = [];
  searchAgenciesNotFiltered: AgencySearchResultDto[] = [];
  searchedAgenciesCount = 8;
  modelsNotFound = false;
  agenciesNotFound = false;
  searchQuery = '';
  cityQuery = '';
  countryQuery = '';
  // for search filters
  searchTypes = [
    { label: 'Models', value: 'models' },
    { label: 'Agencies', value: 'agencies' }
  ];
  genders = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' }
  ];
  // multiSelect options
  eyeColorOptions = EyeColors.map(color => ({ label: color, value: color }));
  hairColorOptions = HairColors.map(color => ({ label: color, value: color }));
  skinColorOptions = SkinColors.map(color => ({ label: color, value: color }));

  // filters binding
  filters = {
    types: ['models', 'agencies'] as string[],
    genders: ['male', 'female'] as string[],
    heightRange: [120, 220] as [number, number], // default range
    weightRange: [30, 130] as [number, number],   // default range
    eyeColors: [] as string[],
    hairColors: [] as string[],
    skinColors: [] as string[]
  };
  agenciesNotIncludedInSearch = false; // if agencies are not included in search, only models are shown
  modelsNotIncludedInSearch = false; // if models are not included in search, only agencies are shown
  // for suggested models & agencies (for a guest)
  suggestedModels: SuggestedModelDto[] = [];
  suggestedModelsCount = 8;
  suggestedAgencies: SuggestedAgencyDto[] = [];
  suggestedAgenciesCount = 8;
  // all models by one agency and models from other agencies, signed and freelancers (for agency profile)
  modelsByAgency: SuggestedModelDto[] = [];
  modelsByAgencyCount = 8;
  outsideSignedModels: SuggestedModelDto[] = [];
  outsideSignedModelsCount = 8;
  outsideFreelancerModels: SuggestedModelDto[] = [];
  outsideFreelancerModelsCount = 8;
  eventsByMotherAgency: EventCardDto[] = []; // events by mother agency (for signed logged in model)
  eventsByMotherAgencyCount = 8; // count for events by mother agency

  private subscriptions: Subscription[] = []; // destroy on OnDestroy

  constructor(private searchService: SearchService, private authService: AuthService, private router: Router, private http: HttpClient) { }

  ngOnInit() {
    // subscribe to the observables from the SearchService
    this.subscriptions.push(
      this.searchService.models$.subscribe(models => {
        this.models = models;
        this.searchModelsNotFiltered = models;
      })
    );
    this.subscriptions.push(
      this.searchService.agencies$.subscribe(agencies => {
        this.agencies = agencies;
        this.searchAgenciesNotFiltered = agencies;
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
    this.subscriptions.push(
      this.searchService.cityQuery$.subscribe(city => {
        this.cityQuery = city;
      })
    );
    this.subscriptions.push(
      this.searchService.countryQuery$.subscribe(country => {
        this.countryQuery = country;
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
  select(id: number, role: string) {
    this.searchService.setSearchQuery(''); // clear search query
    this.searchService.setCityQuery(''); // clear city query
    this.searchService.setCountryQuery(''); // clear country query
    this.router.navigate([`/${role}-profile`, id]);
  }

  // for event details page
  selectEvent(id: number) {
    this.searchService.setSearchQuery(''); // clear search query
    this.searchService.setCityQuery(''); // clear city query
    this.searchService.setCountryQuery(''); // clear country query
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

  applyFilters() {
    // filter models array, i saved a copy in searchModelsNotFiltered
    if (this.filters.types.includes('models')) {
      this.models = this.searchModelsNotFiltered.filter(model => {
        const matchesGender = model.gender !== null && this.filters.genders.includes(model.gender.toLowerCase());
        const matchesHeight = model.height !== null && model.height >= this.filters.heightRange[0] && model.height <= this.filters.heightRange[1];
        const matchesWeight = model.weight !== null && model.weight >= this.filters.weightRange[0] && model.weight <= this.filters.weightRange[1];
        const matchesEyeColor = this.filters.eyeColors.length === 0 || (model.eyeColor !== null && this.filters.eyeColors.includes(model.eyeColor));
        const matchesHairColor = this.filters.hairColors.length === 0 || (model.hairColor !== null && this.filters.hairColors.includes(model.hairColor));
        const matchesSkinColor = this.filters.skinColors.length === 0 || (model.skinColor !== null && this.filters.skinColors.includes(model.skinColor));

        return matchesGender && matchesHeight && matchesWeight && matchesEyeColor && matchesHairColor && matchesSkinColor;
      });
      this.modelsNotIncludedInSearch = false; // if models are included in search, we show them
      this.modelsNotFound = this.models.length === 0;
    } else {
      this.models = [];
      this.modelsNotIncludedInSearch = true; // if models are not included in search, only agencies are shown
      this.modelsNotFound = false; // reset to false, because we don't show models
    }
    // filter agencies array, i saved a copy in searchAgenciesNotFiltered (can only be shown or not shown)
    if (this.filters.types.includes('agencies')) {
      this.agencies = this.searchAgenciesNotFiltered;
      this.agenciesNotFound = this.agencies.length === 0;
      this.agenciesNotIncludedInSearch = false; // if agencies are included in search, we show them
    } else {
      this.agencies = [];
      this.agenciesNotIncludedInSearch = true; // if agencies are not included in search, only models are shown
      this.agenciesNotFound = false; // reset to false, because we don't show agencies
    }
  }

  resetFilters() {
    this.filters = {
      types: ['models', 'agencies'],
      genders: ['male', 'female'],
      heightRange: [120, 220],
      weightRange: [30, 130],
      eyeColors: [],
      hairColors: [],
      skinColors: []
    };
    this.models = this.searchModelsNotFiltered;
    this.agencies = this.searchAgenciesNotFiltered;
    this.modelsNotFound = false;
    this.agenciesNotFound = false;
    this.agenciesNotIncludedInSearch = false; // reset to default
    this.modelsNotIncludedInSearch = false; // reset to default
  }

  loadMoreSearchedModels() {
    this.searchedModelsCount += 8;
  }

  loadMoreSearchedAgencies() {
    this.searchedAgenciesCount += 8; // reusing the same count for agencies, as they are shown in the same section
  }

  loadMoreSuggestedModels() {
    this.suggestedModelsCount += 8;
  }

  loadMoreSuggestedAgencies() {
    this.suggestedAgenciesCount += 8;
  }

  loadMoreModelsByAgency() {
    this.modelsByAgencyCount += 8;
  }

  loadMoreOutsideSignedModels() {
    this.outsideSignedModelsCount += 8;
  }

  loadMoreOutsideFreelancerModels() {
    this.outsideFreelancerModelsCount += 8;
  }

  loadMoreEventsByMotherAgency() {
    this.eventsByMotherAgencyCount += 8;
  }

}
