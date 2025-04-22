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

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [HttpClientModule, CommonModule, ButtonModule, CarouselModule],
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
}
