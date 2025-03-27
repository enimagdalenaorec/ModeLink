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

