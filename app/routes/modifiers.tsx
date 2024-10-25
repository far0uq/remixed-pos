import { LoaderFunctionArgs } from "@remix-run/node";
import { getDiscounts, getTaxes } from "~/api/modifiersAPI";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  console.log("LOADING MODIFIERS  API DATA FOR THE FIRST TIME ... ");
  const taxes = await getTaxes(request);
  const discounts = await getDiscounts(request);

  const modifierResp = {
    TaxesResp: taxes,
    DiscountsResp: discounts,
  };

  return modifierResp;
};
