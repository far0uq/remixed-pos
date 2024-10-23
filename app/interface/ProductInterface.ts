export interface Product {
  id: string;
  name: string;
  price: number;
  priceExists: boolean;
  image: string;
}

export interface CatalogProductAPI {
  catalogObjectId: string;
  name: string;
  variations: {
    variationId: string;
    price: {
      amount: number;
    };
  }[];
  image: string;
}

export interface ProductGroup {
  result: Product[];
  cursor: string;
}

export interface CartProduct extends Product {
  appliedTaxes: string[];
  appliedDiscounts: string[];
}
