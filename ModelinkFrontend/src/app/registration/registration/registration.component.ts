import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgIf, CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FormsModule } from '@angular/forms';
import { AgencyRegistrationRequest } from '../../Models/agency';
import { ModelRegistrationRequest } from '../../Models/model';
import { FileUploadModule } from 'primeng/fileupload';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [NgIf, CommonModule, InputTextModule, InputTextareaModule, FormsModule, FileUploadModule, HttpClientModule, DividerModule, ButtonModule, RadioButtonModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent implements OnInit {
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
  modelCountry: string = '';
  modelProfilePicture: string = '';
  modelHeight: number = 0;
  modelWeight: number = 0;
  modelHairColor: string = '';
  modelEyeColor: string = '';
  modelSkinColor: string = '';
  //both
  profilePictureName: string = '';
  formInvalidMessageVisible: boolean = false;

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) { }

  ngOnInit() {
    this.role = this.route.snapshot.paramMap.get('role') ?? '';
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
    if (this.role === 'agency') {
      const agency = new AgencyRegistrationRequest(
        this.agencyName,
        this.agencyEmail,
        this.agencyPassword,
        this.agencyAddress,
        this.agencyCity,
        this.agencyCountry,
        this.agencyDescription,
        this.agencyProfilePicture
      );
    } else if (this.role === 'model') {
      const model = new ModelRegistrationRequest(
        this.modelFirstName,
        this.modelLastName,
        this.modelEmail,
        this.modelPassword,
        this.modelCity,
        this.modelCountry,
        this.modelProfilePicture,
        this.modelHeight,
        this.modelWeight,
        this.modelHairColor,
        this.modelEyeColor,
        this.modelSkinColor,
        this.modelGender
      );
    }
    //reset
    this.resetForm();
    this.formInvalidMessageVisible = false;
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
    this.modelCountry = '';
    this.modelProfilePicture = '';
    this.modelHeight = 0;
    this.modelWeight = 0;
    this.modelHairColor = '';
    this.modelEyeColor = '';
    this.modelSkinColor = '';
  }
}
