import { Select } from "antd";
import { useCallback, useEffect, useState } from "react";
import { DiscountOption } from "../../interface/DiscountInterface";
import { useTotalStore } from "../../store/store";
import {
  getCleanedModifierForItem,
  getCleanedModifierForTotal,
} from "../../utils/modifierHelper";
import { modifierTypes } from "../../types/modifierTypes";

const noDiscountsOptions: DiscountOption[] = [
  {
    value: "no discounts",
    label: "No discounts available",
  },
];

function DiscountDropdown({
  discountQuery: discountData,
  productID,
  dropDownType,
  areDiscountsLoading,
  discountError,
}: {
  discountQuery: DiscountOption[];
  productID: string;
  dropDownType: "order" | "item";
  areDiscountsLoading: boolean;
  discountError: boolean;
}) {
  const addDiscount = useTotalStore((state) => state.addDiscount);
  const removeDiscount = useTotalStore((state) => state.removeDiscount);
  const discountNames = useTotalStore((state) => state.discountNames);
  const discounts = useTotalStore((state) => state.discounts);
  const itemDiscountRecord = useTotalStore((state) => state.itemDiscountRecord);
  const cartLength = useTotalStore((state) => state.cartLength);

  const [defaultValues, setDefaultValues] = useState<DiscountOption[]>([]);

  const handleAddDiscount = (value: any) => {
    addDiscount(value.value, productID, dropDownType, value.label as string);
  };

  const handleRemoveDiscount = (value: any) => {
    removeDiscount(value.value, productID, dropDownType);
  };

  const getDefaultDiscounts = useCallback(() => {
    if (dropDownType === modifierTypes.modifierTypeItem) {
      return getCleanedModifierForItem(
        productID,
        itemDiscountRecord,
        discountNames
      );
    } else if (dropDownType === modifierTypes.modifierTypeOrder) {
      return getCleanedModifierForTotal(discounts, cartLength, discountNames);
    }
    return [];
  }, [
    itemDiscountRecord,
    discounts,
    cartLength,
    productID,
    discountNames,
    dropDownType,
  ]);

  useEffect(() => {
    const values = getDefaultDiscounts();
    setDefaultValues(values);
  }, [itemDiscountRecord, discounts, getDefaultDiscounts]);

  return (
    <div>
      <Select
        labelInValue
        mode="multiple"
        placeholder={
          areDiscountsLoading ? "Loading discounts..." : "Select discounts"
        }
        defaultValue={[]}
        value={defaultValues}
        style={{ width: "100%" }}
        options={
          discountData && discountData.length > 0
            ? (discountData as DiscountOption[])
            : noDiscountsOptions
        }
        onSelect={handleAddDiscount}
        onDeselect={handleRemoveDiscount}
        disabled={discountError}
      />
    </div>
  );
}

export default DiscountDropdown;
