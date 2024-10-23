export interface Tax {
  id: string;
  name: string;
  percentage: string;
}

export interface TaxOption {
  value: string;
  label: string;
}

export interface TaxQuery {
  taxesData: TaxOption[] | undefined;
  taxesError: unknown;
  taxesAreError: boolean;
  taxesAreLoading: boolean;
}
