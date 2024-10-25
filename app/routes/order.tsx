import { ActionFunctionArgs } from "@remix-run/node";
import { calculateOrder } from "~/api/orderAPI";

export const action = async ({ request }: ActionFunctionArgs) => {
  console.log("INSIDE THE ORDER ACTION");

  const formData = await request.formData();
  console.log("🚀 ~ action ~ formData:", formData);
  const cartLength = Number(formData.get("cartLength"));
  const taxes = new Map<string, number>(
    JSON.parse(formData.get("taxes") as string)
  );
  const discounts = new Map<string, number>(
    JSON.parse(formData.get("discounts") as string)
  );
  const itemDiscountRecord = new Map<string, string[]>(
    JSON.parse(formData.get("itemDiscountRecord") as string)
  );
  const itemTaxRecord = new Map<string, string[]>(
    JSON.parse(formData.get("itemTaxRecord") as string)
  );
  const quantityCounts = new Map<string, number>(
    JSON.parse(formData.get("quantityCounts") as string)
  );

  const order = await calculateOrder(
    {
      cartLength,
      taxes,
      discounts,
      itemDiscountRecord,
      itemTaxRecord,
      quantityCounts,
    },
    request.headers
  );

  return order;
};
