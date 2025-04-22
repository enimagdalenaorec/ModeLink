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
import { EventDetailsDto } from '../_Models/event';
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

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [HttpClientModule, CommonModule, ButtonModule, CarouselModule, ToastModule, DialogModule, InputTextModule, CalendarModule, FileUploadModule, ConfirmDialogModule],
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

  saveEditEventChanges() {
    this.editDialogVisible = false;
    this.http
      .put(`${this.apiUrl}Event/editEvent/${this.eventId}`, this.eventDetails)
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

}
