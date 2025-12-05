export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  gender: string;
  subscriptionStartDate?: string; // ISO string
  subscriptionEndDate?: string; // ISO string
}
