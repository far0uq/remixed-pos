import { DiscountID, ProductID, TaxID } from "./CartInterface";

export interface Order {
  order: OrderStructure;
}
export interface OrderStructure {
  locationId: string;
  lineItems: LineItem[];
  taxes: OrderTax[];
  discounts: OrderDiscount[];
}

export interface LineItem {
  quantity: string;
  catalogObjectId: string;
  itemType: string;
  appliedTaxes: AppliedTax[] | [];
  appliedDiscounts: AppliedDiscount[] | [];
}

export interface OrderTax {
  uid: string;
  scope: string;
  catalogObjectId: string;
}

export interface OrderDiscount {
  uid: string;
  scope: string;
  catalogObjectId: string;
}

export interface AppliedDiscount {
  discountUid: string;
}

export interface AppliedTax {
  taxUid: string;
}

export interface OrderResponse {
  totalTaxMoney: number;
  totalDiscountMoney: number;
  totalMoney: number;
}

export interface LineItemResponseCleaned {
  uid: string;
  totalTaxMoney: number;
  totalMoney: number;
  totalDiscountMoney: number;
}

export interface OrderTotalResponseObject {
  orderResponse: OrderResponse;
  lineItemDetails: LineItemResponseCleaned[];
}

export interface LineItemResponse {
  uid: string;
  name: string;
  quantity: string;
  catalogObjectId: string;
  catalogVersion: number;
  variationName: string;
  itemType: string;
  basePriceMoney: Amount;
  variationTotalPriceMoney: Amount;
  grossSalesMoney: Amount;
  totalTaxMoney: Amount;
  totalDiscountMoney: Amount;
  totalMoney: Amount;
  totalServiceChargeMoney: Amount;
}

export interface Amount {
  amount: number;
  currency: string;
}

export interface OrderState {
  cartLength: number;
  taxes: Map<TaxID, number>;
  discounts: Map<DiscountID, number>;
  itemDiscountRecord: Map<ProductID, DiscountID[]>;
  itemTaxRecord: Map<ProductID, TaxID[]>;
  quantityCounts: Map<ProductID, number>;
}

export interface TotalResponse {
  lineItemResponse: LineItemResponse[];
  orderResponse: OrderResponse;
}
