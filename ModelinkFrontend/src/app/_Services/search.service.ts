import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ModelSearchResultDto } from '../_Models/model';
import { AgencySearchResultDto } from '../_Models/agency';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private modelsNotFound = new BehaviorSubject<boolean>(false);
  modelsNotFound$ = this.modelsNotFound.asObservable();

  private agenciesNotFound = new BehaviorSubject<boolean>(false);
  agenciesNotFound$ = this.agenciesNotFound.asObservable();

  private searchQuery = new BehaviorSubject<string>('');
  searchQuery$ = this.searchQuery.asObservable();

  private models = new BehaviorSubject<ModelSearchResultDto[]>([]);
  models$ = this.models.asObservable();

  private agencies = new BehaviorSubject<AgencySearchResultDto[]>([]);
  agencies$ = this.agencies.asObservable();

  setSearchQuery(query: string) {
    this.searchQuery.next(query);
  }

  setModelsNotFound(value: boolean) {
    this.modelsNotFound.next(value); // update models not found status
  }

  setAgenciesNotFound(value: boolean) {
    this.agenciesNotFound.next(value); // update agencies not found status
  }

  setModels(models: ModelSearchResultDto[]) {
    this.models.next(models); // update models list
  }

  setAgencies(agencies: AgencySearchResultDto[]) {
    this.agencies.next(agencies); // update agencies list
  }
}
