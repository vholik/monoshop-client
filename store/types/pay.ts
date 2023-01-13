export interface PayFormData {
  fullName: string;
  adressLineFirst: string;
  adressLineSecond?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  email: string;
  phone?: string;
}
