export interface RegisterModelDto {
  email: string;
  password: string;
  role: string;
  firstName: string;
  lastName: string;
  city: string;  // just the name of the city
  countryName?: string;  // optional
  countryCode?: string;  // optional
  height: number;
  weight: number;
  eyeColor: string;
  skinColor: string;
  hairColor: string;
  sex: string;
  profilePicture: string;
}

export const EyeColors = [
  'Blue',
  'Brown',
  'Green',
  'Gray',
  'Hazel',
  'Red',
  'Violet',
  'Black'
];

export const HairColors = [
  'Black',
  'Brunette',
  'Blonde',
  'Red',
  'Ginger',
  'White',
  'Gray',
  'Vibrant color'
];

export const SkinColors = [
  'White',
  'Black',
  'Fair',
  'Beige',
  'Light brown',
  'Dark brown',
  'Medium brown',
  'Dark'
];

export interface ModelSearchResultDto {
  userId: number;
  firstName: string;
  lastName: string;
  agencyName?: string | null; // null if not in an agency
  cityName?: string | null; // null if no city
  countryName?: string | null; // null if no country
  profilePicture: string;
  gender: string | null;
  height: number | null;
  weight: number | null;
  eyeColor: string | null;
  hairColor: string | null;
  skinColor: string | null;
}

export interface SuggestedModelDto {
  userId: number;
  firstName: string;
  lastName: string;
  agencyName?: string | null; // null if not in an agency
  cityName?: string | null; // null if no city
  countryName?: string | null; // null if no country
  profilePicture: string;
}

export interface ModelApplicationForCalendarDTO {
  applicationId: number;
  eventId: number;
  eventName: string;
  eventStart: string; // ISO 8601 string format (DateTime in C#)
  eventFinish: string; // ISO 8601 string format (DateTime in C#)
}

export interface ModelInfoDTO {
  userId: number;
  modelId: number;
  firstName: string;
  lastName: string;
  email: string;
  agencyName: string;
  agencyId: number; // userId of ther agency
  cityName: string;
  countryName: string;
  countryCode: string;
  height: number;
  weight: number;
  eyeColor: string;
  hairColor: string;
  skinColor: string;
  gender: string;
  modelApplications: ModelApplicationForCalendarDTO[];
  profilePicture: string;
}

export interface PortfolioPostDTO {
  id: number;
  title: string;
  description: string;
  createdAt: string; // ISO 8601 string (e.g., "2025-05-07T12:00:00Z")
  images: string[];
}

export interface CreatePortfolioPostDTO {
  title: string;
  description: string;
  images: string[];
}

export interface UpdateModelInfoDTO {
  modelId: number;
  firstName: string;
  lastName: string;
  email: string;
  cityName: string;
  countryName: string;
  countryCode: string;
  height: number; // corresponds to decimal in C#
  weight: number;
  eyeColor: string;
  hairColor: string;
  skinColor: string;
  gender: string;
  profilePicture: string;
}

export interface FreelancerRequestsFromModel {
  userAgencyId: number;
  agencyId: number;
  agencyName: string;
  agencyProfilePicture: string;
  status: string;
  requestedAt: Date;
}



// for admin

export interface ModelsForAdminCrudDTO {
  modelId: number;
  modelUserId: number;
  firstName: string;
  lastName: string;
  agencyName?: string; // nullable if freelancer
  agencyUserId: number;
  cityName?: string;   // nullable if no city
  countryName?: string; // nullable if no country
  height: number;
  weight: number;
  eyeColor: string;
  hairColor: string;
  skinColor: string;
  email: string;
  gender: string;
  profilePicture: string; // Base64 string of the profile picture
  applications: ModelApplicationsForCrudDisplayDTO[];         // will not be included for the 1st fase
  freelancerRequests: FreelancerRequestsForCrudDisplayDTO[];    // will not be included for the 1st fase
  portfolioPosts: PortfolioPostsForCrudDisplayDTO[];    // will not be included for the 1st fase
}

export interface ModelApplicationsForCrudDisplayDTO {
  id: number;
  eventName: string;
}

export interface FreelancerRequestsForCrudDisplayDTO {
  id: number;
  agencyName: string;
}

export interface PortfolioPostsForCrudDisplayDTO {
  id: number;
  title: string;
}
