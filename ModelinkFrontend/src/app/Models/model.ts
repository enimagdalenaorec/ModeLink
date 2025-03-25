export class ModelRegistrationRequest {
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  password: string = '';
  city: string = '';
  country: string = '';
  profilePicture: string = '';
  height: number = 0;
  weight: number = 0;
  hairColor: string = '';
  eyeColor: string = '';
  skinColor: string = '';
  gender: string = '';

  constructor(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    city: string,
    country: string,
    profilePicture: string,
    height: number,
    weight: number,
    hairColor: string,
    eyeColor: string,
    skinColor: string,
    gender: string
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
    this.city = city;
    this.country = country;
    this.profilePicture = profilePicture;
    this.height = height;
    this.weight = weight;
    this.hairColor = hairColor;
    this.eyeColor = eyeColor;
    this.skinColor = skinColor
    this.gender = gender;
  }
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
