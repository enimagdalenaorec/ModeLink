import { Component, model, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ModelApplicationForCalendarDTO, ModelInfoDTO } from '../../_Models/model';
import { AuthService } from '../../_Services/auth.service';
import { environment } from '../../../environments/environment';
import { CalendarModule } from 'primeng/calendar';
import { NgIf } from '@angular/common';
import { ChipModule } from 'primeng/chip';

@Component({
  selector: 'app-model-profile',
  standalone: true,
  imports: [CommonModule, HttpClientModule, CalendarModule, NgIf, ChipModule],
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

  constructor(private router: Router, private http: HttpClient, private authService: AuthService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    // get userId from url
    this.userId = this.route.snapshot.paramMap.get('id') || '';
    // fetch model info
    this.getModelInfo();
  }

  getModelInfo() {
    this.http.get<ModelInfoDTO>(this.apiUrl + 'Model/getModelDetails/' + this.userId).subscribe(
      (response) => {
        this.modelInfo = response;
        console.log(this.modelInfo);
        this.highlightedDates = this.modelInfo.modelApplications.map((application) =>
          new Date(application.eventFinish)
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
}
