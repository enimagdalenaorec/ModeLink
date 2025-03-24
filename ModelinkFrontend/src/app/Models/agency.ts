export class AgencyRegistrationRequest {
  name: string = '';
  email: string = '';
  password: string = '';
  address: string = '';
  city: string = '';
  country: string = '';
  description: string = '';
  profilePicture: string = '';

  constructor(
    name: string,
    email: string,
    password: string,
    address: string,
    city: string,
    country: string,
    description: string,
    profilePicture: string
  ) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.address = address;
    this.city = city;
    this.country = country;
    this.description = description;
    this.profilePicture = profilePicture;
  }
}
