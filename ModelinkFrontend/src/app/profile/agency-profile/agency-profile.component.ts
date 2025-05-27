import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { AgencyInfoDto, FreelancerRequestForAgency, UpdateAgencyInfoDTO } from '../../_Models/agency';
import { AddNewEventDTO } from '../../_Models/event';
import { ChipModule } from 'primeng/chip';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'primeng/carousel';
import { AuthService } from '../../_Services/auth.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { NgIf, NgFor } from '@angular/common';
import { StepperModule } from 'primeng/stepper';
import { DropdownModule } from 'primeng/dropdown';
import { EventCardDto } from '../../_Models/event';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-agency-profile',
  standalone: true,
  imports: [HttpClientModule, ChipModule, CalendarModule, FormsModule, CommonModule, CarouselModule, NgIf, NgFor, StepperModule, DropdownModule, ToastModule, ConfirmDialogModule, DialogModule, InputTextareaModule, FileUploadModule, InputTextModule],
  providers: [AuthService, ConfirmationService, MessageService],
  templateUrl: './agency-profile.component.html',
  styleUrl: './agency-profile.component.css'
})
export class AgencyProfileComponent implements OnInit {
  apiUrl = environment.apiUrl;
  userId: string | null = null;
  loggedInUserId: string = '';
  loggedInUserIsModelOfThisAgency: boolean = false;
  loggedInUserIsFreelancerThatRequestedToJoinThisAgency: boolean = false;
  loggedInUserIsFreelancer: boolean = false; // this is used to check if the logged in user is a freelancer
  highlightedDates: Date[] = [];
  private routeSubscription: Subscription = new Subscription();
  agencyInfo: AgencyInfoDto | null = null;
  pendingFreelancerRequests: FreelancerRequestForAgency[] = [];
  editDialogeVisible: boolean = false;
  addEventDialogueVisible: boolean = false;
  eventStatusOptions: { label: string }[] = [
    { label: 'Active' },
    { label: 'Inactive' },
    { label: 'Remove Filter' }
  ];
  freelancerRequestStatusOptions: { label: string }[] = [
    { label: 'Pending' },
    { label: 'Accepted' },
    { label: 'Declined' },
    { label: 'Remove Filter' }
  ];
  selectedEventStatus: string | null = null;
  filteredEvents: EventCardDto[] = [];
  selectedFreelancerRequestStatus: string | null = null;
  filteredFreelancerRequests: FreelancerRequestForAgency[] = [];
  // for adding new event
  newEvent: AddNewEventDTO = {
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
  minDate: Date = new Date(new Date().setHours(0, 0, 0, 0)); // today's date, set to midnight
  addEventAddressSuggestions: any[] = [];
  selectedAddEventAddress: string = '';
  addEventErrorMessage: string = '';
  pictureForAddEvent: File | null = null;
  // for editing agency info
  editAgencyInfo: UpdateAgencyInfoDTO = {
    name: '',
    description: '',
    email: '',
    address: '',
    cityName: '',
    countryName: '',
    countryCode: '',
    profilePicture: '',
    agencyId: 0
  };
  updateInfoErrorMessage: string = '';
  updateInfoAddressSuggestions: any[] = [];
  selectedUpdateInfoAddress: string = '';
  pictureForUpdateInfo: File | null = null;

  constructor(private router: Router, private messageService: MessageService, private http: HttpClient, private authService: AuthService, private route: ActivatedRoute, private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id');
    this.loggedInUserId = this.authService.getUserId()?.toString() || '';
    this.getAgencyInfo();

    // subscribe since angular detect change isnt workin gpropertly in some cases
    this.routeSubscription = this.route.params.subscribe(params => {
      this.userId = params['id'];
      this.getAgencyInfo();
    });
  }

  getAgencyInfo() {
    this.http.get(`${this.apiUrl}Agency/agencyInfo/${this.userId}`).subscribe(
      (response) => {
        this.agencyInfo = response as AgencyInfoDto;
        if (this.agencyInfo && this.agencyInfo.events) {
          this.highlightedDates = this.agencyInfo.events.map(event => {
            const [day, month, year] = event.startDate.split('-').map(Number);
            return new Date(year, month, day); // month krece od 0
          });
        }
        if (this.agencyInfo && this.agencyInfo.freelancerRequests) {
          this.pendingFreelancerRequests = this.agencyInfo.freelancerRequests.filter(request => request.status === 'pending');
        }
        if (this.agencyInfo && this.agencyInfo.events) {
          // first all events are shown
          this.filteredEvents = this.agencyInfo.events;
        }
        if (this.agencyInfo && this.agencyInfo.freelancerRequests) {
          // first all freelancer requests are shown
          this.filteredFreelancerRequests = this.agencyInfo.freelancerRequests;
        }
        // patch agency info into edit dialog
        this.patchAgencyInfoIntoEditDialog();
        // check if the logged in user is a model of this agency
        this.loggedInUserIsModelOfThisAgency = this.agencyInfo?.models?.some(model => model.userId.toString() === this.loggedInUserId) ?? false;
        // check if the logged in user is a freelancer that requested to join this agency
        this.loggedInUserIsFreelancerThatRequestedToJoinThisAgency = this.agencyInfo?.freelancerRequests?.some(request => request.userModelId.toString() === this.loggedInUserId && request.status === 'pending') ?? false;
        // check if the logged in user is a freelancer
        this.loggedInUserIsFreelancer = this.agencyInfo?.models?.some(model => model.userId.toString() === this.loggedInUserId) ? false : true;
      },
      (error) => {
        console.error('Error fetching agency profile:', error);
      }
    );
  }

  showToast(severity: string, summary: string, detail: string) {
    this.messageService.add({ severity: severity, summary: summary, detail: detail });
  }

  isHighlightedDate(day: number, month: number, year: number): boolean {
    return this.highlightedDates.some((d) =>
      d.getDate() === day &&
      d.getMonth() === month + 1 &&
      d.getFullYear() === year
    );
  }

  onDateClick(date: any) {
    // rerouting is only allowed for models that are part of the agency, and the agency whos profile this is
    if (this.userId != this.loggedInUserId && !this.loggedInUserIsModelOfThisAgency) {
      return;
    }
    const recievedDate = new Date(date.year, date.month, date.day);
    const clickedEvent = this.agencyInfo?.events!.find((event) => {
      const [day, month, year] = event.startDate.split('-').map(Number);
      const eventStartDate = new Date(year, month - 1, day);
      return (
        eventStartDate.getDate() === recievedDate.getDate() &&
        eventStartDate.getMonth() === recievedDate.getMonth() &&
        eventStartDate.getFullYear() === recievedDate.getFullYear()
      );
    });
    if (clickedEvent && clickedEvent.id) {
      this.router.navigate(['/event-details', clickedEvent.id]);
    } else {
      console.log('No event found for the clicked date.');
    }
  }

  formatDate(isoString: string): string {
    const date = new Date(isoString);

    const day = date.getDate();
    const month = date.getMonth() + 1; // getMonth() is zero-based
    const year = date.getFullYear();

    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${day}.${month}.${year} ${hours}:${minutes}`;
  }

  goToModelProfile(userModelId: number) {
    this.router.navigate(['/model-profile', userModelId]);
  }

  eventStatusFilterChange(event: any) {
    if (event.value.label === 'Remove Filter') {
      this.filteredEvents = this.agencyInfo?.events || [];
      this.selectedEventStatus = null;
    } else if (event.value.label === 'Active') {
      this.filteredEvents = this.agencyInfo?.events!.filter(event => {
        const [day, month, year] = event.startDate.split('-').map(Number);
        const eventDate = new Date(year, month - 1, day); // m is 0-based
        return eventDate >= new Date();
      }) || [];
    } else if (event.value.label === 'Inactive') {
      this.filteredEvents = this.agencyInfo?.events!.filter(event => {
        const [day, month, year] = event.startDate.split('-').map(Number);
        const eventDate = new Date(year, month - 1, day); // m is 0-based
        return eventDate < new Date();
      }) || [];
    }
  }

  selectEvent(eventId: number) {
    // rerouting is only allowed for models that are part of the agency, and the agency whos profile this is
    if (this.userId == this.loggedInUserId || this.loggedInUserIsModelOfThisAgency) {
      this.router.navigate(['/event-details', eventId]);
    } else {
      return;
    }
  }

  onImageError(event: any) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/images/user.png';
  }

  formatDateForEventCard(dateString: string): string {
    const day = dateString.split('-')[0];
    const month = dateString.split('-')[1];
    const year = dateString.split('-')[2];
    return `${day}/${month}/${year}`;
  }

  acceptFreelancerRequest(requestId: number) {
    // Show confirmation dialog before accepting the request
    this.confirmationService.confirm({
      message: 'Are you sure you want to accept this freelancer request?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.processAcceptFreelancerRequest(requestId);
      },
      reject: () => {
        this.showToast('info', 'Request Cancelled', 'The freelancer request acceptance has been cancelled.');
      }
    });
  }

  processAcceptFreelancerRequest(requestId: number) {
    this.http.post(`${this.apiUrl}Agency/acceptFreelancerRequest/${requestId}`, {}).subscribe(
      (response) => {
        this.showToast('success', 'Request Accepted', 'The freelancer request has been accepted successfully.');
        this.getAgencyInfo();
      }, (error) => {
        console.error('Error accepting freelancer request:', error);
        this.showToast('error', 'Request Failed', 'The freelancer request could not be accepted.');
      }
    );
  }

  declineFreelancerRequest(requestId: number) {
    // Show confirmation dialog before declining the request
    this.confirmationService.confirm({
      message: 'Are you sure you want to decline this freelancer request?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.processDeclineFreelancerRequest(requestId);
      },
      reject: () => {
        this.showToast('info', 'Request Cancelled', 'The freelancer request decline has been cancelled.');
      }
    });
  }

  processDeclineFreelancerRequest(requestId: number) {
    this.http.post(`${this.apiUrl}Agency/declineFreelancerRequest/${requestId}`, {}).subscribe(
      (response) => {
        this.showToast('success', 'Request Declined', 'The freelancer request has been declined successfully.');
        this.getAgencyInfo();
      }, (error) => {
        console.error('Error declining freelancer request:', error);
        this.showToast('error', 'Request Failed', 'The freelancer request could not be declined.');
      }
    );
  }

  freelancerRequestStatusFilterChange(event: any) {
    if (event.value.label === 'Remove Filter') {
      this.filteredFreelancerRequests = this.agencyInfo?.freelancerRequests || [];
      this.selectedFreelancerRequestStatus = null;
    } else if (event.value.label === 'Pending') {
      this.filteredFreelancerRequests = this.agencyInfo?.freelancerRequests!.filter(request => request.status === 'pending') || [];
    } else if (event.value.label === 'Accepted') {
      this.filteredFreelancerRequests = this.agencyInfo?.freelancerRequests!.filter(request => request.status === 'accepted') || [];
    } else if (event.value.label === 'Declined') {
      this.filteredFreelancerRequests = this.agencyInfo?.freelancerRequests!.filter(request => request.status === 'declined') || [];
    }
  }

  unsignModel(userId: number) {
    // Show confirmation dialog before unsigning the model
    this.confirmationService.confirm({
      message: 'Are you sure you want to unsign this model from your agency?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.processUnsignModel(userId);
      },
      reject: () => {
        this.showToast('info', 'Request Cancelled', 'The model unsigning has been cancelled.');
      }
    });
  }

  processUnsignModel(userId: number) {
    this.http.post(`${this.apiUrl}Agency/unsignModel/${userId}`, {}).subscribe(
      (response) => {
        this.showToast('success', 'Model Unsigning Successful', 'The model has been successfully unsigned from your agency.');
        this.getAgencyInfo();
      }, (error) => {
        console.error('Error unsigning model:', error);
        this.showToast('error', 'Unsigning Failed', 'The model could not be unsigned from your agency.');
      }
    );
  }

  // for adding new event

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
    this.newEvent.address = `${road} ${houseNumber}`.trim();
    this.newEvent.latitude = parseFloat(suggestion.lat);
    this.newEvent.longitude = parseFloat(suggestion.lon);
    this.newEvent.cityName = suggestion.address?.city || suggestion.address?.town || '';
    this.newEvent.countryName = suggestion.address?.country || '';
    this.newEvent.countryCode = suggestion.address?.country_code || '';
    this.addEventAddressSuggestions = [];
  }

  async onAddEventFileSelected(event: any, fileUpload?: any) {
    const file = event.files[0];
    if (file) {
      this.pictureForAddEvent = file;
      const base64 = await this.convertFileToBase64(this.pictureForAddEvent!);
      this.newEvent.profilePicture = base64;
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

  cancelAddEventChanges() {
    this.addEventDialogueVisible = false;
    this.selectedAddEventAddress = ''; // reset the selected address
    this.pictureForAddEvent = null; // reset the picture for add event
    this.onAddEventFileSelected({ files: [] }); // reset the file input
    this.newEvent = {
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
    if (this.pictureForAddEvent) {
      const base64 = await this.convertFileToBase64(this.pictureForAddEvent);
      this.newEvent.profilePicture = base64;
    }
    // check all required fields are filled and if finish date is later then start date
    if (this.addEventFormNotValid()) {
      if (this.newEvent.address === '') {
        this.addEventErrorMessage = 'Please select an address from the suggestions.';
        return;
      }
      this.addEventErrorMessage = 'Please fill all required fields.';
      return;
    } else if ((this.newEvent.eventFinish ?? new Date()) < (this.newEvent.eventStart ?? new Date())) {
      this.addEventErrorMessage = 'Finish date must be later than start date.';
      return;
    }
    // in case address is not selected from autocomplete, set it to the selected address
    if (this.newEvent.address === '') {
      this.newEvent.address = this.selectedAddEventAddress;
    }
    this.addEventErrorMessage = '';
    // add agencyId to the newEvent object
    this.newEvent.agencyId = this.agencyInfo?.agencyId || 0;
    this.http
      .post(`${this.apiUrl}Event/addEvent/${this.agencyInfo?.agencyId}`, this.newEvent)
      .subscribe(
        () => {
          this.showToast('success', 'Success', 'Event details added successfully!');
          this.getAgencyInfo(); // refresh the agency info to include the new event
          this.addEventDialogueVisible = false; // close the dialog
        },
        (error) => {
          this.showToast('error', 'Error', 'Failed to add event details.');
          console.error('Error adding event details:', error);
        }
      );
  }

  addEventFormNotValid() {
    return this.newEvent.title === '' ||
      this.newEvent.description === '' ||
      this.newEvent.address === '' ||
      this.newEvent.eventStart === '' ||
      this.newEvent.eventFinish === '' ||
      this.newEvent.profilePicture === ''
  }

  // for editing agency info

  onUpdateInfoAddressSearch(event: any) {
    const query = (event.target as HTMLInputElement).value;
    if (!query || query.length < 4) {         // minimum 4 characters
      this.updateInfoAddressSuggestions = [];
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
        this.updateInfoAddressSuggestions = results.filter((result: any) => {
          const address = result.address;
          return (
            address.road ||
            address.neighbourhood ||
            address.suburb
          );
        });
      });
  }

  selectUpdateInfoAddressSuggestion(suggestion: any) {
    this.selectedUpdateInfoAddress = suggestion.display_name;
    const road =
      suggestion.address.road ||
      suggestion.address.neighbourhood ||
      suggestion.address.suburb ||
      suggestion.address.city_district ||
      '';
    const houseNumber = suggestion.address?.house_number || '';
    this.editAgencyInfo.address = `${road} ${houseNumber}`.trim();
    this.editAgencyInfo.cityName = suggestion.address?.city || suggestion.address?.town || '';
    this.editAgencyInfo.countryName = suggestion.address?.country || '';
    this.editAgencyInfo.countryCode = suggestion.address?.country_code || '';
    this.updateInfoAddressSuggestions = [];
  }

  async onUpdateInfoFileSelected(event: any, fileUpload?: any) {
    const file = event.files[0];
    if (file) {
      this.pictureForUpdateInfo = file;
      const base64 = await this.convertFileToBase64(this.pictureForUpdateInfo!);
      this.editAgencyInfo.profilePicture = base64;
    }
    if (fileUpload) {
      fileUpload.clear(); // clear the file input after selection
    }
  }

  cancelUpdateInfo() {
    this.editDialogeVisible = false;
    this.selectedUpdateInfoAddress = ''; // reset the selected address
    this.pictureForUpdateInfo = null; // reset the picture for update info
    this.onUpdateInfoFileSelected({ files: [] }); // reset the file input
    this.editAgencyInfo = {
      agencyId: 0,
      name: '',
      email: '',
      description: '',
      address: '',
      cityName: '',
      countryName: '',
      countryCode: '',
      profilePicture: ''
    };
  }

  async saveUpdateInfo() {
    if (this.pictureForUpdateInfo) {
      const base64 = await this.convertFileToBase64(this.pictureForUpdateInfo);
      this.editAgencyInfo.profilePicture = base64;
    }
    // check all required fields are filled
    if (this.updateInfoFormNotValid()) {
      if (this.editAgencyInfo.address === '') {
        this.updateInfoErrorMessage = 'Please select an address from the suggestions.';
      } else {
        this.updateInfoErrorMessage = 'Please fill all required fields.';
        return;
      }
    }
    this.updateInfoErrorMessage = '';
    // add agencyId to the newEvent object
    this.editAgencyInfo.agencyId = this.agencyInfo?.agencyId || 0;
    this.http
      .post(`${this.apiUrl}Agency/updateInfo/${this.agencyInfo?.agencyId}`, this.editAgencyInfo)
      .subscribe(
        () => {
          this.showToast('success', 'Success', 'Agency info updated successfully!');
          this.getAgencyInfo(); // refresh the agency info to include the new event
          this.editDialogeVisible = false; // close the dialog
        },
        (error) => {
          this.showToast('error', 'Error', 'Failed to update agency info.');
          console.error('Error updating agency info:', error);
        }
      );
  }

  updateInfoFormNotValid() {
    return this.editAgencyInfo.name === '' ||
      this.editAgencyInfo.description === '' ||
      this.editAgencyInfo.address === '' ||
      this.editAgencyInfo.profilePicture === '' ||
      this.editAgencyInfo.email === '' ||
      this.selectedUpdateInfoAddress === ''
  }

  patchAgencyInfoIntoEditDialog() {
    this.editAgencyInfo = {
      name: this.agencyInfo?.name || '',
      description: this.agencyInfo?.description || '',
      email: this.agencyInfo?.email || '',
      address: this.agencyInfo?.address || '',
      cityName: this.agencyInfo?.cityName || '',
      countryName: this.agencyInfo?.countryName || '',
      countryCode: this.agencyInfo?.countryCode || '',
      profilePicture: this.agencyInfo?.profilePicture || '',
      agencyId: this.agencyInfo?.agencyId || 0
    }
    this.selectedUpdateInfoAddress = this.agencyInfo?.address + ", " + this.agencyInfo?.cityName + ", " + this.agencyInfo?.countryName || '';
  }

  requestToJoinAgency() {
    if (!this.loggedInUserIsFreelancerThatRequestedToJoinThisAgency) {
      this.confirmationService.confirm({
        message: 'Are you sure you want to send a request to join this agency?',
        header: 'Confirm',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.processRequestToJoinAgency();
        },
        reject: () => {
          this.showToast('info', 'Request Cancelled', 'The request to join the agency has been cancelled.');
        }
      });
    } else {
      this.confirmationService.confirm({
        message: 'You have already sent a request to join this agency. Do you want to cancel your request?',
        header: 'Confirm',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.http.post(`${this.apiUrl}Model/cancelRequestToJoin/${this.agencyInfo?.agencyId}/${this.loggedInUserId}`, {})
            .subscribe(
              () => {
                this.showToast('success', 'Request Cancelled', 'Your request to join the agency has been cancelled.');
                this.loggedInUserIsFreelancerThatRequestedToJoinThisAgency = false; // set the flag to false
                this.getAgencyInfo();
              },
              (error) => {
                this.showToast('error', 'Error', 'Failed to cancel request to join the agency.');
                console.error('Error cancelling request to join agency:', error);
              }
            );
        },
        reject: () => {
          this.showToast('info', 'Request Not Cancelled', 'Your request to join the agency has not been cancelled.');
        }
      });
    }
  }

  processRequestToJoinAgency() {
    this.http.post(`${this.apiUrl}Model/requestToJoin/${this.agencyInfo?.agencyId}/${this.loggedInUserId}`, {})
      .subscribe(
        () => {
          this.showToast('success', 'Request Sent', 'Your request to join the agency has been sent.');
          this.loggedInUserIsFreelancerThatRequestedToJoinThisAgency = true; // set the flag to true
          this.getAgencyInfo();
        },
        (error) => {
          this.showToast('error', 'Error', 'Failed to send request to join the agency.');
          console.error('Error sending request to join agency:', error);
        }
      );
  }
}
