import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { AgencyInfoDto, FreelancerRequestForAgency } from '../../_Models/agency';
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

@Component({
  selector: 'app-agency-profile',
  standalone: true,
  imports: [HttpClientModule, ChipModule, CalendarModule, FormsModule, CommonModule, CarouselModule, NgIf, NgFor, StepperModule, DropdownModule],
  providers: [AuthService, ConfirmationService, MessageService],
  templateUrl: './agency-profile.component.html',
  styleUrl: './agency-profile.component.css'
})
export class AgencyProfileComponent implements OnInit {
  apiUrl = environment.apiUrl;
  userId: string | null = null;
  loggedInUserId: string = '';
  highlightedDates: Date[] = [];
  private routeSubscription: Subscription = new Subscription();
  agencyInfo: AgencyInfoDto | null = null;
  pendingFreelancerRequests: FreelancerRequestForAgency[] = [];
  editDialogeVisible: boolean = false;
  addEventDalogueVisible: boolean = false;
  unsignModelConfirmationDialogeVisible: boolean = false;
  eventStatusOptions: { label: string }[] = [
    { label: 'Active' },
    { label: 'Inactive' },
    { label: 'Remove Filter' }
  ];
  selectedEventStatus: string | null = null;
  filteredEvents: EventCardDto[] = [];

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
    // if (this.userId !== this.loggedInUserId) {
    //   return;
    // }
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

  goToFreelancerRequests() {
    // this.router.navigate(['/freelancer-requests', this.userId]);   //userId is the agency user id
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
    this.router.navigate(['/event-details', eventId]);
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
}
