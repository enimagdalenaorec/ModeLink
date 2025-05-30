import { SuggestedModelDto } from './model';
import { EventCardDto } from './event';

export interface RegisterAgencyDto {
  email: string;
  password: string;
  role: string;
  name: string;
  description?: string;  // optional
  address: string;
  city?: string;  // optional, just the name of the city
  countryName?: string;  // optional
  countryCode?: string;  // optional
  profilePicture: string;  // base64 string
}

export interface AgencySearchResultDto {
  userId: number;
  name: string;
  cityName?: string | null; // null if no city
  countryName?: string | null; // null if no country
  profilePicture: string;
}

export interface SuggestedAgencyDto {
  userId: number;
  name: string;
  cityName?: string | null; // null if no city
  countryName?: string | null; // null if no country
  profilePicture: string;
}

export interface AgencyInfoDto {
  userId: number;
  agencyId: number;
  name: string;
  email: string;
  description?: string;
  address: string;
  profilePicture: string;
  cityName?: string;
  countryName?: string;
  countryCode?: string;
  models?: SuggestedModelDto[];
  events?: EventCardDto[];
  freelancerRequests?: FreelancerRequestForAgency[];
}

export interface FreelancerRequestForAgency {
  requestId: number;
  userModelId: number;
  modelId: number;
  modelFirstName: string;
  modelLastName: string;
  modelProfilePicture: string;
  status: string;   // 'pending', 'accepted', 'declined'
  requestedAt: string; // ISO format datuma ("2025-05-24T12:34:56Z")
  modelCityName?: string; // optional, if model has a city
  modelCountryName?: string; // optional, if model has a country
}

export interface UpdateAgencyInfoDTO {
  agencyId: number;
  name: string;
  email: string;
  description: string;
  cityName: string;
  countryName: string;
  countryCode: string;
  address: string;
  profilePicture: string;
}


// for admin

export interface AgenciesForAdminCrudDTO {
  agencyId: number;
  agencyUserId: number; // UserId of the agency
  name: string;
  description?: string; // nullable if no description
  email: string;
  address: string;
  cityName?: string;
  countryName: string;
  countryCode?: string;
  profilePicture: string; // Base64 string of the profile picture
  models: ModelsForAgenciesForAdminCrudDTO[];
  events: EventsForAgenciesForAdminCrudDTO[];
}

export interface ModelsForAgenciesForAdminCrudDTO {
  modelId: number;
  modelUserId: number; // UserId of the model
  firstName: string;
  lastName: string;
}

export interface EventsForAgenciesForAdminCrudDTO {
  id: number;
  title: string;
}



