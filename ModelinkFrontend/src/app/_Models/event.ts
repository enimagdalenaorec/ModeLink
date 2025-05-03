export interface EventCardDto {
  id: number;
  title: string;
  agencyName: string;
  cityName?: string | null;
  countryName?: string | null;
  startDate: string;
  profilePicture?: string | null;
}

export interface ModelApplicationOverviewDto {
  id: number; // userId of the model
  firstName: string;
  lastName: string;
  profilePicture?: string;
}

export interface EventDetailsDto {
  id: number;
  title: string;
  description: string;
  address: string;
  cityName?: string;
  countryName?: string;
  countryCode?: string;
  latitude?: number;
  longitude?: number;
  eventStart: string; // ISO date string
  eventFinish?: string; // ISO date string
  profilePicture: string;
  status: string;
  agencyName: string;
  modelApplications: ModelApplicationOverviewDto[]; // id is the userId of the model
  isAttending: boolean;
}

export interface UpdateEventDto {
  id: number;
  title: string;
  description: string;
  address: string;
  cityName?: string;
  countryName?: string;
  countryCode?: string;
  latitude?: number;
  longitude?: number;
  eventStart: Date; // ISO date string
  eventFinish?: Date; // ISO date string
  profilePicture?: string; // base64
  status?: string; // "active"  "inactive"
}
