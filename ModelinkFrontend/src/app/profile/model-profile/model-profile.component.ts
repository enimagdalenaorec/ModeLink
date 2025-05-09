import { Component, model, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { EyeColors, HairColors, ModelApplicationForCalendarDTO, ModelInfoDTO, PortfolioPostDTO, SkinColors, UpdateModelInfoDTO } from '../../_Models/model';
import { AuthService } from '../../_Services/auth.service';
import { environment } from '../../../environments/environment';
import { CalendarModule } from 'primeng/calendar';
import { NgIf, NgFor } from '@angular/common';
import { ChipModule } from 'primeng/chip';
import { GalleriaModule } from 'primeng/galleria';
import { DividerModule } from 'primeng/divider';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
  selector: 'app-model-profile',
  standalone: true,
  imports: [CommonModule, HttpClientModule, CalendarModule, NgIf, ChipModule, NgFor, GalleriaModule, DividerModule, DialogModule, ButtonModule, FormsModule, FileUploadModule, ToastModule, ConfirmDialogModule, InputTextModule, DropdownModule, InputTextareaModule, InputNumberModule, RadioButtonModule],
  providers: [MessageService, AuthService],
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
  updateModelInfo: UpdateModelInfoDTO = {
    modelId: 0,
    firstName: '',
    lastName: '',
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
  };
  eyeColors: string[] = EyeColors;
  skinColors: string[] = SkinColors;
  hairColors: string[] = HairColors
  profilePictureName: string = '';
  formInvalidMessageVisible: boolean = false;
  citySuggestions: any[] = [];
  selectedCity: any = null;
  selectedAddress: any = null;

  highlightedDates: Date[] = [];  // for calendar
  portfolioPosts: PortfolioPostDTO[] = [];
  responsiveOptions: any[] = [];
  responsiveOptionImages: any[] = [];
  // dialogs
  editDialogeVisible: boolean = false;

  constructor(private router: Router, private messageService: MessageService, private http: HttpClient, private authService: AuthService, private route: ActivatedRoute) { }

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
        // set updateModelInfo to modelInfo
        this.updateModelInfo = {
          modelId: this.modelInfo.modelId,
          firstName: this.modelInfo.firstName,
          lastName: this.modelInfo.lastName,
          cityName: this.modelInfo.cityName,
          countryName: this.modelInfo.countryName,
          countryCode: this.modelInfo.countryCode,
          profilePicture: this.modelInfo.profilePicture,
          email: this.modelInfo.email,
          hairColor: this.modelInfo.hairColor,
          skinColor: this.modelInfo.skinColor,
          eyeColor: this.modelInfo.eyeColor,
          height: this.modelInfo.height,
          weight: this.modelInfo.weight,
          gender: this.modelInfo.gender
        };
        this.selectedCity = this.modelInfo.cityName + ', ' + this.modelInfo.countryName;
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

  // for model autocomplete
  selectCitySuggestion(suggestion: any) {
    this.selectedCity = suggestion.display_name;
    const address = suggestion.address;

    this.updateModelInfo.cityName = address.city_district || address.city || address.town || address.village || '';
    this.updateModelInfo.countryName = address.country || '';
    this.updateModelInfo.countryCode = (address.country_code).toUpperCase() || '';

    this.citySuggestions = [];
  }

  onCitySearch(event: any) {
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
      this.citySuggestions = results.filter((result: any) => {
        const address = result.address;
        return address.city || address.town || address.village;
      });
    });
  }

  showToast(severity: string, summary: string, detail: string) {
    this.messageService.add({ severity: severity, summary: summary, detail: detail });
  }

  onImageSelect(event: any, fileUpload: any) {
    const file = event.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.updateModelInfo.profilePicture = e.target.result;
    };
    reader.readAsDataURL(file);
    this.profilePictureName = file.name;
    fileUpload.clear();
  }

  // contry and city from agency and country from model are not required (geocoding i nthe back or filled with autocomplete here)
  formNotValid(): boolean {
    return this.updateModelInfo.firstName === '' || this.updateModelInfo.lastName === '' || this.updateModelInfo.email === '' || this.updateModelInfo.cityName === '' || this.updateModelInfo.profilePicture === '' || this.updateModelInfo.height === 0 || this.updateModelInfo.weight === 0 || this.updateModelInfo.hairColor === '' || this.updateModelInfo.eyeColor === '' || this.updateModelInfo.skinColor === '' || this.updateModelInfo.gender === '';
  }

  updateModel() {
    if (this.formNotValid()) {
      this.formInvalidMessageVisible = true;
      return;
    }
    this.formInvalidMessageVisible = false;
    this.http.put(this.apiUrl + `Model/updateModelInfo/${this.modelInfo.modelId}`, this.updateModelInfo).subscribe(
      (response) => {
        this.showToast('success', 'Success', 'Model info updated successfully');
        setTimeout(() => {
          this.getModelInfo();
          this.editDialogeVisible = false;
        }, 500);
      },
      (error) => {
        console.error('Error updating model info:', error);
        this.showToast('error', 'Error', 'Error updating model info');
      }
    );
  }

}
