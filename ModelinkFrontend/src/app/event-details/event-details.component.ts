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

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.css'
})
export class EventDetailsComponent implements OnInit {
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;

  eventId: string | null = null;
  userId: number | null = null;
  apiUrl = environment.apiUrl;
  eventDetails: EventDetailsDto | null = null;

  map!: L.Map | undefined;
  marker!: L.Marker;
  latitude = 0;
  longitude = 0;
  mapInitialized = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    this.eventId = this.route.snapshot.paramMap.get('id');
    this.userId = this.authService.getUserId();
    this.getEventDetails(this.eventId, this.userId);
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
    if (!this.mapContainer?.nativeElement) return;
    if (this.mapInitialized) return;

    const L = await this.loadLeaflet();

    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'assets/images/marker-icon-2x.png',
      iconUrl: 'assets/images/marker-icon.png',
      shadowUrl: 'assets/images/marker-shadow.png',
    });

    // Default location (centered somewhere initially)
    this.map = L.map(this.mapContainer.nativeElement).setView(
      [51.505, -0.09],
      15
    );

    // Load OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);

    // Initialize marker
    this.marker = L.marker([51.505, -0.09], { draggable: true }).addTo(
      this.map
    );

    this.mapInitialized = true;
  }
}
