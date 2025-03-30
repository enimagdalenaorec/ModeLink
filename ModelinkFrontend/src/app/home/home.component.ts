import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModelSearchResultDto } from '../_Models/model';
import { AgencySearchResultDto } from '../_Models/agency';
import { SearchService } from '../_Services/search.service';
import { Subscription } from 'rxjs';
import { NgIf, NgFor } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgIf, NgFor],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {

  models: ModelSearchResultDto[] = [];
  agencies: AgencySearchResultDto[] = [];
  modelsNotFound = false;
  agenciesNotFound = false;
  searchQuery = '';

  private subscriptions: Subscription[] = []; // destroy on OnDestroy

  constructor(private searchService: SearchService, private router: Router) {}

  ngOnInit() {
    // subscribe to the observables from the SearchService
    this.subscriptions.push(
      this.searchService.models$.subscribe(models => {
        this.models = models;
      })
    );
    this.subscriptions.push(
      this.searchService.agencies$.subscribe(agencies => {
        this.agencies = agencies;
      })
    );
    this.subscriptions.push(
      this.searchService.modelsNotFound$.subscribe(notFound => {
        this.modelsNotFound = notFound;
      })
    );
    this.subscriptions.push(
      this.searchService.agenciesNotFound$.subscribe(notFound => {
        this.agenciesNotFound = notFound;
      })
    );
    this.subscriptions.push(
      this.searchService.searchQuery$.subscribe(query => {
        this.searchQuery = query;
      })
    );
  }

  ngOnDestroy() {
    // unsubscribe from all subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  selectSearched(id: number) {
    // navigate to model's profile
    this.router.navigate(['/profile', id]);
    console.log('Selected model id: ', id);
  }

  onImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/images/user.png'; // Fallback image path
  }
}
