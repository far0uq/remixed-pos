import {
  OrderState,
  Order,
  LineItemResponseCleaned,
  LineItemResponse,
  OrderResponse,
} from "../interface/OrderInterface";
import { TaxID, ProductID, DiscountID } from "../interface/CartInterface";
import { getSession } from "~/services/session";
import { tokenTypes } from "~/types/tokenTypes";

const getAppliedTaxes = (
  lineItemTaxes: TaxID[],
  taxes: Map<TaxID, number>,
  cartLength: number
) => {
  const appliedTaxes = [];
  for (const lineItemTax of lineItemTaxes) {
    const taxOnProducts = taxes.get(lineItemTax) as number;
    if (!(taxOnProducts === cartLength)) {
      appliedTaxes.push({
        taxUid: lineItemTax,
      });
    }
  }

  return appliedTaxes;
};

const getAppliedDiscounts = (
  lineItemDiscounts: DiscountID[],
  discounts: Map<DiscountID, number>,
  cartLength: number
) => {
  const appliedDiscounts = [];
  for (const lineItemDiscount of lineItemDiscounts) {
    const discountsOnProducts = discounts.get(lineItemDiscount) as number;
    if (!(discountsOnProducts === cartLength)) {
      appliedDiscounts.push({
        discountUid: lineItemDiscount,
      });
    }
  }

  return appliedDiscounts;
};

const getOrderObject = (
  cartLength: number,
  taxes: Map<TaxID, number>,
  discounts: Map<DiscountID, number>,
  itemTaxRecord: Map<ProductID, TaxID[]>,
  itemDiscountRecord: Map<ProductID, DiscountID[]>,
  quantityCounts: Map<ProductID, number>
): Order => {
  const taxesArray = Array.from(taxes);
  const refinedTaxes = taxesArray.map((tax) => {
    const taxID = tax[0];
    const taxOnProducts = tax[1];

    return {
      uid: taxID,
      scope: taxOnProducts === cartLength ? "ORDER" : "LINE_ITEM",
      catalogObjectId: taxID,
    };
  });

  const discountsArray = Array.from(discounts);
  const refinedDiscounts = discountsArray.map((discount) => {
    const discountID = discount[0];
    const discountsOnProducts = discount[1];

    return {
      uid: discountID,
      scope: discountsOnProducts === cartLength ? "ORDER" : "LINE_ITEM",
      catalogObjectId: discountID,
    };
  });

  const quantityCountsArray = Array.from(quantityCounts);

  const refinedLineItems = quantityCountsArray.map((lineItem) => {
    const lineItemID = lineItem[0];
    const lineItemQuantity = lineItem[1];
    const lineItemDiscounts = itemDiscountRecord.get(lineItemID) ?? [];
    const lineItemTaxes = itemTaxRecord.get(lineItemID) ?? [];

    return {
      quantity: lineItemQuantity.toString(),
      catalogObjectId: lineItemID,
      itemType: "ITEM",

      appliedTaxes: getAppliedTaxes(lineItemTaxes, taxes, cartLength),
      appliedDiscounts: getAppliedDiscounts(
        lineItemDiscounts,
        discounts,
        cartLength
      ),
    };
  });

  return {
    order: {
      locationId: process.env.LOCATION_ID as string,
      lineItems: refinedLineItems,
      taxes: refinedTaxes,
      discounts: refinedDiscounts,
    },
  };
};

const fetchOrderFromAPI = async (order: Order, headers: Headers) => {
  try {
    const cookieHeader = headers.get("Cookie");
    if (!cookieHeader) {
      throw new Error("No cookies found in request.");
    }

    const session = await getSession(cookieHeader);
    const token = session.get(tokenTypes.tokenTypeAPI);

    if (!token) {
      throw new Error("Could not retrieve token from Session.");
    }

    const response = await fetch("http://localhost:5000/api/calculate-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(order),
    });

    const { result } = await response.json();

    if (response.status !== 200) {
      throw new Error(
        "Error calculating the order, check API. An Items price is variable."
      );
    }

    const lineItemDetails: LineItemResponseCleaned[] = result.lineItems.map(
      (lineItem: LineItemResponse) => {
        return {
          uid: lineItem.catalogObjectId,
          totalTaxMoney: lineItem.totalTaxMoney?.amount ?? 0,
          totalMoney: lineItem.totalMoney?.amount ?? 0,
          totalDiscountMoney: lineItem.totalDiscountMoney?.amount ?? 0,
        };
      }
    );

    const orderResponse: OrderResponse = {
      totalTaxMoney: result.totalTaxMoney?.amount ?? 0,

      totalDiscountMoney: result.totalDiscountMoney?.amount ?? 0,

      totalMoney: result.totalMoney?.amount,
    };

    return new Response(
      JSON.stringify({ data: { orderResponse, lineItemDetails } }),
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ error }), {
      status: 500,
    });
  }
};

export const calculateOrder = async (
  orderInfo: OrderState,
  headers: Headers
) => {
  const order = getOrderObject(
    orderInfo.cartLength,
    orderInfo.taxes,
    orderInfo.discounts,
    orderInfo.itemTaxRecord,
    orderInfo.itemDiscountRecord,
    orderInfo.quantityCounts
  );

  console.log(order);

  return fetchOrderFromAPI(order, headers);
};
