import { Component } from '@angular/core';
import { AuthService } from '../_Services/auth.service';
import { Router } from '@angular/router';
import { StepperModule } from 'primeng/stepper';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ModelsForAdminCrudDTO, EyeColors, HairColors, SkinColors, RegisterModelDto } from '../_Models/model';
import { AgenciesForAdminCrudDTO, ModelsForAgenciesForAdminCrudDTO, RegisterAgencyDto, SuggestedAgencyDto } from '../_Models/agency';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TooltipModule } from 'primeng/tooltip';
import { AddNewEventDTO, UpdateEventDto } from '../_Models/event';
import { CalendarModule } from 'primeng/calendar';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [StepperModule, TableModule, ButtonModule, InputTextModule, FormsModule, CommonModule, HttpClientModule, DropdownModule, FileUploadModule, ToastModule, ConfirmDialogModule, DialogModule, RadioButtonModule, InputTextareaModule, TooltipModule, CalendarModule],
  providers: [AuthService, MessageService, ConfirmationService],
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
  // for adding model to agency
  allUnsignedModels: ModelsForAgenciesForAdminCrudDTO[] = []; // models that are not signed to any agency
  newModel: ModelsForAgenciesForAdminCrudDTO[] = []; // model to be added to agency
  // for model city autocomplete
  citySuggestions: any[][] = [];
  selectedCities: any[] = [];
  // for agency address autocomplete
  selectedAddresses: any[] = [];
  addressSuggestions: any[][] = [];
  // for agency models and events dropdown
  selectedAgencyModels: any[] = [];
  selectedAgencyEvents: any[] = [];
  // for dialogs
  createModelDialogVisible: boolean = false;
  createAgencyDialogVisible: boolean = false;
  addEventToAgencyVisible: boolean = false;
  editEventDialogVisible: boolean = false; // for editing event dialog
  // for creating new model
  //model
  modelFirstName: string = '';
  modelLastName: string = '';
  modelEmail: string = '';
  modelPassword: string = '';
  modelGender: string = '';
  modelCity: string = '';
  modelCountryName: string = '';
  modelCountryCode: string = '';
  modelProfilePicture: string = '';
  modelHeight: number = 0;
  modelWeight: number = 0;
  modelHairColor: string = '';
  modelEyeColor: string = '';
  modelSkinColor: string = '';
  selectedCreateModelCity: string = '';
  cityCreateModelSuggestions: any[] = [];
  //agency
  addressCreateAgencySuggestions: any[] = [];
  selectedCreateAgencyAddress: any = null;
  agencyName: string = '';
  agencyEmail: string = '';
  agencyPassword: string = '';
  agencyAddress: string = '';
  agencyCity: string = '';
  agencyCountry: string = '';
  agencyCountryCode: string = '';
  agencyDescription: string = '';
  agencyProfilePicture: string = '';
  //both
  profilePictureName: string = '';
  formInvalidMessageVisible: boolean = false;
  userWithEmailExists: boolean = false;
  // for adding event to agency
  selectedAgencyToWhomWillNewEventBeAdded: AgenciesForAdminCrudDTO | null = null; // agency to which new event will be added
  eventToBeAdded: AddNewEventDTO | null = null; // event to be added
  addEventAddressSuggestions: any[] = []; // suggestions for new event address
  selectedAddEventAddress: string = ''; // selected address for new event
  // for editing event
  eventToBeEdited: UpdateEventDto = {
    id: 0,
    title: '',
    description: '',
    address: '',
    cityName: '',
    countryName: '',
    countryCode: '',
    latitude: 0,
    longitude: 0,
    eventStart: new Date(),
    eventFinish: new Date(),
    profilePicture: '',
    status: 'active'
  }
  selectedAgencyToWhomWillEditedEventBeAdded: AgenciesForAdminCrudDTO | null = null; // agency to which edited event will be added
  editEventAddressSuggestions: any[] = []; // suggestions for new event address
  selectedEditEventAddress: string = ''; // selected address for new event
  minDate: Date = new Date(new Date().setHours(0, 0, 0, 0)); // today's date, set to midnight
  errorMessage: string = ''; // for displaying error messages

  constructor(private messageService: MessageService, private authService: AuthService, private router: Router, private http: HttpClient, private confirmationService: ConfirmationService) { }

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
    // get all unsigned models for dropdown
    this.getAllUnsignedModels();
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

  getAllUnsignedModels() {
    this.http.get<ModelsForAgenciesForAdminCrudDTO[]>(`${this.apiUrl}Model/getUnsignedModels`).subscribe(
      (data) => {
        this.allUnsignedModels = data;
      },
      (error) => {
        console.error('Error fetching unsigned models:', error);
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
        this.getAllUnsignedModels(); // refresh the unsigned models list
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
        this.getAllUnsignedModels(); // refresh the unsigned models list
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

  deleteModel(model: ModelsForAdminCrudDTO) {
    this.confirmationService.confirm({
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      message: `Are you sure you want to delete model ${model.firstName} ${model.lastName}?`,
      accept: () => {
        this.http.delete(`${this.apiUrl}Model/adminDeleteModel/${model.modelUserId}`).subscribe(
          () => {
            this.showToast('success', 'Success', `Model ${model.firstName} ${model.lastName} deleted successfully.`);
            // remove the model from the local array
            this.models = this.models.filter(m => m.modelUserId !== model.modelUserId);
            this.getAgencies(); // refresh the agencies list to remove any references to this model
          },
          (error) => {
            console.error('Error deleting model:', error);
            this.showToast('error', 'Delete Error', 'Failed to delete model.');
          }
        );
      },
      reject: () => {
        // do nothing
      }
    });
  }

  deleteAgency(agency: AgenciesForAdminCrudDTO) {
    this.confirmationService.confirm({
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      message: `Are you sure you want to delete agency ${agency.name}?`,
      accept: () => {
        this.http.delete(`${this.apiUrl}Agency/adminDeleteAgency/${agency.agencyUserId}`).subscribe(
          () => {
            this.showToast('success', 'Success', `Agency ${agency.name} deleted successfully.`);
            // remove the agency from the local array
            this.agencies = this.agencies.filter(a => a.agencyUserId !== agency.agencyUserId);
            this.getModels(); // refresh the models list to remove any references to this agency
          },
          (error) => {
            console.error('Error deleting agency:', error);
            this.showToast('error', 'Delete Error', 'Failed to delete agency.');
          }
        );
      },
      reject: () => {
        // do nothing
      }
    });
  }

  createModel() {
    // validate model data
    if (this.modelFirstName == '' || this.modelLastName == '' || this.modelEmail == '' || this.modelProfilePicture == '' || this.modelCity == '' || this.modelCountryName == '' || this.modelHeight <= 0 || this.modelWeight <= 0 || this.modelEyeColor == '' || this.modelHairColor == '' || this.modelSkinColor == '' || this.modelGender == '' || this.modelPassword == '') {
      this.formInvalidMessageVisible = true;
      return;
    }
    var registrationRequest = {
      email: this.modelEmail.trim(),
      password: this.modelPassword.trim(),
      role: 'model',
      firstName: this.modelFirstName.trim(),
      lastName: this.modelLastName.trim(),
      city: this.modelCity.trim(),
      countryName: this.modelCountryName.trim(),
      countryCode: this.modelCountryCode.trim(),
      height: this.modelHeight,
      weight: this.modelWeight,
      eyeColor: this.modelEyeColor,
      skinColor: this.modelSkinColor,
      hairColor: this.modelHairColor,
      sex: this.modelGender,
      profilePicture: this.modelProfilePicture
    } as RegisterModelDto;
    this.userWithEmailExists = false; // reset the flag before making the request
    this.formInvalidMessageVisible = false; // reset the form invalid message
    //call be api
    this.http.post(this.apiUrl + 'Model/adminCreateModel', registrationRequest).subscribe(
      (response: any) => {
        this.showToast('success', 'Success', 'Registration successful!');
        this.resetCreateModelForm();
        this.createModelDialogVisible = false; // close the dialog after successful registration
        this.getModels(); // refresh the models list
        this.getAgencies(); // refresh the agencies list
      }, (error) => {
        this.showToast('error', 'Error', 'Registration failed!');
        if (error.status === 400 && error.error === 'User with this email already exists.') {
          this.userWithEmailExists = true;
        } else {
          console.error('Registration error:', error);
        }
      });
  }

  resetCreateModelForm() {
    this.modelFirstName = '';
    this.modelLastName = '';
    this.modelEmail = '';
    this.modelPassword = '';
    this.modelGender = '';
    this.modelCity = '';
    this.modelCountryName = '';
    this.modelCountryCode = '';
    this.modelProfilePicture = '';
    this.modelHeight = 0;
    this.modelWeight = 0;
    this.modelHairColor = '';
    this.modelEyeColor = '';
    this.modelSkinColor = '';
    this.selectedCreateModelCity = '';
    this.cityCreateModelSuggestions = [];
  }

  onModelProfilePictureSelect(event: any, fileUpload: any) {
    const file = event.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.modelProfilePicture = e.target.result;
    };
    reader.readAsDataURL(file);
    this.profilePictureName = file.name;
    fileUpload.clear();
  }

  onAgencyProfilePictureSelect(event: any, fileUpload: any) {
    const file = event.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.agencyProfilePicture = e.target.result;
    };
    reader.readAsDataURL(file);
    this.profilePictureName = file.name;
    fileUpload.clear();
  }

  onCreateModelCitySearch(event: any) {
    const query = (event.target as HTMLInputElement).value;

    if (!query || query.length < 3) {
      this.citySuggestions = [];
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
      this.cityCreateModelSuggestions = results.filter((result: any) => {
        const address = result.address;
        return address.city || address.town || address.village;
      });
    });
  }

  // for model autocomplete
  selectCreateModelCitySuggestion(suggestion: any) {
    this.selectedCreateModelCity = suggestion.display_name;
    const address = suggestion.address;

    this.modelCity = address.city_district || address.city || address.town || address.village || '';
    this.modelCountryName = address.country || '';
    this.modelCountryCode = (address.country_code).toUpperCase() || '';

    this.cityCreateModelSuggestions = [];
  }

  onCreateAgencyAddressSearch(event: any) {
    const query = (event.target as HTMLInputElement).value;
    if (!query || query.length < 3) {
      this.addressCreateAgencySuggestions = [];
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
      this.addressCreateAgencySuggestions = results.filter((result: any) => {
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

  selectCreateAgencyAddressSuggestion(suggestion: any) {
    this.selectedCreateAgencyAddress = suggestion.display_name;
    const address = suggestion.address;

    const road =
      suggestion.address.road ||
      suggestion.address.neighbourhood ||
      suggestion.address.suburb ||
      suggestion.address.city_district ||
      '';
    const houseNumber = suggestion.address?.house_number || '';

    this.agencyAddress = `${road} ${houseNumber}`.trim();
    this.agencyCity = address.city_district || address.city || address.town || address.village || '';
    this.agencyCountry = address.country || '';
    this.agencyCountryCode = (address.country_code).toUpperCase() || '';

    this.addressCreateAgencySuggestions = [];
  }

  createAgency() {
    // validate agency data
    if (this.agencyName == '' || this.agencyEmail == '' || this.agencyDescription == '' || this.agencyProfilePicture == '' || this.agencyAddress == '' || this.agencyCity == '' || this.agencyCountry == '' || this.agencyPassword == '') {
      this.formInvalidMessageVisible = true;
      return;
    }
    var registrationRequest = {
      email: this.agencyEmail.trim(),
      password: this.agencyPassword.trim(),
      role: 'agency',
      name: this.agencyName.trim(),
      address: this.agencyAddress.trim(),
      city: this.agencyCity.trim(),
      countryName: this.agencyCountry.trim(),
      countryCode: this.agencyCountryCode.trim(),
      description: this.agencyDescription.trim(),
      profilePicture: this.agencyProfilePicture
    } as RegisterAgencyDto;
    this.userWithEmailExists = false; // reset the flag before making the request
    this.formInvalidMessageVisible = false; // reset the form invalid message
    //call be api
    this.http.post(this.apiUrl + 'Agency/adminCreateAgency', registrationRequest).subscribe(
      (response: any) => {
        this.showToast('success', 'Success', 'Registration successful!');
        this.resetCreateAgencyForm();
        this.createAgencyDialogVisible = false; // close the dialog after successful registration
        this.getAgencies(); // refresh the agencies list
        this.getModels(); // refresh the models list
      }, (error) => {
        if (error.error.includes('User with this email already exists.')) {
          this.userWithEmailExists = true;
        } else {
          console.error('Registration error:', error);
          this.showToast('error', 'Error', 'Registration failed!');
        }
      });
  }

  resetCreateAgencyForm() {
    this.agencyName = '';
    this.agencyEmail = '';
    this.agencyPassword = '';
    this.agencyAddress = '';
    this.agencyCity = '';
    this.agencyCountry = '';
    this.agencyCountryCode = '';
    this.agencyDescription = '';
    this.agencyProfilePicture = '';
    this.selectedCreateAgencyAddress = null;
    this.addressCreateAgencySuggestions = [];
  }

  addModelToAgency(agency: AgenciesForAdminCrudDTO, model: ModelsForAgenciesForAdminCrudDTO) {
    // check if model is already in agency
    if (agency.models.some(m => m.modelUserId === model.modelUserId)) {
      this.showToast('error', 'Error', 'Model is already in this agency.');
      return;
    }
    // add model to agency
    agency.models.push(model);
    // update the agency in the local array
    const index = this.agencies.findIndex(a => a.agencyUserId === agency.agencyUserId);
    if (index !== -1) {
      this.agencies[index] = { ...this.agencies[index], models: agency.models };
    }
    // remove added model for all unsigned models
    const modelIndex = this.allUnsignedModels.findIndex(m => m.modelUserId === model.modelUserId);
    if (modelIndex !== -1) {
      this.allUnsignedModels.splice(modelIndex, 1);
    }
    // relese for placeholder
    this.newModel = [];
  }

  addEventToAgencyStarter(agency: AgenciesForAdminCrudDTO) {
    this.eventToBeAdded = {
      title: '',
      agencyId: agency.agencyId,
      description: '',
      address: '',
      cityName: '',
      countryName: '',
      countryCode: '',
      latitude: 0,
      longitude: 0,
      eventStart: '',
      eventFinish: '',
      profilePicture: '',
      status: 'active'
    } as AddNewEventDTO; // reset the event to be added
    this.addEventToAgencyVisible = true; // show the dialog for adding event to agency
    this.selectedAgencyToWhomWillNewEventBeAdded = agency; // set the selected agency for the dialog
  }

  editEventStarter(agency: AgenciesForAdminCrudDTO, event: any) {
    // prepare the event to be edited
    this.eventToBeEdited = {
      id: event.id,
      title: event.title,
      description: event.description,
      address: event.address,
      cityName: event.cityName || '',
      countryName: event.countryName || '',
      countryCode: event.countryCode || '',
      latitude: event.latitude,
      longitude: event.longitude,
      eventStart: event.eventStart ? new Date(event.eventStart) : null,
      eventFinish: event.eventFinish ? new Date(event.eventFinish) : null,
      profilePicture: event.profilePicture || '',
      status: event.status || 'active'
    } as UpdateEventDto;
    this.editEventDialogVisible = true; // show the dialog for editing event
    this.selectedAgencyToWhomWillEditedEventBeAdded = agency; // set the selected agency for the dialog
    this.selectedEditEventAddress = event.address + ', ' + (event.cityName || '') + ', ' + (event.countryName || '') || ''; // set the selected address for the event
    this.editEventAddressSuggestions = []; // reset the address suggestions
  }

  onEditEventAddressSearch(event: any) {
    const query = (event.target as HTMLInputElement).value;
    if (!query || query.length < 3) {
      this.editEventAddressSuggestions = [];
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
      this.editEventAddressSuggestions = results.filter((result: any) => {
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

  selectEditEventSuggestion(suggestion: any) {
    this.selectedEditEventAddress = suggestion.display_name;
    const address = suggestion.address;

    const road =
      suggestion.address.road ||
      suggestion.address.neighbourhood ||
      suggestion.address.suburb ||
      suggestion.address.city_district ||
      '';
    const houseNumber = suggestion.address?.house_number || '';

    if (this.eventToBeEdited) {
      this.eventToBeEdited.address = `${road} ${houseNumber}`.trim();
      this.eventToBeEdited.cityName = address.city_district || address.city || address.town || address.village || '';
      this.eventToBeEdited.countryName = address.country || '';
      this.eventToBeEdited.countryCode = (address.country_code).toUpperCase() || '';
    }

    this.editEventAddressSuggestions = [];
  }

  async onNewEventImageSelected(event: any, fileUpload?: any) {
    const file = event.files[0];
    if (file) {
      const base64 = await this.convertFileToBase64(file!);
      this.eventToBeEdited!.profilePicture = base64;
    }
    if (fileUpload) {
      fileUpload.clear(); // clear the file input after selection
    }
  }

  convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  cancelEditEventChanges() {
    this.editEventDialogVisible = false;
    this.eventToBeEdited = {
      id: 0,
      title: '',
      description: '',
      address: '',
      cityName: '',
      countryName: '',
      countryCode: '',
      latitude: 0,
      longitude: 0,
      eventStart: new Date(),
      eventFinish: new Date(),
      profilePicture: '',
      status: 'active'
    }; // reset the event to be edited
    this.selectedAgencyToWhomWillEditedEventBeAdded = null; // reset the selected agency for edited event
    this.onNewEventImageSelected({ files: [] }); // reset the file input
  }

  async saveEditEventChanges() {
    // check all required fields are filled and if finish date is later then start date
    if (this.eventToBeEdited?.address === '' || this.eventToBeEdited?.title === '' || this.eventToBeEdited?.eventStart === null || this.eventToBeEdited?.eventFinish === null || this.eventToBeEdited?.eventStart === undefined || this.eventToBeEdited?.eventFinish === undefined) {
      this.errorMessage = 'Please fill all required fields.';
      return;
    } else if ((this.eventToBeEdited.eventFinish ?? new Date()) < (this.eventToBeEdited.eventStart ?? new Date())) {
      this.errorMessage = 'Finish date must be later than start date.';
      return;
    }
    // in case address is not selected from autocomplete, set it to the selected address
    if (this.eventToBeEdited.address === '') {
      this.eventToBeEdited.address = this.selectedEditEventAddress;
    }
    this.errorMessage = '';
    this.http
      .put(`${this.apiUrl}Event/updateEvent/${this.eventToBeEdited.id}`, this.eventToBeEdited)
      .subscribe(
        () => {
          this.showToast('success', 'Success', 'Event details updated successfully!');
          this.getAgencies(); // refresh the agencies list to reflect changes
          this.getModels(); // refresh the models list to reflect changes
          this.errorMessage = ''; // reset error message
          this.editEventDialogVisible = false;
        },
        (error) => {
          this.showToast('error', 'Error', 'Failed to update event details.');
          console.error('Error updating event details:', error);
        }
      );
  }

  // for adding new event to agency
  onAddEventAddressSearch(event: any) {
    const query = (event.target as HTMLInputElement).value;
    if (!query || query.length < 4) {         // minimum 4 characters
      this.addEventAddressSuggestions = [];
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
        // make sure the suggestions always contain address
        this.addEventAddressSuggestions = results.filter((result: any) => {
          const address = result.address;
          return (
            address.road ||
            address.neighbourhood ||
            address.suburb
          );
        });
      });
  }

  selectAddEventAddressSuggestion(suggestion: any) {
    this.selectedAddEventAddress = suggestion.display_name;
    const road =
      suggestion.address.road ||
      suggestion.address.neighbourhood ||
      suggestion.address.suburb ||
      suggestion.address.city_district ||
      '';
    const houseNumber = suggestion.address?.house_number || '';
    if (this.eventToBeAdded) {
      this.eventToBeAdded.address = `${road} ${houseNumber}`.trim();
      this.eventToBeAdded.latitude = parseFloat(suggestion.lat);
      this.eventToBeAdded.longitude = parseFloat(suggestion.lon);
      this.eventToBeAdded.cityName = suggestion.address?.city || suggestion.address?.town || suggestion.address?.village || '';
      this.eventToBeAdded.countryName = suggestion.address?.country || '';
      this.eventToBeAdded.countryCode = suggestion.address?.country_code || '';
    }
    this.addEventAddressSuggestions = [];
  }

  async onAddEventImageSelected(event: any, fileUpload?: any) {
    const file = event.files[0];
    if (file) {
      const base64 = await this.convertFileToBase64(file);
      this.eventToBeAdded!.profilePicture = base64;
    }
    if (fileUpload) {
      fileUpload.clear(); // clear the file input after selection
    }
  }

  cancelAddEventChanges() {
    this.addEventToAgencyVisible = false;
    this.selectedAddEventAddress = ''; // reset the selected address
    this.onAddEventImageSelected({ files: [] }); // reset the file input
    this.eventToBeAdded = {
      agencyId: 0,
      title: '',
      description: '',
      address: '',
      cityName: '',
      countryName: '',
      countryCode: '',
      latitude: 0,
      longitude: 0,
      profilePicture: '',
      eventStart: '',
      eventFinish: ''
    };
  }

  async saveAddEventChanges() {
    // check all required fields are filled and if finish date is later then start date
    if (this.addEventFormNotValid()) {
      if (this.eventToBeAdded!.address === '') {
        this.errorMessage = 'Please select an address from the suggestions.';
        return;
      }
      this.errorMessage = 'Please fill all required fields.';
      return;
    } else if ((this.eventToBeAdded!.eventFinish ?? new Date()) < (this.eventToBeAdded!.eventStart ?? new Date())) {
      this.errorMessage = 'Finish date must be later than start date.';
      return;
    }
    // in case address is not selected from autocomplete, set it to the selected address
    if (this.eventToBeAdded!.address === '') {
      this.eventToBeAdded!.address = this.selectedAddEventAddress;
    }
    this.errorMessage = '';
    // add agencyId to the newEvent object
    this.eventToBeAdded!.agencyId = this.selectedAgencyToWhomWillNewEventBeAdded!.agencyId || 0;
    this.http
      .post(`${this.apiUrl}Event/addEvent/${this.selectedAgencyToWhomWillNewEventBeAdded?.agencyId}`, this.eventToBeAdded)
      .subscribe(
        () => {
          this.showToast('success', 'Success', 'Event details added successfully!');
          this.getAgencies(); // refresh the agency info to include the new event
          this.getModels(); // refresh the models list to reflect changes
          this.errorMessage = ''; // reset error message
          this.addEventToAgencyVisible = false; // close the dialog
        },
        (error) => {
          this.showToast('error', 'Error', 'Failed to add event details.');
          console.error('Error adding event details:', error);
        }
      );
  }

  addEventFormNotValid() {
    return this.eventToBeAdded!.title === '' ||
      this.eventToBeAdded!.description === '' ||
      this.eventToBeAdded!.address === '' ||
      this.eventToBeAdded!.eventStart === '' ||
      this.eventToBeAdded!.eventFinish === '' ||
      this.eventToBeAdded!.profilePicture === ''
  }
}
