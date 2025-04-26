import {
  Component,
  Inject,
  PLATFORM_ID,
  ElementRef,
  ViewChild,
  OnInit
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { EventDetailsDto, UpdateEventDto } from '../_Models/event';
import { AuthService } from '../_Services/auth.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { CarouselModule } from 'primeng/carousel';
import { ToastModule } from 'primeng/toast';
import { MessageService, ConfirmationService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { FileUploadModule } from 'primeng/fileupload';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FormsModule } from '@angular/forms';
import { InputTextareaModule } from 'primeng/inputtextarea';
@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [HttpClientModule, CommonModule, ButtonModule, CarouselModule, ToastModule, DialogModule, InputTextModule, CalendarModule, FileUploadModule, ConfirmDialogModule, FormsModule, InputTextareaModule],
  providers: [MessageService, ConfirmationService],
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.css'
})
export class EventDetailsComponent implements OnInit {
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;

  eventId: string | null = null;
  userId: number | null = null;
  role: string | null = null;
  apiUrl = environment.apiUrl;
  eventDetails: EventDetailsDto | null = null;
  isAttending = false;
  responsiveOptions: any[] = [];
  editDialogVisible = false;
  deleteDialogVisible = false;
  minDate: Date = new Date(new Date().setHours(0, 0, 0, 0)); // today's date, set to midnight

  // for updating event details, populate in getEventDetails
  updatedEventDetails: UpdateEventDto = {
    id: 0,
    title: '',
    description: '',
    address: '',
    cityName: '',
    countryName: '',
    latitude: 0,
    longitude: 0,
    eventStart: new Date(),   // rmemember to transfor to string later
    eventFinish: new Date(),
    profilePicture: ''
  };
  pictureForUpdate: File | null = null;
  addressSuggestions: any[] = [];
  selectedAddress: string = '';
  errorMessage: string = '';

  map!: L.Map | undefined;
  marker!: L.Marker;
  latitude = 0;
  longitude = 0;
  mapInitialized = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    this.eventId = this.route.snapshot.paramMap.get('id');
    this.userId = this.authService.getUserId();
    this.role = this.authService.getUserRole();
    this.getEventDetails(this.eventId, this.userId);

    this.responsiveOptions = [
      {
        breakpoint: '1024px',
        numVisible: 3,
        numScroll: 1
      },
      {
        breakpoint: '768px',
        numVisible: 2,
        numScroll: 1
      },
      {
        breakpoint: '560px',
        numVisible: 1,
        numScroll: 1
      }
    ];
  }

  getEventDetails(eventId: string | null, userId: number | null) {
    if (!eventId) return;

    this.http
      .get<EventDetailsDto>(`${this.apiUrl}Event/getEventDetails/${eventId}/${userId}`)
      .subscribe(
        async (response) => {
          this.eventDetails = response;
          this.latitude = response.latitude || 0;
          this.longitude = response.longitude || 0;
          this.isAttending = response.isAttending || false;

          if (isPlatformBrowser(this.platformId) && !this.mapInitialized) {
            this.initMap();
          }

          // populate updateEventDetails with the current event details
          this.updatedEventDetails.id = this.eventDetails?.id || 0;
          this.updatedEventDetails.title = this.eventDetails?.title || '';
          this.updatedEventDetails.description = this.eventDetails?.description || '';
          this.updatedEventDetails.address = this.eventDetails?.address || '';
          this.updatedEventDetails.cityName = this.eventDetails?.cityName || '';
          this.updatedEventDetails.countryName = this.eventDetails?.countryName || '';
          this.updatedEventDetails.latitude = this.eventDetails?.latitude || 0;
          this.updatedEventDetails.longitude = this.eventDetails?.longitude || 0;
          this.updatedEventDetails.eventStart = this.eventDetails?.eventStart
            ? new Date(this.eventDetails.eventStart)
            : new Date();
          this.updatedEventDetails.eventFinish = this.eventDetails?.eventFinish
            ? new Date(this.eventDetails.eventFinish)
            : new Date();
          this.updatedEventDetails.profilePicture = this.eventDetails?.profilePicture || '';
          // set selectedAddress for the address input field
          this.selectedAddress = this.eventDetails?.address || '';
        },
        (error) => {
          console.error('Error fetching event details:', error);
        }
      );
  }

  private async loadLeaflet(): Promise<typeof import('leaflet')> {
    return await import('leaflet');
  }

  async initMap() {
    if (!this.mapContainer?.nativeElement || this.mapInitialized) return;

    const L = await this.loadLeaflet();

    this.map = L.map(this.mapContainer.nativeElement).setView(
      [this.latitude, this.longitude],
      13
    );

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);

    // Create icon manually
    const icon = L.icon({
      iconUrl: 'assets/images/marker-icon.png',
      shadowUrl: 'assets/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    this.marker = L.marker([this.latitude, this.longitude], { icon }).addTo(this.map);

    this.mapInitialized = true;
  }

  toggleAttendance() {
    if (this.role != 'model') return; // only models can toggle attendance
    this.http
      .post(`${this.apiUrl}Model/toggleEventAttendance/${this.eventId}/${this.userId}`, {})
      .subscribe(
        () => {
          this.isAttending = !this.isAttending;
          this.showToast(
            'success',
            this.isAttending ? 'Success' : 'Cancelled',
            this.isAttending ? 'You are now attending the event!' : 'You have cancelled your attendance.'
          );
          this.getEventDetails(this.eventId, this.userId); // refresh event details
        },
        (error) => {
          console.error(`Error toggeling the event attendance:`, error);
        }
      );
  }

  goToModelProfile(modelId: number) {
    this.router.navigate(['/profile', modelId]);
  }

  showToast(severity: string, summary: string, detail: string) {
    this.messageService.add({ severity: severity, summary: summary, detail: detail });
  }

  cancelEditEventChanges() {
    this.editDialogVisible = false;
    this.getEventDetails(this.eventId, this.userId); // refresh event details
  }

  async saveEditEventChanges() {
    if (this.pictureForUpdate) {
      const base64 = await this.convertFileToBase64(this.pictureForUpdate);
      this.updatedEventDetails.profilePicture = base64;
    }
    // check all required fields are filled and if finish date is later then start date
    if (this.formNotValid()) {
      this.errorMessage = 'Please fill all required fields.';
      return;
    } else if ((this.updatedEventDetails.eventFinish ?? new Date()) < (this.updatedEventDetails.eventStart ?? new Date())) {
      this.errorMessage = 'Finish date must be later than start date.';
      return;
    }
    // in case address is not selected from autocomplete, set it to the selected address
    if (this.updatedEventDetails.address === '') {
      this.updatedEventDetails.address = this.selectedAddress;
    }
    this.errorMessage = '';
    this.http
      .put(`${this.apiUrl}Event/editEvent/${this.eventId}`, this.updatedEventDetails)
      .subscribe(
        () => {
          this.showToast('success', 'Success', 'Event details updated successfully!');
          this.getEventDetails(this.eventId, this.userId); // refresh event details
        },
        (error) => {
          this.showToast('error', 'Error', 'Failed to update event details.');
          this.editDialogVisible = false; // close the dialog
          console.error('Error updating event details:', error);
        }
      );
      this.editDialogVisible = false;
  }

  deleteEvent() {
    this.deleteDialogVisible = false;
    this.http
      .delete(`${this.apiUrl}Event/deleteEvent/${this.eventId}`)
      .subscribe(
        () => {
          this.showToast('success', 'Success', 'Event deleted successfully!');
          this.router.navigate(['/profile', this.userId]); // redirect to agency profile page
        },
        (error) => {
          this.showToast('error', 'Error', 'Failed to delete the event.');
          this.deleteDialogVisible = false; // close the dialog
          console.error('Error deleting event:', error);
        }
      );
  }

  confirmDelete(event: any) {
    this.confirmationService.confirm({
      target: event.target,
      message: 'Are you sure you want to delete this event?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteEvent();
      },
      reject: () => {
        this.deleteDialogVisible = false; // close the dialog
      }
    });
  }

  async onFileSelected(event: any) {
    const file = event.files[0];
    if (file) {
      this.pictureForUpdate = file;
      const base64 = await this.convertFileToBase64(this.pictureForUpdate!);
      this.updatedEventDetails.profilePicture = base64;
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

  onAddressSearch(event: any) {
    const query = (event.target as HTMLInputElement).value;
    if (!query || query.length < 4) {         // minimum 4 characters
      this.addressSuggestions = [];
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
        // make sure the sugegstions always contain address
        this.addressSuggestions = results.filter((result: any) => {
          const address = result.address;
          return (
            address.road ||
            address.neighbourhood ||
            address.suburb
          );
        });
      });
  }

  selectSuggestion(suggestion: any) {
    this.selectedAddress = suggestion.display_name;
    const road =
      suggestion.address.road ||
      suggestion.address.neighbourhood ||
      suggestion.address.suburb ||
      suggestion.address.city_district ||
      '';
    const houseNumber = suggestion.address?.house_number || '';
    this.updatedEventDetails.address = `${road} ${houseNumber}`.trim();
    this.updatedEventDetails.latitude = parseFloat(suggestion.lat);
    this.updatedEventDetails.longitude = parseFloat(suggestion.lon);
    this.updatedEventDetails.cityName = suggestion.address?.city || suggestion.address?.town || '';
    this.updatedEventDetails.countryName = suggestion.address?.country || '';
    this.addressSuggestions = [];
  }

  formNotValid() {
    return this.updatedEventDetails.title === '' ||
      this.updatedEventDetails.description === '' ||
      this.updatedEventDetails.address === '' ||
      this.updatedEventDetails.cityName === '' ||
      this.updatedEventDetails.countryName === '' ||
      this.updatedEventDetails.latitude === 0 ||
      this.updatedEventDetails.longitude === 0 ||
      this.updatedEventDetails.eventStart === null ||
      this.updatedEventDetails.eventFinish === null ||
      this.updatedEventDetails.profilePicture === ''
  }

}
