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
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [StepperModule, TableModule, ButtonModule, InputTextModule, FormsModule, CommonModule, HttpClientModule, DropdownModule, FileUploadModule, ToastModule],
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
  selectedCities: any[] = [];
  // for agency address autocomplete
  selectedAddresses: any[] = [];
  addressSuggestions: any[][] = [];
  // for agency models and events dropdown
  selectedAgencyModels: any[] = [];
  selectedAgencyEvents: any[] = [];

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
    this.getModels();
    this.getAgencies();
    // get all agencies for dropdown
    this.getAllAgencies();
  }

  getModels() {
    this.http.get<ModelsForAdminCrudDTO[]>(`${this.apiUrl}Model/getModelsForAdminCrud/${this.userId}`).subscribe(
      (data) => {
        this.models = data;
      },
      (error) => {
        console.error('Error fetching models:', error);
      }
    );
  }

  getAgencies() {
    this.http.get<AgenciesForAdminCrudDTO[]>(`${this.apiUrl}Agency/getAgenciesForAdminCrud/${this.userId}`).subscribe(
      (data) => {
        this.agencies = data;
        // initialize selectedModels and events for agency dropdowns to first ones
        this.agencies.forEach((agency, index) => {
          this.selectedAgencyModels[index] = agency.models[0] || null;
          this.selectedAgencyEvents[index] = agency.events[0] || null;
        });
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
      // update models
      const index = this.models.findIndex(m => m.modelUserId === model.modelUserId);
      if (index !== -1) {
        this.models[index].agencyUserId = model.agencyUserId;
        this.models[index].agencyName = model.agencyName;
      }
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
    model.countryCode = address.country_code || '';
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

  // for agency address autocomplete
  onAddressSearch(event: any, rowIndex: number) {
    const query = (event.target as HTMLInputElement).value;
    if (!query || query.length < 3) {
      this.addressSuggestions[rowIndex] = [];
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
      // Filter to keep only address-level results
      this.addressSuggestions[rowIndex] = results.filter((result: any) => {
        const address = result.address;
        return (
          address.road ||
          address.neighbourhood ||
          address.suburb ||
          address.city_district ||
          address.square ||
          address.pedestrian
        );
      });
    });
  }

  selectAddressSuggestion(suggestion: any, agency: AgenciesForAdminCrudDTO, ind: number) {
    this.selectedAddresses[ind] = suggestion.display_name;
    const address = suggestion.address;

    agency.address = `
    ${address.road || address.square || address.pedestrian || address.neighbourhood || address.suburb || address.city_district || ''}
    ${address.house_number || ''}
    `.trim();
    agency.countryName = address.country || '';
    agency.countryCode = address.country_code || '';
    agency.cityName = address.city_district || address.city || address.town || address.village || '';
    // translate new agency into their place in the agencies array
    const index = this.agencies.findIndex(a => a.agencyUserId === agency.agencyUserId);
    if (index !== -1) {
      this.agencies[index] = { ...this.agencies[index], ...agency };
    }

    this.addressSuggestions = [];
  }

  showToast(severity: string, summary: string, detail: string) {
    this.messageService.add({ severity: severity, summary: summary, detail: detail });
  }

  onImageSelect(event: any, fileUpload: any, model: ModelsForAdminCrudDTO, index: number) {
    if (event.files.length === 0) {
      return;
    }
    const file = event.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      model.profilePicture = e.target.result;
    };
    reader.readAsDataURL(file);
    // Update the model's profile picture URL
    const indexInModels = this.models.findIndex(m => m.modelUserId === model.modelUserId);
    if (indexInModels !== -1) {
      this.models[indexInModels].profilePicture = model.profilePicture;
    }
    fileUpload.clear();
  }

  onAgencyImageSelect(event: any, fileUpload: any, agency: AgenciesForAdminCrudDTO) {
    if (event.files.length === 0) {
      return;
    }
    const file = event.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      agency.profilePicture = e.target.result;
    };
    reader.readAsDataURL(file);
    // Update the agency's profile picture URL
    const indexInAgencies = this.agencies.findIndex(a => a.agencyUserId === agency.agencyUserId);
    if (indexInAgencies !== -1) {
      this.agencies[indexInAgencies].profilePicture = agency.profilePicture;
    }
    fileUpload.clear();
  }

  saveModelChanges(model: ModelsForAdminCrudDTO, index: number) {
    // validate model data
    if (model.firstName == '' || model.lastName == '' || model.email == '' || model.profilePicture == '' || model.cityName == '' || model.countryName == '' || model.height == null || model.weight == null || model.eyeColor == '' || model.hairColor == '' || model.skinColor == '' || model.gender == '') {
      this.showToast('error', 'Validation Error', 'Please fill in all required fields.');
      return;
    }

    this.http.put(`${this.apiUrl}Model/adminUpdateModel/${model.modelUserId}`, model).subscribe(
      (response) => {
        this.showToast('success', 'Success', `Model ${model.firstName} ${model.lastName} updated successfully.`);
        // update the local models array
        this.models[index] = { ...this.models[index], ...model };
        //this.getModelsAndAgencies(); // refresh the models list
        // reset agency info (not whole model in case admin didnt save some changes to other models)
        this.getAgencies(); // refresh the agencies list
      },
      (error) => {
        console.error('Error updating model:', error);
        this.showToast('error', 'Update Error', 'Failed to update model.');
      }
    );
  }

  saveAgencyChanges(agency: AgenciesForAdminCrudDTO, index: number) {
    // validate agency data
    if (agency.name == '' || agency.email == '' || agency.description == '' || agency.profilePicture == '' || agency.address == '' || agency.cityName == '' || agency.countryName == '') {
      this.showToast('error', 'Validation Error', 'Please fill in all required fields.');
      return;
    }
    this.http.put(`${this.apiUrl}Agency/adminUpdateAgency/${agency.agencyUserId}`, agency).subscribe(
      (response) => {
        this.showToast('success', 'Success', `Agency ${agency.name} updated successfully.`);
        // update the local agencies array
        this.agencies[index] = { ...this.agencies[index], ...agency };
        //this.getModelsAndAgencies(); // refresh the agencies list
        // reset model info (not whole agency in case admin didnt save some changes to other agencies)
        this.getModels(); // refresh the models list
      },
      (error) => {
        console.error('Error updating agency:', error);
        this.showToast('error', 'Update Error', 'Failed to update agency.');
      }
    );
  }

  removeAgencyFromModel(model: ModelsForAdminCrudDTO, index: number) {
    model.agencyUserId = null; // remove agency by setting userId to null
    model.agencyName = ''; // clear agency name
    this.newAgency = null; // reset the new agency input
    // update models
    const modelIndex = this.models.findIndex(m => m.modelUserId === model.modelUserId);
    if (modelIndex !== -1) {
      this.models[modelIndex].agencyUserId = null;
      this.models[modelIndex].agencyName = '';
    }
  }

  removeModelFromAgency(agency: AgenciesForAdminCrudDTO, index: number) {
    // remove the selected model from the agency's models
    const modelIndex = agency.models.findIndex(m => m.modelUserId === this.selectedAgencyModels[index].modelUserId);
    if (modelIndex !== -1) {
      agency.models.splice(modelIndex, 1);
      this.selectedAgencyModels[index] = null; // reset the selected model
      // update the agency in the local array
      this.agencies[index] = { ...this.agencies[index], models: agency.models };
      // to alter placeholder in dropdown
      if (agency.models.length > 0) {
        this.selectedAgencyModels[index] = agency.models[0]; // set to first model if available
      } else {
        this.selectedAgencyModels[index] = null; // no models left
      }
    } else {
      this.showToast('error', 'Error', 'Model to be removed not found in agency.');
    }
  }

  removeEventFromAgency(agency: AgenciesForAdminCrudDTO, index: number) {
    // remove the selected event from the agency's events
    const eventIndex = agency.events.findIndex(e => e.id === this.selectedAgencyEvents[index].id);
    if (eventIndex !== -1) {
      agency.events.splice(eventIndex, 1);
      this.selectedAgencyEvents[index] = null; // reset the selected event
      // update the agency in the local array
      this.agencies[index] = { ...this.agencies[index], events: agency.events };
      // to alter placeholder in dropdown
      if (agency.events.length > 0) {
        this.selectedAgencyEvents[index] = agency.events[0]; // set to first event if available
      } else {
        this.selectedAgencyEvents[index] = null; // no events left
      }
    } else {
      this.showToast('error', 'Error', 'Event to be removed not found in agency.');
    }
  }
}
