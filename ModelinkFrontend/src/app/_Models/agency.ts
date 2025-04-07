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
