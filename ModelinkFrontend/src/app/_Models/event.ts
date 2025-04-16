export interface EventCardDto {
  id: number;
  title: string;
  agencyName: string;
  cityName?: string | null;
  countryName?: string | null;
  startDate: string;
  profilePicture?: string | null;
}
