import { Component } from '@angular/core';
import { AuthService } from '../_Services/auth.service';
import { Router } from '@angular/router';
import { StepperModule } from 'primeng/stepper';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ModelsForAdminCrudDTO, EyeColors, HairColors, SkinColors } from '../_Models/model';
import { AgenciesForAdminCrudDTO, SuggestedAgencyDto } from '../_Models/agency';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { DropdownModule } from 'primeng/dropdown';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [StepperModule, TableModule, ButtonModule, InputTextModule, FormsModule, CommonModule, HttpClientModule, DropdownModule],
  providers: [AuthService, MessageService],
  templateUrl: './admin-home.component.html',
  styleUrl: './admin-home.component.css'
})
export class AdminHomeComponent {
  apiUrl = environment.apiUrl; // base URL for API requests
  userRole: string = '';        // this should be admin to acces this page
  userId: string = ''; // get user id from auth service
  models: ModelsForAdminCrudDTO[] = [];
  agencies: AgenciesForAdminCrudDTO[] = [];
  allAgencies: SuggestedAgencyDto[] = [];
  newAgency: any; // for choosing new agency from dropdown
  genders = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' }
  ];
  eyeColors = EyeColors;
  hairColors = HairColors;
  skinColors = SkinColors;
  // for model city autocomplete
  citySuggestions: any[][] = [];
  selectedCities: any[] = [];   // should be an array

  constructor(private messageService: MessageService, private authService: AuthService, private router: Router, private http: HttpClient) { }

  ngOnInit() {
    this.userId = String(this.authService.getUserId() ?? '');
    this.userRole = this.authService.getUserRole() || '';
    // this is already checked in auth guard, but we can check here too
    if (this.userRole !== 'admin') {
      // redirect to home
      this.router.navigate(['/home']);
    }
    // get models and agencies
    this.getModelsAndAgencies()
    // get all agencies for dropdown
    this.getAllAgencies();
  }

  getModelsAndAgencies() {
    this.http.get<ModelsForAdminCrudDTO[]>(`${this.apiUrl}Model/getModelsForAdminCrud/${this.userId}`).subscribe(
      (data) => {
        this.models = data;
      },
      (error) => {
        console.error('Error fetching models:', error);
      }
    );

    this.http.get<AgenciesForAdminCrudDTO[]>(`${this.apiUrl}Agency/getAgenciesForAdminCrud/${this.userId}`).subscribe(
      (data) => {
        this.agencies = data;
      },
      (error) => {
        console.error('Error fetching agencies:', error);
      }
    );
  }

  getAllAgencies() {
    this.http.get<SuggestedAgencyDto[]>(`${this.apiUrl}Agency/suggestions`)
      .subscribe((data: SuggestedAgencyDto[]) => {
        this.allAgencies = data;
      }, (error: any) => {
        console.error('Error fetching all agencies:', error);
      }
      );
  }

  changeAgencyIdAccordingToNameChange(model: any) {
    // find the agency in allAgencies by name
    const agency = this.allAgencies.find(a => a.name === this.newAgency.name);
    if (agency) {
      model.agencyUserId = agency.userId; // set the agencyUserId to the found agency's userId
      model.agencyName = this.newAgency.name; // also set the agency name in the model
    } else {
      model.agencyUserId = null; // if not found, set to null
    }
    this.newAgency = null; // reset the new agency name input
  }

  // for model autocomplete
  selectCitySuggestion(suggestion: any, model: ModelsForAdminCrudDTO, ind: number) {
    this.selectedCities[ind] = suggestion.display_name;
    const address = suggestion.address;

    model.cityName = address.city_district || address.city || address.town || address.village || '';
    model.countryName = address.country || '';
    // translate new model into their place in the models array
    const index = this.models.findIndex(m => m.modelUserId === model.modelUserId);
    if (index !== -1) {
      this.models[index] = { ...this.models[index], ...model };
    }

    this.citySuggestions = [];
  }

  onCitySearch(event: any, rowIndex: number) {
    const query = (event.target as HTMLInputElement).value;

    if (!query || query.length < 3) {
      this.citySuggestions[rowIndex] = [];
      return;
    }

    this.http.get(`https://nominatim.openstreetmap.org/search`, {
      params: {
        q: query,
        format: 'json',
        addressdetails: '1',
        limit: '5'
      }
    }).subscribe((results: any) => {
      // Filter to keep only city-level results
      this.citySuggestions[rowIndex] = results.filter((result: any) => {
        const address = result.address;
        return address.city || address.town || address.village;
      });
    });
  }

  showToast(severity: string, summary: string, detail: string) {
    this.messageService.add({ severity: severity, summary: summary, detail: detail });
  }
}
