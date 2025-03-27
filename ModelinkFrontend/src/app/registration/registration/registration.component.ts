import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgIf, CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FormsModule } from '@angular/forms';
import { RegisterAgencyDto } from '../../_Models/agency';
import { RegisterModelDto, EyeColors, SkinColors, HairColors } from '../../_Models/model';
import { FileUploadModule } from 'primeng/fileupload';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { RadioButtonModule } from 'primeng/radiobutton';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../_Services/auth.service';
import e from 'express';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [NgIf, CommonModule, InputTextModule, InputTextareaModule, FormsModule, FileUploadModule, HttpClientModule, DividerModule, ButtonModule, RadioButtonModule, ToastModule, DropdownModule],
  providers: [MessageService],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent implements OnInit {
  backendUrl: string = environment.apiUrl;
  role: string = '';
  // agency
  agencyName: string = '';
  agencyEmail: string = '';
  agencyPassword: string = '';
  agencyAddress: string = '';
  agencyCity: string = '';
  agencyCountry: string = '';
  agencyDescription: string = '';
  agencyProfilePicture: string = '';
  //model
  modelFirstName: string = '';
  modelLastName: string = '';
  modelEmail: string = '';
  modelPassword: string = '';
  modelGender: string = '';
  modelCity: string = '';
  modelCountryName: string = '';
  modelProfilePicture: string = '';
  modelHeight: number = 0;
  modelWeight: number = 0;
  modelHairColor: string = '';
  modelEyeColor: string = '';
  modelSkinColor: string = '';

  eyeColors: string[] = EyeColors;
  skinColors: string[] = SkinColors;
  hairColors: string[] = HairColors
  //both
  profilePictureName: string = '';
  formInvalidMessageVisible: boolean = false;

  constructor(private authService: AuthService, private route: ActivatedRoute, private http: HttpClient, private router: Router, private messageService: MessageService) { }

  ngOnInit() {
    this.role = this.route.snapshot.paramMap.get('role') ?? '';
    this.getSkinEyeHairColors();
  }

  getSkinEyeHairColors() {
    // call be api
    // for now they are read from models
  }

  showToast(severity: string, summary: string, detail: string) {
    this.messageService.add({ severity: severity, summary: summary, detail: detail });
  }

  onImageSelect(event: any, fileUpload: any) {
    const file = event.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      if (this.role === 'model') this.modelProfilePicture = e.target.result;
      else if (this.role === 'agency') {
        this.agencyProfilePicture = e.target.result;
      }
    };
    reader.readAsDataURL(file);
    this.profilePictureName = file.name;
    fileUpload.clear();
  }

  // contry and city from agency and country from model are not required (geocoding i nthe back or filled with autocomplete here)
  formNotValid() : boolean{
    if (this.role === 'agency') {
      return this.agencyName === '' || this.agencyEmail === '' || this.agencyPassword === '' || this.agencyAddress === '' || this.agencyDescription === '' || this.agencyProfilePicture === '';
    } else if (this.role === 'model') {
      return this.modelFirstName === '' || this.modelLastName === '' || this.modelEmail === '' || this.modelPassword === '' || this.modelCity === '' || this.modelProfilePicture === '' || this.modelHeight === 0 || this.modelWeight === 0 || this.modelHairColor === '' || this.modelEyeColor === '' || this.modelSkinColor === '' || this.modelGender === '';
    } else return false;
  }

  back() {
    this.router.navigate(['/registration-choose-role']);
  }

  register() {
    if (this.formNotValid()) {
      this.formInvalidMessageVisible = true;
      return;
    }
    this.formInvalidMessageVisible = false;
    let registrationRequest = null;
    if (this.role === 'agency') {
      registrationRequest = {
        email: this.agencyEmail,
        password: this.agencyPassword,
        role: this.role,
        name: this.agencyName,
        description: this.agencyDescription,
        address: this.agencyAddress,
        city: this.agencyCity,
        countryName: this.agencyCountry,
        countryCode: '',
        profilePicture: this.agencyProfilePicture
      } as RegisterAgencyDto;
    } else if (this.role === 'model') {
     registrationRequest = {
      email: this.modelEmail,
      password: this.modelPassword,
      role: this.role,
      firstName: this.modelFirstName,
      lastName: this.modelLastName,
      city: this.modelCity,
      countryName: this.modelCountryName,
      countryCode: '',
      height: this.modelHeight,
      weight: this.modelWeight,
      eyeColor: this.modelEyeColor,
      skinColor: this.modelSkinColor,
      hairColor: this.modelHairColor,
      sex: this.modelGender,
      profilePicture: this.modelProfilePicture
     } as RegisterModelDto;
    }

     //call be api
     this.http.post(this.backendUrl + 'Auth/register/' + this.role, registrationRequest).subscribe(
      (response: any) => {
      this.showToast('success', 'Success', 'Registration successful!');
      this.authService.saveToken(response.token);
      setTimeout(() => {
        this.resetForm();
        this.router.navigate(['/home']);
      }, 1000);
    }, (error) => {
      this.showToast('error', 'Error', 'Registration failed!');
    });
  }

  resetForm() {
    this.agencyName = '';
    this.agencyEmail = '';
    this.agencyPassword = '';
    this.agencyAddress = '';
    this.agencyCity = '';
    this.agencyCountry = '';
    this.agencyDescription = '';
    this.agencyProfilePicture = '';
    this.modelFirstName = '';
    this.modelLastName = '';
    this.modelEmail = '';
    this.modelPassword = '';
    this.modelGender = '';
    this.modelCity = '';
    this.modelCountryName = '';
    this.modelProfilePicture = '';
    this.modelHeight = 0;
    this.modelWeight = 0;
    this.modelHairColor = '';
    this.modelEyeColor = '';
    this.modelSkinColor = '';
  }
}
