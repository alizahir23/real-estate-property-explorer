import { Key } from "react";

export interface Property {
  id: Key;
  City: string;
  Community?: string;
  Subcommunity?: string;
  Property?: string;
  price: number;
}
