import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgIf, CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FormsModule } from '@angular/forms';
import { AgencyRegistrationRequest } from '../../Models/agency';
import { FileUploadModule } from 'primeng/fileupload';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [NgIf, CommonModule, InputTextModule, InputTextareaModule, FormsModule, FileUploadModule, HttpClientModule, DividerModule, ButtonModule],
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
  profilePictureName: string = '';

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) { }

  ngOnInit() {
    this.role = this.route.snapshot.paramMap.get('role') ?? '';
  }

  onImageSelect(event: any, fileUpload: any) {
    const file = event.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.agencyProfilePicture = e.target.result; // Set the image preview
    };
    reader.readAsDataURL(file);
    this.profilePictureName = file.name;
    fileUpload.clear();
  }

  back() {
    this.router.navigate(['/registration-choose-role']);
  }

  register(role: string) {
    if (role === 'agency') {
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
    }
  }
}
