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
  'Brown',
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
