import {
  getCleanedModifierForItem,
  getCleanedModifierForTotal,
} from "../../utils/modifierHelper";
import { TaxOption } from "../../interface/TaxInterface";
import { useTotalStore } from "../../store/store";
import { Select } from "antd";
import { modifierTypes } from "../../types/modifierTypes";
import { useCallback, useEffect, useState } from "react";

const noTaxesOptions: TaxOption[] = [
  {
    value: "no taxes",
    label: "No taxes available",
  },
];

function TaxDropdown({
  taxQuery: taxData,
  productID,
  dropDownType,
  areTaxesLoading,
  taxError,
}: {
  taxQuery: TaxOption[];
  productID: string;
  dropDownType: "order" | "item";
  areTaxesLoading: boolean;
  taxError: boolean;
}) {
  const addTax = useTotalStore((state) => state.addTax);
  const removeTax = useTotalStore((state) => state.removeTax);
  const taxNames = useTotalStore((state) => state.taxNames);
  const taxes = useTotalStore((state) => state.taxes);
  const itemTaxRecord = useTotalStore((state) => state.itemTaxRecord);
  const cartLength = useTotalStore((state) => state.cartLength);

  const [defaultValues, setDefaultValues] = useState<TaxOption[]>([]);

  const handleAddTax = (value: any) => {
    addTax(value.value, productID, dropDownType, value.label);
  };

  const handleRemoveTax = (value: any) => {
    removeTax(value.value, productID, dropDownType);
  };

  const getDefaultTaxes = useCallback(() => {
    if (dropDownType === modifierTypes.modifierTypeItem) {
      return getCleanedModifierForItem(productID, itemTaxRecord, taxNames);
    } else if (dropDownType === modifierTypes.modifierTypeOrder) {
      return getCleanedModifierForTotal(taxes, cartLength, taxNames);
    } else {
      return [];
    }
  }, [dropDownType, productID, itemTaxRecord, taxNames, taxes, cartLength]);

  useEffect(() => {
    console.log("TAX ADDED");
    console.log(taxes);
    const values = getDefaultTaxes();
    setDefaultValues(values);
  }, [itemTaxRecord, taxes, getDefaultTaxes]);

  return (
    <div>
      <Select
        labelInValue
        mode="multiple"
        placeholder={areTaxesLoading ? "Loading taxes..." : "Select taxes"}
        defaultValue={[]}
        value={defaultValues}
        style={{ width: "100%" }}
        options={
          taxData && taxData.length > 0
            ? (taxData as TaxOption[])
            : noTaxesOptions
        }
        onSelect={handleAddTax}
        onDeselect={handleRemoveTax}
        disabled={taxError}
      />
    </div>
  );
}

export default TaxDropdown;
