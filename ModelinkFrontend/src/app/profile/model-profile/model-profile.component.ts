import { Component, model, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ModelApplicationForCalendarDTO, ModelInfoDTO, PortfolioPostDTO } from '../../_Models/model';
import { AuthService } from '../../_Services/auth.service';
import { environment } from '../../../environments/environment';
import { CalendarModule } from 'primeng/calendar';
import { NgIf, NgFor } from '@angular/common';
import { ChipModule } from 'primeng/chip';
import { GalleriaModule } from 'primeng/galleria';
import { DividerModule } from 'primeng/divider';
@Component({
  selector: 'app-model-profile',
  standalone: true,
  imports: [CommonModule, HttpClientModule, CalendarModule, NgIf, ChipModule, NgFor, GalleriaModule, DividerModule],
  templateUrl: './model-profile.component.html',
  styleUrl: './model-profile.component.css'
})
export class ModelProfileComponent implements OnInit {
  apiUrl: string = environment.apiUrl;
  userId: string = ''; // from url
  modelInfo: ModelInfoDTO = {
    userId: 0,
    modelId: 0,
    firstName: '',
    lastName: '',
    agencyName: '',
    agencyId: 0,
    cityName: '',
    countryName: '',
    countryCode: '',
    profilePicture: '',
    email: '',
    hairColor: '',
    skinColor: '',
    eyeColor: '',
    height: 0,
    weight: 0,
    gender: '',
    modelApplications: [],
  };
  highlightedDates: Date[] = [];  // for calendar
  portfolioPosts: PortfolioPostDTO[] = [];
  responsiveOptions: any[] = [];
  responsiveOptionImages: any[] = [];

  constructor(private router: Router, private http: HttpClient, private authService: AuthService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.responsiveOptionImages = [
      {
          breakpoint: '1300px',
          numVisible: 4
      },
      {
          breakpoint: '575px',
          numVisible: 1
      }
  ];
    // get userId from url
    this.userId = this.route.snapshot.paramMap.get('id') || '';
    // fetch model info
    this.getModelInfo();
  }

  getModelInfo() {
    this.http.get<ModelInfoDTO>(this.apiUrl + 'Model/getModelDetails/' + this.userId).subscribe(
      (response) => {
        this.modelInfo = response;
        // console.log(this.modelInfo);
        this.highlightedDates = this.modelInfo.modelApplications.map((application) =>
          new Date(application.eventFinish)
        );
        // get posts
        this.http.get<PortfolioPostDTO[]>(this.apiUrl + 'Model/getPortfolioPosts/' + this.modelInfo.modelId).subscribe(
          (posts) => {
            this.portfolioPosts = posts;
          },
          (error) => {
            console.error('Error fetching portfolio posts:', error);
          }
        );
      }, (error) => {
        console.error('Error fetching model info:', error);
      }
    );
  }

  isHighlightedDate(day: number, month: number, year: number): boolean {
    return this.highlightedDates.some((d) =>
      d.getDate() === day &&
      d.getMonth() === month &&
      d.getFullYear() === year
    );
  }

  onDateClick(date: Date) {
    const clickedDate = new Date(date);
    // find id of the event whose date is finish date
    const eventId = this.modelInfo.modelApplications.find((event) => {
      const eventFinishDate = new Date(event.eventFinish);
      return eventFinishDate.getTime() === clickedDate.getTime();
    })?.eventId;
    if (eventId) {
      this.router.navigate(['/event-details', eventId]);
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

}
