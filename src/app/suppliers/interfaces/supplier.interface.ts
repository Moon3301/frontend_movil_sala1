import { Company } from "./company.interface";

export interface Supplier {

  id: number;
  status: string;
  contact_info: string;
  companyIds: number[];
  promotions: number[];
  userId: number;

}

export interface ISupplier {
  id: number;
  status: string;
  contact_info: string;
  companies: Company[];
}
