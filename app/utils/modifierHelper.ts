import { Discount, DiscountOption } from "~/interface/DiscountInterface";
import { Tax, TaxOption } from "~/interface/TaxInterface";

export const getCleanedModifierForItem = (
  productID: string,
  itemModifierRecord: Map<string, string[]>,
  modifierNames: Map<string, string>
) => {
  const itemModifiers = itemModifierRecord.get(productID);
  if (!itemModifiers) return [];
  const cleanedModifiers = itemModifiers.map((modifier) => ({
    value: modifier,
    label: modifierNames.get(modifier) as string,
  }));
  return cleanedModifiers;
};

export const getCleanedModifierForTotal = (
  modifiers: Map<string, number>,
  cartLength: number,
  modifierNames: Map<string, string>
) => {
  const modifierArray = Array.from(modifiers);
  if (modifierArray.length === 0) return [];

  const cleanedModifiers = [];
  for (const modifier of modifierArray) {
    if (modifier[1] === cartLength) {
      cleanedModifiers.push({
        value: modifier[0],
        label: modifierNames.get(modifier[0]) as string,
      });
    }
  }
  return cleanedModifiers;
};

export const cleanDiscounts = (discounts: Discount[]): DiscountOption[] => {
  const cleanedDiscounts = discounts.map((discount) => ({
    value: discount.id,
    label: discount.name,
  }));
  return cleanedDiscounts;
};

export const cleanTaxes = (taxes: Tax[]): TaxOption[] => {
  const cleanedTaxes = taxes.map((tax) => ({
    value: tax.id,
    label: tax.name,
  }));
  return cleanedTaxes;
};
